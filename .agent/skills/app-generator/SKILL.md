---
name: app-generator
description: Generate and scaffold a new React Micro-Frontend (MFE) application within the Seller Frontend Platform with Vite, Module Federation, TypeScript, and standard Grab packages.
---

# Application Generator Skill

Use this skill when scaffolding a new remote or host Micro-Frontend (MFE) application in the `grab-web` repository from scratch.

---

## 1. Technology Stack & Dependencies

Initialize a Vite + React + TypeScript application with the following standard dependencies:

### Core Framework & Tooling:
- React (`v19.2.4`)
- React DOM (`v19.2.4`)
- TypeScript (`v5.9.3`)
- Vite (`v8.0.16`)
- React Router (`v7.18.0`)
- `@module-federation/vite` (`v1.16.9`)

### Data Fetching & Form Management:
- `@tanstack/react-query` (`v5.99.2`)
- `react-hook-form` (`v7.74.0`)
- `zod` (`v4.3.6`)
- `@hookform/resolvers` (`v5.2.2`)

### Styling & UI:
- Tailwind CSS (`v4.1.18`) + `@tailwindcss/vite`
- `shadcn` (`v4.3.1`)
- `lucide-react`
- `@khinemyaezin/seller-ui` (Internal UI library)
- `sonner`

### Testing:
- `vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `msw` (Mock Service Worker)

### Internal Grab Platform Libraries:
- `@khinemyaezin/seller-api` (v1.0.0)
- `@khinemyaezin/seller-contracts` (v1.0.0)

---

## 2. Configuration Files

### `vite.config.ts`
Configure Module Federation, aliases, proxies, and shared singletons:

```ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: mode === "development" ? `http://localhost:${env.PORT}/` : `/mfe/${env.APP_NAME}/`,
    resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: `grab_seller_${env.APP_NAME}`,
        filename: "remoteEntry.js",
        manifest: true,
        dts: {
          generateTypes: {
            tsConfigPath: "./tsconfig.app.json",
            abortOnError: true,
          },
        },
        exposes: { "./Routes": "./src/app/AppRoutes.tsx" },
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
      }),
    ],
    server: {
      port: Number(env.PORT),
      origin: env.VITE_ORIGIN,
      cors: { origin: env.VITE_CORS_ORIGIN },
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          xfwd: true,
        },
      },
    },
    preview: { port: Number(env.PORT) },
    build: {
      target: "chrome111",
      minify: false,
      cssCodeSplit: false,
    },
  };
});
```

### `package.json` Standard Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "build:staging": "tsc -b && vite build --mode staging",
    "build:production": "tsc -b && vite build --mode production",
    "preview": "vite preview",
    "typecheck": "tsc -b",
    "test": "vitest run"
  }
}
```

### `src/styles.css`
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@khinemyaezin/seller-ui/styles.css";
@source "../node_modules/@khinemyaezin/seller-ui/dist";
```