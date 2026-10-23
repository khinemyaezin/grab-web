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
│   ├── grab-seller-account/     # Account / Onboarding Remote MFE (Port 3004)
│   └── grab-seller-pricing/     # Pricing Remote MFE (Port 3005)
├── packages/
│   ├── seller-contracts/        # Shared API schemas, event topics & routes (@khinemyaezin/seller-contracts)
│   ├── seller-api/              # HTTP transport & TanStack Query clients (@khinemyaezin/seller-api)
│   └── seller-ui/               # Shared design system, UI components & slots (@khinemyaezin/seller-ui)
├── docker/
│   └── app.Dockerfile           # Optimized multi-stage build using turbo prune
├── compose.yaml                 # Local containerized orchestration
├── pnpm-workspace.yaml          # pnpm workspace definition
└── turbo.json                   # Root task pipeline and caching rules
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: `>= 20.19.0`
- **pnpm**: `>= 9.0.0` (Installed via `brew install pnpm` or `corepack enable`)

### 2. Install Dependencies
```bash
pnpm install
```
All shared packages (`seller-contracts`, `seller-api`, `seller-ui`) are automatically linked via `workspace:*`. **No canary publishing or manual install scripts required.**

### 3. Start Development Servers
Start all applications concurrently:
```bash
pnpm dev
# or
./start-dev.sh
```

Start specific applications only:
```bash
./start-dev.sh grab-seller grab-seller-account
# or
pnpm turbo dev --filter=grab-seller --filter=seller-account
```

### 4. Build, Typecheck, and Test
```bash
# Build all apps and packages in parallel
pnpm build

# Typecheck the entire monorepo
pnpm typecheck

# Run test suites across all packages
pnpm test

# Build only a specific app (e.g., pricing)
pnpm turbo run build --filter=grab-seller-pricing
```

---

## 🐳 Running with Docker

### 1. Create Docker Network
```bash
docker network create grab-dev-network
```

### 2. Start Services
```bash
# Build and start all containers
docker compose up --build

# Start existing images
docker compose up

# Rebuild only a single service
docker compose up --build grab-seller-inventory
```

---

## 🌐 Port Allocations

| Application | Port | Type | Description |
| :--- | :--- | :--- | :--- |
| **`grab-seller`** | `3000` | Host Shell | Gateway shell, navigation & context providers |
| **`grab-seller-product`** | `3001` | Remote MFE | Catalog, product variants, and listings |
| **`grab-seller-inventory`**| `3002` | Remote MFE | Locations, stock balances, item management |
| **`grab-seller-auth`** | `3003` | Remote MFE | Authentication & User menu widget |
| **`grab-seller-account`** | `3004` | Remote MFE | Merchant onboarding & account settings |
| **`grab-seller-pricing`** | `3005` | Remote MFE | Price lists, tier rules, and pricing widgets |
