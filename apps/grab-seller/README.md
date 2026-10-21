# Seller

This app owns browser routing, and global layout for seller MFEs.

### Package Structure

The codebase provides the global layout and orchestration logic:

```text
src/
├── app/
│   ├── App.tsx                # Root application setup (Providers, Global Router)
│   └── AuthContext.tsx        # Global Authentication State
├── components/
│   ├── AdminSidebar.tsx       # Global navigation sidebar
│   ├── DashboardLayout.tsx    # Layout wrapper for authenticated routes
│   └── RemoteBoundary.tsx     # Suspense & Error Boundary for remote MFEs
├── pages/
│   ├── DashboardPage.tsx      # Main landing page for authenticated users
│   ├── LoginPage.tsx          # Login page
│   └── NotFoundPage.tsx       # 404 page
├── test/                      # Testing setup
├── main.tsx                   # Entry file
├── remotes.d.ts               # TypeScript declarations for remote modules
└── styles.css                 # Global tailwind imports
```

### Architecture Flow

The following diagram illustrates how the Host Shell orchestrates the overall application:

```mermaid
graph TD
    %% Define styles
    classDef shell fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff
    classDef mfe fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff
    classDef shared fill:#4c1d95,stroke:#8b5cf6,stroke-width:2px,color:#fff
    classDef backend fill:#7f1d1d,stroke:#ef4444,stroke-width:2px,color:#fff

    %% Nodes
    HostShell["Host Shell App\n(Routing, Auth, Layout)"]:::shell
    
    subgraph MFEs ["Micro-Frontends (MFEs)"]
        ProductMFE["grab_seller_product\n(Product Management)"]:::mfe
        InventoryMFE["seller_inventory\n(Inventory Management)"]:::mfe
    end

    subgraph SharedPackages ["Shared Platform Packages"]
        UI["@khinemyaezin/seller-ui\n(UI Components)"]:::shared
        API["@khinemyaezin/seller-api\n(HTTP Client)"]:::shared
    end
    
    BackendServer[("Backend API Services")]:::backend

    %% Relationships
    HostShell -- "lazy loads via Vite Fed" --> ProductMFE
    HostShell -- "lazy loads via Vite Fed" --> InventoryMFE
    
    HostShell -- "renders" --> UI
    ProductMFE -- "consumes components" --> UI
    InventoryMFE -- "consumes components" --> UI
    
    ProductMFE -- "fetches data" --> API
    InventoryMFE -- "fetches data" --> API
    
    API -- "HTTP Requests" --> BackendServer
```

## 🚀 Development

### Running Locally
To run the Shell application locally:
```bash
npm run dev
```
Development expects `grab-seller-product` on port `3001`, `grab-seller-inventory` on port `3002`, and the backend API on port `8080`.

### Testing & Building
- **Run Tests**: `npm run test` (powered by Vitest)
- **Typecheck**: `npm run typecheck`
- **Build**: `npm run build` (outputs assets to `dist/`)
- **E2E Tests**: `npm run test:e2e` (powered by Playwright)
