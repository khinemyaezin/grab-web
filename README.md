# Seller Frontend Platform (Monorepo)

Welcome to the **Seller Frontend Platform**. It is a comprehensive ecosystem designed for seller operations, built using a modern **Micro-Frontend (MFE)** architecture powered by **Vite Module Federation**, **pnpm workspaces**, and **Turborepo**.

---

## 🏗️ Repository Layout

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
├── docker/
│   └── app.Dockerfile           # Optimized multi-stage build using turbo prune
├── compose.yaml                 # Local containerized orchestration
├── pnpm-workspace.yaml          # pnpm workspace definition
└── turbo.json                   # Root task pipeline and caching rules
```

---

## 🌐 Port Allocations & Environment

| Application                 | Package Name            | Port Env Var     | Default Port | Base Path                | MF Manifest URL                          |
| :-------------------------- | :---------------------- | :--------------- | :----------- | :----------------------- | :--------------------------------------- |
| **`grab-seller`**           | `grab-seller`           | `SELLER_PORT`    | `3000`       | `/`                      | — (Host Shell)                           |
| **`grab-seller-product`**   | `grab-seller-product`   | `PRODUCT_PORT`   | `3001`       | `/mfe/seller-product/`   | `http://localhost:3001/mf-manifest.json` |
| **`grab-seller-inventory`** | `grab-seller-inventory` | `INVENTORY_PORT` | `3002`       | `/mfe/seller-inventory/` | `http://localhost:3002/mf-manifest.json` |
| **`grab-seller-auth`**      | `seller-auth`           | `AUTH_PORT`      | `3003`       | `/mfe/seller-auth/`      | `http://localhost:3003/mf-manifest.json` |
| **`grab-seller-account`**   | `seller-account`        | `ACCOUNT_PORT`   | `3004`       | `/mfe/seller-account/`   | `http://localhost:3004/mf-manifest.json` |
| **`grab-seller-pricing`**   | `grab-seller-pricing`   | `PRICING_PORT`   | `3005`       | `/mfe/seller-pricing/`   | `http://localhost:3005/mf-manifest.json` |

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites

- **Node.js**: `>= 20.19.0`
- **pnpm**: `11.15.1` (or `>= 9.0.0`)

### 2. Install Dependencies

```bash
pnpm install
```

All shared packages (`@khinemyaezin/seller-contracts`, `@khinemyaezin/seller-api`, `@khinemyaezin/seller-ui`) are automatically linked via `workspace:*`.

### 3. Start Development Servers

Start all applications concurrently:

```bash
pnpm dev
# or
./start-dev.sh
```

Start specific applications only:

```bash
./start-dev.sh grab-seller grab-seller-auth grab-seller-account
# or
pnpm turbo dev --filter=grab-seller --filter=seller-auth
```

Run a remote independently in standalone mode:

```bash
pnpm --filter seller-account dev
```

### 4. Build, Typecheck, and Test

```bash
# Fast build with pre-generated Module Federation declarations
pnpm build

# Typecheck the entire monorepo
pnpm typecheck

# Strict typecheck on shared packages
pnpm typecheck:strict

# Run unit & integration test suites
pnpm test

# Full verification (type generation, lint, typecheck, test, build, boundaries)
pnpm verify

# Fast verification (when @mf-types declarations are already present)
pnpm verify:fast
```

---

## 🧩 Module Federation Type Generation

The shell host uses pre-generated TypeScript declarations from remotes stored in `apps/grab-seller/@mf-types`:

```bash
# Regenerate all remote declarations
pnpm mf:types

# Verify all shell imports have matching declarations
pnpm check:mf-types
```

---

## 🐳 Running with Docker

### 1. Create Docker Network

```bash
docker network create grab-dev-network
```

### 2. Run Container Smoke Check

```bash
pnpm docker:smoke
```

### 3. Start Full Compose Environment

```bash
docker compose up --build
```

---

## 📚 Documentation & Guides

- [Runbook & Developer Operations](file:///Users/khinemyaezin/Repository/grab-ecommerce/grab-web/docs/RUNBOOK.md)
- [System Architecture](file:///Users/khinemyaezin/Repository/grab-ecommerce/grab-web/docs/Current_System_Architecture.md)
- [ADR 001: MFE State Sharing and Communication](file:///Users/khinemyaezin/Repository/grab-ecommerce/grab-web/docs/decisions/ADR_001-StateSharing&Communication.md)
- [ADR 002: Auth State Sharing for MFEs](file:///Users/khinemyaezin/Repository/grab-ecommerce/grab-web/docs/decisions/ADR_002-AuthStateSharingForMFEs.md)
- [ADR 003: Host-Mediated Session-Durable Event Bus](file:///Users/khinemyaezin/Repository/grab-ecommerce/grab-web/docs/decisions/ADR_003-HostMediatedSessionDurableEventBus.md)
- [ADR 004: Host-Owned Backend Event Stream](file:///Users/khinemyaezin/Repository/grab-ecommerce/grab-web/docs/decisions/ADR_004-HostOwnedBackendEventStream.md)
- [ADR 005: Workflow SSE Domain Mapping](file:///Users/khinemyaezin/Repository/grab-ecommerce/grab-web/docs/decisions/ADR_005-WorkflowSseDomainMapping.md)
- [ADR 006: Slot Bridge Capability Registry](file:///Users/khinemyaezin/Repository/grab-ecommerce/grab-web/docs/decisions/ADR_006-SlotBridgeCapabilityRegistry.md)
- [ADR 007: Merchant Registration Lifecycle Flow](file:///Users/khinemyaezin/Repository/grab-ecommerce/grab-web/docs/decisions/ADR_007-MerchantRegistrationLifecycleFlow.md)
- [ADR 008: Build and Workspace Tooling](file:///Users/khinemyaezin/Repository/grab-ecommerce/grab-web/docs/decisions/ADR_008-BuildAndWorkspaceTooling.md)
