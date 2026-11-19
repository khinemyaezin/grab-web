# Seller Portal Runbook & Developer Operations

## 1. Monorepo Architecture Reference

The Seller Frontend Platform is organized as a Turborepo + pnpm workspace with **6 applications** and **3 shared packages**:

```text
grab-web/
├── apps/
│   ├── grab-seller/             # Host / Shell Container (Port 3000)
│   ├── grab-seller-product/     # Product Remote MFE (Port 3001)
│   ├── grab-seller-inventory/   # Inventory Remote MFE (Port 3002)
│   ├── grab-seller-auth/        # Auth Remote MFE (Port 3003)
│   ├── grab-seller-account/     # Account & Onboarding Remote MFE (Port 3004)
│   └── grab-seller-pricing/     # Pricing Remote MFE (Port 3005)
├── packages/
│   ├── seller-contracts/        # Shared API schemas, event topics & routes (@khinemyaezin/seller-contracts)
│   ├── seller-api/              # HTTP transport & TanStack Query clients (@khinemyaezin/seller-api)
│   └── seller-ui/               # Shared design system, UI components & slots (@khinemyaezin/seller-ui)
├── tools/
│   └── vite/                    # Shared Vite & Module Federation config helpers
└── docker/
    └── app.Dockerfile           # Multi-stage container build with turbo prune
```

---

## 2. Ports and Environment Variables

All ports and endpoints can be customized via `.env` or process environment variables:

| Application    | Package Name            | Port Env Var     | Default Port | Base Path                | MF Manifest URL                          |
| :------------- | :---------------------- | :--------------- | :----------- | :----------------------- | :--------------------------------------- |
| **Shell Host** | `grab-seller`           | `SELLER_PORT`    | `3000`       | `/`                      | —                                        |
| **Product**    | `grab-seller-product`   | `PRODUCT_PORT`   | `3001`       | `/mfe/seller-product/`   | `http://localhost:3001/mf-manifest.json` |
| **Inventory**  | `grab-seller-inventory` | `INVENTORY_PORT` | `3002`       | `/mfe/seller-inventory/` | `http://localhost:3002/mf-manifest.json` |
| **Auth**       | `seller-auth`           | `AUTH_PORT`      | `3003`       | `/mfe/seller-auth/`      | `http://localhost:3003/mf-manifest.json` |
| **Account**    | `seller-account`        | `ACCOUNT_PORT`   | `3004`       | `/mfe/seller-account/`   | `http://localhost:3004/mf-manifest.json` |
| **Pricing**    | `grab-seller-pricing`   | `PRICING_PORT`   | `3005`       | `/mfe/seller-pricing/`   | `http://localhost:3005/mf-manifest.json` |

### Environment Variables (.env)

```env
# API backend target and shell origin
VITE_API_URL=http://localhost:8080
VITE_ORIGIN=http://localhost:3000

# Port configurations
SELLER_PORT=3000
PRODUCT_PORT=3001
INVENTORY_PORT=3002
AUTH_PORT=3003
ACCOUNT_PORT=3004
PRICING_PORT=3005

# Module Federation type artifact overrides (optional in dev)
MF_AUTH_TYPES_URL=http://localhost:3003/@mf-types.d.ts
MF_ACCOUNT_TYPES_URL=http://localhost:3004/@mf-types.d.ts
MF_PRODUCT_TYPES_URL=http://localhost:3001/@mf-types.d.ts
MF_INVENTORY_TYPES_URL=http://localhost:3002/@mf-types.d.ts
MF_PRICING_TYPES_URL=http://localhost:3005/@mf-types.d.ts
```

---

## 3. Local Development Startup

### Prerequisites

- **Node.js**: `>= 20.19.0` (Recommended: Node 22 LTS)
- **pnpm**: `11.15.1` (or `>= 9.0.0`)
- **Docker**: Optional, required for container smoke checks

### Startup Workflows

#### A. Start All Applications Concurrently

```bash
pnpm dev
# or
./start-dev.sh
```

