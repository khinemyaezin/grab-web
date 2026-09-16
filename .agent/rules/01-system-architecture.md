# System Architecture & Module Federation

This document defines the physical and logical architecture of the **Seller Frontend Platform** (`grab-web`), the Module Federation integration, and dependency directions.

---

## 1. System Overview

The platform is a React 19, Vite, and Module Federation micro-frontend (MFE) ecosystem.

```mermaid
flowchart TD
    Shell["grab-seller (Host / Shell)"]
    Auth["grab-seller-auth (Remote)"]
    Account["grab-seller-account (Remote)"]
    Product["grab-seller-product (Remote)"]
    Inventory["grab-seller-inventory (Remote)"]
    Pricing["grab-seller-pricing (Remote)"]
    
    SharedContracts["@khinemyaezin/seller-contracts"]
    SharedAPI["@khinemyaezin/seller-api"]
    SharedUI["@khinemyaezin/seller-ui"]

    Shell -->|Consumes Routes & Widgets| Auth
    Shell -->|Consumes Routes & Widgets| Account
    Shell -->|Consumes Routes & Widgets| Product
    Shell -->|Consumes Routes & Widgets| Inventory
    Shell -->|Consumes Routes & Widgets| Pricing

    Product -.->|Extension Slots (Host-Mediated)| Inventory
    Product -.->|Extension Slots (Host-Mediated)| Pricing

    Auth --> SharedContracts
    Account --> SharedContracts
    Product --> SharedContracts
    Inventory --> SharedContracts
    Pricing --> SharedContracts
    Shell --> SharedContracts

    SharedContracts --> SharedAPI
    SharedAPI --> SharedUI
    SharedUI --> Shell
    SharedUI --> Product
    SharedUI --> Inventory
    SharedUI --> Pricing
    SharedUI --> Auth
    SharedUI --> Account
```

### Applications

| Application | Role | Port | Description & Responsibilities |
|:---|:---|:---|:---|
| **`grab-seller`** | Host / Shell | `3000` | Owns global route mounting, layouts, session, `SellerPlatform`, remote boundaries, backend event stream, and extension widget registration. |
| **`grab-seller-auth`** | Remote | `3003` | Authentication and access-context remote. Exposes `./Routes`, `./AuthService`, and `./UserMenuWidget`. |
| **`grab-seller-account`** | Remote | `3004` | Merchant selection and seller onboarding. Exposes `./Routes` and `./Service`. |
| **`grab-seller-product`** | Remote | `3001` | Catalog and products domain; parent of product extension slots. Exposes `./Routes`. |
| **`grab-seller-inventory`** | Remote | `3002` | Stock, bins, zones, and locations. Exposes `./DashboardRoutes`, `./LocationRoutes`, `./StockRoutes`, `./ProductInventoryWidget`, and `./InventoryItemEditWidget`. |
| **`grab-seller-pricing`** | Remote | `3005` | Price sets and currency rules. Exposes `./Routes`, `./PricingCreateWidget`, and `./PricingEditWidget`. |

---

## 2. Shared Packages Architecture

Shared infrastructure is organized into dedicated packages under `grab-seller-shared/packages/`:

```text
@khinemyaezin/seller-contracts
       ↓
@khinemyaezin/seller-api
       ↓
@khinemyaezin/seller-ui
       ↓
Shell and Domain Remotes
```

1. **`@khinemyaezin/seller-contracts`**:
   - Framework-light, versioned cross-boundary TypeScript contracts.
   - Route definitions, platform event topics, slot names, payload schemas, and contribution slice names.
2. **`@khinemyaezin/seller-api`**:
   - Pure HATEOAS HTTP client (`api.followLink`), SSE stream parser, and transport-level helpers.
   - React-free.
3. **`@khinemyaezin/seller-ui`**:
   - Generic UI primitives (shadcn/ui + Radix), shell layout components (`Header`, `ContextBar`), providers (`PlatformProvider`, `EntryLinkProvider`, `SlotProvider`), and extension slot infrastructure.
   - MUST NOT acquire domain business logic (product, pricing, inventory, auth, or account).

---

## 3. Dependency & Boundary Rules

1. **No Cross-Remote Imports**: A remote MFE MUST NOT import source code or a federated module from another remote.
2. **Host-Mediated Federation**: Federated imports that compose multiple remotes MUST be concentrated in the shell (`grab-seller`).
3. **Domain Ownership**: A domain MFE MUST own its UI state, TanStack Query cache, API hooks, business rules, and request projections.
4. **Thin Orchestrator**: The shell orchestrates domains and manages authentication/routing but MUST NOT absorb domain business logic.
5. **Shared Package Purity**: Shared packages MUST contain genuinely cross-domain infrastructure, not code moved merely to circumvent an extension slot.
6. **Federation Singletons**: React, React DOM, React Router, React Hook Form, TanStack Query, and seller shared packages MUST remain compatible singletons across the mounted tree.

---

## 4. Module Federation Configuration

In each MFE's `vite.config.ts`:

```ts
federation({
  name: "grab_seller_[mfe]",
  filename: "remoteEntry.js",
  manifest: true,
  dts: {
    generateTypes: {
      tsConfigPath: "./tsconfig.app.json",
      abortOnError: true,
    },
  },
  exposes: {
    "./Routes": "./src/app/AppRoutes.tsx",
    // and widgets if supplying
  },
  shared: {
    "react": { singleton: true, requiredVersion: "19.2.4" },
    "react-dom": { singleton: true, requiredVersion: "19.2.4" },
    "react-router": { singleton: true, requiredVersion: "7.18.0" },
    "react-hook-form": { singleton: true, requiredVersion: "7.74.0" },
    "@tanstack/react-query": { singleton: true, requiredVersion: "5.99.2" },
    "@khinemyaezin/seller-api": { singleton: true },
    "@khinemyaezin/seller-ui": { singleton: true },
    "@khinemyaezin/seller-contracts": { singleton: true },
  },
})
```

- `@mf-types` is generated output. It MUST NOT be treated as the source of truth when it disagrees with a remote's current `vite.config.ts`.
- Build target: `chrome111`.
- Production base path: `/mfe/[app-name]/`.
