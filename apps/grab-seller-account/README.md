# Seller Account MFE

The Seller Account Micro-Frontend (MFE) handles all account and onboarding management capabilities for sellers, including C2C and Retailer onboarding processes. 

## 🏗 Architecture

This project is built using **Vite** and **Module Federation**.

### Micro-Frontend Integration
- **Federated Entry**: The MFE exposes its core routing logic via `src/app/AppRoutes.tsx` as the `grab_seller_account/Routes` module. When consumed by the host shell application, it relies on the shell to provide the top-level context providers (e.g., Router, React Query Client, Theme Provider).
- **Standalone Mode**: For isolated local development, `src/app/StandaloneApp.tsx` acts as the root. It wraps the `AppRoutes` with all necessary providers (`BrowserRouter`, `QueryClientProvider`, `ThemeProvider`), simulating the shell environment so developers can work without spinning up the whole platform.

### Package Structure

The codebase is organized using a domain-driven, feature-sliced architecture. All onboarding-related functionality is tightly encapsulated inside `src/features/`:

```text
src/
├── app/
│   ├── AppRoutes.tsx          # Federated Entry point (Routes)
│   └── StandaloneApp.tsx      # Standalone dev entry point
├── features/
│   ├── c2c-onboarding/        # C2C seller onboarding flow
│   ├── retailer-onboarding/   # Retailer onboarding flow
│   └── shared/                # Shared utilities and components across onboarding flows
├── test/                      # MSW server and testing setup
├── main.tsx                   # Entry file for Vite dev server
└── styles.css                 # Global tailwind imports
```

### Architecture Flow

The following diagram illustrates how the MFE is consumed by the Host Shell and interacts with the shared platform packages:

```mermaid
graph TD
    %% Define styles
    classDef shell fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff
    classDef mfe fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff
    classDef shared fill:#4c1d95,stroke:#8b5cf6,stroke-width:2px,color:#fff
    classDef backend fill:#7f1d1d,stroke:#ef4444,stroke-width:2px,color:#fff

    %% Nodes
    HostShell["Host Shell App\n(Provides Providers & Layout)"]:::shell
    
    subgraph Seller Account MFE
        Routes["AppRoutes.tsx\n(Module Federation Entry)"]:::mfe
        Pages["Pages\n(e.g., OnboardingPage)"]:::mfe
        Hooks["Hooks / React Query"]:::mfe
    end

    subgraph Shared Platform Packages
        UI["@khinemyaezin/seller-ui\n(UI Components)"]:::shared
        API["@khinemyaezin/seller-api\n(HTTP Client)"]:::shared
        Contracts["@khinemyaezin/seller-contracts\n(Types & Interfaces)"]:::shared
    end
    
    BackendServer[("Backend API Services")]:::backend

    %% Relationships
    HostShell -- "lazy loads via Vite Fed" --> Routes
    Routes --> Pages
    Pages -- "consumes components" --> UI
    Pages -- "fetches data" --> Hooks
    Hooks -- "uses" --> API
    API -- "types" --> Contracts
    API -- "HTTP Requests" --> BackendServer
```

## 🚀 Development

### Running Locally
To run the MFE in standalone mode for local development:
```bash
npm run dev
```
This will start the Vite dev server on port `3004` and render the `StandaloneApp`.

### Testing & Building
- **Run Tests**: `npm run test` (powered by Vitest and MSW)
- **Typecheck**: `npm run typecheck`
- **Build**: `npm run build` (outputs federated assets to `dist/`)