Access the unified portal at: [http://localhost:3000](http://localhost:3000).

#### B. Start Subset of Applications

```bash
# Start shell + auth + account
./start-dev.sh grab-seller grab-seller-auth grab-seller-account
# or using turbo filter
pnpm turbo dev --filter=grab-seller --filter=seller-auth --filter=seller-account
```

#### C. Run a Remote in Standalone Mode

Each remote application can be run independently without starting the shell host:

```bash
# Run Account / Onboarding standalone on port 3004
pnpm --filter seller-account dev

# Run Product remote standalone on port 3001
pnpm --filter grab-seller-product dev

# Run Inventory remote standalone on port 3002
pnpm --filter grab-seller-inventory dev

# Run Pricing remote standalone on port 3005
pnpm --filter grab-seller-pricing dev
```

Each standalone app mounts via `createStandalonePlatform` with a mock authenticated session, host event bus, and integrated local React Router navigation.

---

## 4. Module Federation Type Generation (`mf:types`)

The shell host consumes remote route and widget declarations through TypeScript declarations located at `apps/grab-seller/@mf-types`.

### Commands

```bash
# Full deterministic generation (builds packages & remotes, serves, consumes types)
pnpm mf:types

# Fast check that all required declarations exist in apps/grab-seller/@mf-types
pnpm check:mf-types
```

### Why `MF_DTS=0`?

During daily development and CI builds, `MF_DTS=0` is set (`MF_DTS=0 turbo build`). This disables the runtime `@module-federation/dts-plugin` download step because the declarations are already generated and verified in `apps/grab-seller/@mf-types`. This yields sub-second builds and eliminates flaky remote download races.

### Troubleshooting Missing Types

If `tsc -b` fails with:
`Cannot find module 'grab_seller_auth/Routes' or its corresponding type declarations.`

1. Run `pnpm mf:types` to regenerate declarations.
2. Confirm with `pnpm check:mf-types`.
3. If still missing, verify that the remote exposes the module in its `vite.config.ts`.

---

## 5. Server-Sent Events (SSE) Debugging

The platform uses a single, host-owned Server-Sent Events connection (`GET /api/v1/events/stream`) via `fetch + ReadableStream` (ADR-004).

### Verifying SSE Upstream with curl

```bash
# Test backend stream with buffering disabled (-N)
curl -N -v -H "Accept: text/event-stream" http://localhost:8080/api/v1/events/stream
```

### Common Issues

1. **Stream Buffering / Delays:**
   - Ensure the reverse proxy has buffering turned off (`proxy_buffering off;` in Nginx, `timeout: 0` and `proxyTimeout: 0` in Vite).
2. **Infinite 401 Loops:**
   - The stream lifecycle hook in `AuthProvider` only connects when `session.status === "authenticated"`. Upon 401 refresh failure, `session.expire()` aborts the stream and redirects to login without reconnect attempts.
3. **Multi-Tab Reconnect:**
   - Returning to an inactive tab triggers tab visibility revalidation. The stream remains active while authenticated.

---

## 6. Docker and Containerized Verification

### Building and Running Containers

```bash
# 1. Create external network
docker network create grab-dev-network

# 2. Build and start all services
docker compose up --build

# 3. View status
docker compose ps
```

### Container Smoke Check

Run the automated smoke test script to build the shell and an auth remote, launch them in containers, and verify health endpoints:

```bash
pnpm docker:smoke
```

---

## 7. Verification & Release Checklist

Before submitting PRs or deploying releases:

```bash
# 1. Quick local verification (fast checks with existing @mf-types)
pnpm verify:fast

# 2. Strict type verification across packages
pnpm typecheck:strict

# 3. Clean checkout verification (regenerates types from scratch)
pnpm verify

# 4. Container smoke check
pnpm docker:smoke
```

### Manual Smoke Matrix

- [ ] **Cold load with valid cookie**: Profile loads once; shell renders authenticated.
- [ ] **Cold load with no cookie**: Profile returns 401; redirects to `/login`.
- [ ] **Expired access cookie**: Request returns 401 → refresh succeeds → request retried once without logout.
- [ ] **Invalid refresh cookie**: Refresh returns 401 → session expires → redirect to login without looping.
- [ ] **Navigation**: Navigating between Dashboard, Products, Inventory, and Pricing maintains single SSE connection.
- [ ] **Workflow completion**: Creating a product awaits backend completion through `workflow:updated:v1` even when navigating away.
- [ ] **Standalone demo**: Every remote starts on its dedicated port with `pnpm --filter <app> dev`.
