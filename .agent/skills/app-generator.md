# Application Generation Prompt

You are an expert frontend AI assistant. Your task is to generate a new React application from scratch with a specific configuration, architecture, and tech stack based on our established standards.

Please create a new application by following these detailed instructions:

## 1. Technology Stack & Dependencies
Initialize a new Vite + React + TypeScript project and configure the following dependencies:

**Core:**
- React (v19.2.4)
- React DOM (v19.2.4)
- TypeScript (v5.9.3)
- Vite (v8.0.16)
- React Router (v7.18.0)

**Micro-frontend / Module Federation:**
- `@module-federation/vite` (v1.16.9)

**Data Fetching & State:**
- `@tanstack/react-query` (v5.99.2)

**Forms & Validation:**
- `react-hook-form` (v7.74.0)
- `zod` (v4.3.6)
- `@hookform/resolvers` (v5.2.2)

**Styling & UI:**
- Tailwind CSS (v4.1.18) + PostCSS
- `shadcn` (v4.3.1)
- `lucide-react`
- `@khinemyaezin/seller-ui` (Internal UI library)
- `sonner`

**Testing:**
- `vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `msw` (Mock Service Worker)

**Internal/Domain Libraries:**
- `@khinemyaezin/seller-api`
- `@khinemyaezin/seller-contracts`

## 2. Configuration Files

### `vite.config.ts`
Configure Vite to support Module Federation. The configuration should include:
- Base URL based on environment (e.g., `/mfe/[app-name]/` for production).
- Path alias (`@` pointing to `./src`).
- `@module-federation/vite` plugin configured to:
  - Expose a routing entry (`./Routes`) and a service entry.
  - Generate TypeScript types (`dts` configuration).
  - Share core libraries as singletons (`react`, `react-dom`, `react-router`, `@tanstack/react-query`, `@khinemyaezin/seller-api`).
- `server` configuration using environment variables for origin, cors, and proxy:
  - `origin: env.VITE_ORIGIN`
  - `cors: { origin: env.VITE_CORS_ORIGIN }`
  - `proxy: { "/api": { target: env.VITE_API_URL, changeOrigin: true, xfwd: true } }`
- `preview` configuration using the same port.
- `build` configuration with `target: "chrome111"`.
- Include a `.env` file mapping `VITE_API_URL`, `VITE_ORIGIN`, and `VITE_CORS_ORIGIN`.

### `package.json` scripts
Include the following npm scripts:
- `dev`: `vite --port [port]`
- `build`: `tsc -b && vite build`
- `build:staging`: `tsc -b && vite build --mode staging`
- `build:production`: `tsc -b && vite build --mode production`
- `preview`: `vite preview --port [port]`
- `typecheck`: `tsc -b`
- `test`: `vitest run`

### `src/styles.css`
The global CSS file must be configured to import the shared UI styles and Tailwind dependencies:
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@khinemyaezin/seller-ui/styles.css";
@source "../node_modules/@khinemyaezin/seller-ui/dist";
```

## 3. Architectural Structure

Implement a Feature-Sliced Design approach. Create the following high-level directory structure:
```text
index.html      # Vite HTML entry point
src/
├── app/        # Global providers, routing configuration, application setup
│   ├── Routes.tsx        # Module federation exposed routing entry
│   └── StandaloneApp.tsx # Standalone application wrapper for local dev
├── assets/     # Static assets, global stylesheets
├── features/   # Feature modules (domain logic)
├── test/       # Test setups and MSW mocks
├── main.tsx    # Application entry point
└── styles.css  # Global CSS (Tailwind imports)
```

Inside `src/features/`, any new feature should follow this strict layout:
```text
features/[feature-name]/
├── api/          # API services, fetch functions, endpoints
├── components/   # Feature-specific UI components
├── context/      # Context providers
├── hooks/        # Custom hooks for logic and data fetching
├── pages/        # Top-level route components
└── types/        # TypeScript definitions
```

## 4. Component & Page Guidelines

When generating code for features, strictly adhere to these rules:
- **Naming**: Use `kebab-case.tsx` for all React component files.
- **Exports**: Use **default exports** for all components and pages.
- **Props**: Explicitly define and export a `type [ComponentName]Props = {}` for every component.
- **UI Components**: Never use raw HTML form/UI elements. Always import from `@khinemyaezin/seller-ui` (e.g., `<FieldGroup>`, `<Input>`, `<Pager>`).
- **Pages**: Pages should act as orchestrators. They should fetch root links (e.g., `getIdentityRoot()`) and render a `View` component, which in turn orchestrates a `Table`, `Filter`, and any `Forms` (e.g., `new`, `edit`).
- **Data & Links**: Pass HATEOAS links as props from top-level pages down to child components. Use hooks in `hooks/` to manage fetching and mutations rather than inline component logic.

Please acknowledge these instructions and output the foundational configuration files (`package.json`, `vite.config.ts`, `tsconfig.json`) and the initial folder skeleton.
