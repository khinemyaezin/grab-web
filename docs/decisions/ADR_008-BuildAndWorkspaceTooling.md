# Build and Workspace Tooling

## Status

Accepted (implemented in Remediation Plan Phase 7)

---

## 1. Context

The Seller Frontend Platform consists of **6 applications** (1 host shell, 5 remote MFEs) and **3 shared packages** orchestrated via **Turborepo** and **pnpm workspaces**.

Prior to this decision, the build and workspace tooling suffered from several failure modes:

1. **Config Drift Across Vite Files:** Remote Vite configurations duplicated module federation setups, resulting in subtle divergences (e.g. `apps/grab-seller-account` checking `env.NODE_ENV === "development"` instead of `mode === "development"`, inconsistent `minify: false` and `cssCodeSplit` flags, missing `X-Platform` headers on development proxies).
2. **Module Federation Type Generation Flakiness:** Having `@module-federation/dts-plugin` download declarations dynamically during `vite build` created network races, slow CI runs, and chicken-and-egg compilation failures when typechecking the shell with `tsc -b`.
3. **Container Context Gaps:** `docker/app.Dockerfile` relies on `turbo prune --docker`. Because `@mf-types` is gitignored on the host, pruned builds lacked remote declarations, causing shell image builds to fail during `tsc -b`.
4. **Standalone App Divergence:** Standalone development apps in remotes constructed divergent ad-hoc mock platform objects or logged warnings instead of routing locally.

---

## 2. Decision

### 2.1 Shared Vite Configuration Helpers

We consolidate Vite configuration into shared helpers located under `tools/vite/`:

- **`tools/vite/shared.ts`**: Canonical definitions of ports (`DEFAULT_PORTS`), shared dependencies (`SHARED_DEPENDENCIES` with singletons for React 19, React Router 7, TanStack Query 5, etc.), remote metadata (`REMOTE_DEFINITIONS`), and URL resolution helpers (`resolveRemoteTypeUrls`).
- **`tools/vite/create-remote-config.ts`**: Standardized factory for remote MFEs. Sets `base` using `mode === "development"`, standardizes `/api` proxy with SSE timeouts (`timeout: 0`, `proxyTimeout: 0`) and `X-Platform` headers, configures DTS generation, and enforces `chrome111` build target and `cssCodeSplit: false`.
- **`tools/vite/create-host-config.ts`**: Standardized factory for the shell host. Configures DTS consumption with `abortOnError: true`, builds reverse-proxy tables for all remotes, and provides shared dependency singletons.

Per-app overrides (e.g., additional plugins, extra shared libraries such as `recharts` for inventory) are passed explicitly without obscuring app behavior.

### 2.2 Environment-Driven Ports and Configuration

All development server ports and container port mappings are environment-driven with stable defaults:

- `SELLER_PORT=3000`
- `PRODUCT_PORT=3001`
- `INVENTORY_PORT=3002`
- `AUTH_PORT=3003`
- `ACCOUNT_PORT=3004` (with `ONBOARDING_PORT` fallback)
- `PRICING_PORT=3005`

Type artifact URLs can be overridden via `MF_*_TYPES_URL` variables.

### 2.3 Two-Phase Type Generation & Fast Builds

- **Type Generation Phase (`pnpm mf:types`):** Remotes are built with `MF_DTS=1`, served via temporary HTTP servers, and consumed into `apps/grab-seller/@mf-types`. Fast verification is available via `pnpm check:mf-types`.
- **Fast Build Phase (`MF_DTS=0 pnpm build`):** Once declarations exist, subsequent builds run with `MF_DTS=0`. TypeScript (`tsc -b`) resolves remote module declarations directly from disk, eliminating network dependencies and speeding up builds.

### 2.4 Container Build Strategy

- `docker/app.Dockerfile` explicitly copies the pre-generated `apps/grab-seller/@mf-types` into the build container.
- `.dockerignore` contains `!apps/grab-seller/@mf-types` to ensure declarations are not stripped from the build context.
- An automated smoke script (`scripts/docker-smoke.sh` / `pnpm docker:smoke`) verifies that the shell and remote containers build and pass healthchecks.

### 2.5 Unified Standalone Platform

All remote `StandaloneApp.tsx` entrypoints use `createStandalonePlatform` from `@khinemyaezin/seller-api`. It provides:

- A mock authenticated session snapshot with `subscribe`, `refresh`, `expire`, and `logout`.
- An integrated host event bus (`createHostEventBus`).
- A navigation handler wired directly to the local React Router `useNavigate` hook.
- A pre-configured API client pointed at `/api/v1`.

---

## 3. Consequences

### Positive

- **Zero Config Drift:** All 6 Vite configurations share identical base path logic, proxy headers, shared package singletons, and build targets.
- **Fast and Deterministic CI:** CI runs `types` once, uploads `@mf-types`, and parallel downstream jobs (`quality`, `build`, `docker-smoke`) consume the artifact without rebuilding types.
- **Local Remote Autonomy:** Developers can run `pnpm --filter <remote> dev` on isolated ports with authentic navigation and session behavior without booting the shell.
- **Reproducible Docker Builds:** Container builds are guaranteed to succeed because declarations are pre-generated on the runner/host and baked into the build context.

### Negative / Trade-offs

- Running a clean build from an empty checkout requires `pnpm mf:types` before `pnpm build`. This is automated in `pnpm verify`.
- Adding new remotes requires updating `tools/vite/shared.ts` in addition to the app's `vite.config.ts`.
