# Seller IAM Service

This repository contains the **Authentication Micro-Frontend (MFE)** for the Grab Seller Platform. It handles seller login, registration, session management, and authentication flows.

## Overview

This is a remote module in the Module Federation architecture, designed to be consumed by the Shell/Host application (`grab-seller`).

### Exposed Modules

As defined in the Module Federation configuration, this MFE exposes the following modules to the Host application:

- **`./Routes`** (`src/app/AuthRoutes.tsx`): The routing configuration and pages for authentication flows (e.g., `/login`, `/register`).
- **`./AuthService`** (`src/features/auth/api/auth-service.facade.ts`): The facade service used for cross-cutting authentication operations (e.g., fetching profile, logout, token refresh).

## Development

### Prerequisites

Ensure you have installed the dependencies from the root or within this workspace:

```bash
npm install
```

### Running Locally (Standalone)

You can run this MFE in standalone mode for local development and UI testing:

```bash
npm run dev
```

The application will be available at `http://localhost:3003/`.

### Running Tests

To run the unit tests using Vitest:

```bash
npm run test
```

### Building for Production

To build the project for production:

```bash
npm run build
```

This will generate the federated `remoteEntry.js` and compiled assets in the `dist/` directory, ready to be served and loaded by the Shell application.

## Architecture Details

This module adheres to the Domain Boundary Rules defined in the central [Current System Architecture](../../docs/Current_System_Architecture.md) documentation:
- Uses shared UI primitives from `@khinemyaezin/seller-ui`.
- Uses the shared API client infrastructure from `@khinemyaezin/seller-api`.
- Adheres to standard typescript interfaces defined in `@khinemyaezin/seller-contracts`.
- Fully manages its own internal routing and domain logic without cross-coupling with other remote MFEs.
