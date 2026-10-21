# Seller Frontend Platform

Welcome to the **Seller Frontend Platform**! This repository is a monorepo managing the core frontend packages and shared libraries for the Seller Micro-Frontend (MFE) ecosystem. It is built using NPM Workspaces and TypeScript.

## 🏗 Architecture

The repository is structured as a monorepo containing multiple independent but complementary packages located in the `packages/` directory.

### Packages Overview

1. **`@grab/seller-ui`**
   - **Purpose:** A shared, reusable UI component library.
   - **Tech Stack:** React 19, Radix UI, Tailwind CSS (implied by `tailwind-merge` and `clsx`), and Lucide React icons.
   - **Responsibilities:** Provides highly accessible, styled, and cohesive React components, layouts, and styles that are consumed by the various Seller MFEs to maintain a consistent look and feel across the platform.

2. **`@grab/seller-api`**
   - **Purpose:** The core API client and data-fetching layer.
   - **Tech Stack:** TypeScript, `url-template`, Vitest.
   - **Responsibilities:** Manages HTTP requests to the backend services. It includes utilities for HATEOAS, API discovery, and pagination, abstracting away the complexity of raw network requests.

3. **`@grab/seller-contracts`**
   - **Purpose:** Centralized types and interfaces.
   - **Tech Stack:** TypeScript.
   - **Responsibilities:** Houses all the shared TypeScript definitions, API contracts, and data models used across the seller frontend ecosystem, ensuring strict type-safety and alignment between the UI, API clients, and the backend.

### Dependency Flow
- **`@grab/seller-ui`** depends on **`@grab/seller-api`** for integrating API functionality into more complex components or hooks.
- Micro-frontends (MFEs) operating outside of this monorepo will consume these packages to build out their specific features.

## 🛠 Development

### Prerequisites
- Node.js `>= 20.19.0`
- NPM (v7 or later for workspaces support)

### Setup & Installation
To install dependencies for the root and all workspace packages:
```bash
npm install
```

### Available Scripts
From the root directory, you can run the following commands across all packages using NPM Workspaces:

- **Build everything:**
  ```bash
  npm run build
  ```
- **Typecheck all packages:**
  ```bash
  npm run typecheck
  ```
- **Run tests:**
  ```bash
  npm run test
  ```

## Publishing private packages

The workspace uses Changesets in fixed-version mode. `@khinemyaezin/seller-contracts`, `@khinemyaezin/seller-api`, and `@khinemyaezin/seller-ui` are versioned and published together.

1. Make the package changes.
2. Run `npm run changeset`.
3. Choose `patch`, `minor`, or `major` and write the release note.
4. Commit the generated `.changeset/*.md` file with your code.
5. Merge to `main`.
6. GitHub Actions opens a version PR that updates all package versions and internal dependency versions.
7. Merge the version PR to publish the fixed package group.

Do not publish one workspace package by itself. `@khinemyaezin/seller-api` depends on `@khinemyaezin/seller-contracts`, and `@khinemyaezin/seller-ui` depends on `@khinemyaezin/seller-api`, so the release workflow keeps them in lockstep.

For canary/build-number style releases, use prerelease versions instead of SemVer build metadata:

```text
1.0.1-canary.1782470000
```

Local checks before release:

```bash
npm run release:check
```

For local authenticated registry access, use the committed `.npmrc` scope registry and export a token as `NODE_AUTH_TOKEN`. Never commit a real token.

## 🧪 Testing
We use **Vitest** for our unit and integration tests (e.g., in the API package), and **MSW** (Mock Service Worker) for API mocking. Run `npm run test` from the root to execute all workspace test suites.
