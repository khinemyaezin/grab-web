# Agent Guideline: Project Architecture & Component Creation

This document outlines the package structure and component creation guidelines for the `grab-seller-auth` project. It is intended to serve as a reference for both human developers and AI agents when generating new features or components.

## 1. Architectural Overview

The `grab-seller-auth` project follows a modular, feature-based architecture (similar to Feature-Sliced Design). The core idea is to co-locate related code (components, hooks, types, api calls) within specific "features" rather than grouping by file type globally.

### High-Level Directory Structure

```text
grab-seller-auth/
├── src/
│   ├── app/        # Application-level setup, global providers, routing configuration.
│   ├── assets/     # Static assets like images, icons, or global stylesheets.
│   ├── features/   # Feature modules (e.g., `auth`). This is where most of the domain logic lives.
│   ├── test/       # Global test setups, utilities, and mocks.
│   ├── main.tsx    # Application entry point.
│   └── styles.css  # Global CSS.
```

## 2. Feature Structure

When creating a new feature (e.g., under `src/features/[feature-name]`), use the following standardized directory structure to ensure consistency:

```text
src/features/[feature-name]/
├── api/          # API request functions and endpoint definitions.
├── components/   # React components specific to this feature.
├── context/      # React context providers and consumers (if needed).
├── hooks/        # Custom React hooks (e.g., data fetching, mutations, complex logic).
├── pages/        # Top-level page components that compose feature components.
└── types/        # TypeScript interfaces and types specific to the feature.
```

## 3. Component Creation Guideline

When creating a new React component within a feature (e.g., inside `src/features/[feature-name]/components/`), adhere to the following rules:

### A. File Naming and Export
- **File Name:** Use `kebab-case` for file names (e.g., `login-form.tsx`, `user-profile.tsx`).
- **Export:** Use **default exports** for components (e.g., `export default function ComponentName(...)`).

### B. Props Definition
- Define component props using a `type` alias.
- Name the type `[ComponentName]Props` (e.g., `export type LoginFormProps = { ... }`).
- Export the props type so it can be reused or extended if necessary.

### C. UI Library and Styling
- **Do not reinvent UI components.** Utilize the shared UI library: `@khinemyaezin/seller-ui/components/*`.
- For layout and minor styling, use Tailwind CSS utility classes via the `className` prop.

### D. Separation of Concerns
- **Logic:** Keep complex business logic and API calls out of the component. Use custom hooks (located in the `hooks/` directory) to fetch data (e.g., `useLocations`) and handle mutations (e.g., `useEntityActions`), then pass down the necessary state.
- **Data & Links:** Pass `HateoasLink` references as props from the parent to fetch data or resolve links for actions. Use `@khinemyaezin/seller-api` utilities like `resolveLink` and `hasLink` to manage permissions and HATEOAS actions.
- **Forms:** For form handling and validation, use `react-hook-form`. Integrate with shared form UI components like `FieldGroup`, `Field`, `FieldLabel`, `FieldError`, and `Input`.

## 4. Page Structure Guideline

Pages act as the structural containers that compose various UI components, forms, and contexts. When building a new page (e.g., inside `src/features/[feature-name]/pages/`), follow this composition pattern:

### A. Composition Flow (`page -> view -> specific components`)
A fully-fledged feature typically consists of the following necessary structural components:
- **Page (`[feature-name]-page.tsx`):** The page component is responsible for high-level layout, fetching root data/links (e.g., using `getIdentityRoot()`), and passing down necessary props or `HateoasLink` references to the `View` component.
- **View (`[feature-name]-view.tsx`):** Acts as the orchestrator for the page's UI elements. It manages the layout of the `Table`, `Filter`, and interactions like opening modals for forms.
- **Table (`[feature-name]-table.tsx`):** Renders the list of entities and utilizes the shared `<Pager>` for pagination.
- **Filter (`[feature-name]-filter.tsx`):** Provides search and filtering capabilities for the table.
- **Forms (`new-[feature-name]-form.tsx`, `edit-[feature-name]-form.tsx`):** Handle creation and modification of entities. They receive the necessary links/props and manage form state, validation (`react-hook-form`), and mutation logic.
- **Fieldset (`[feature-name]-fieldset.tsx`):** Reusable groups of form fields that can be shared between the `new` and `edit` forms.
- **Example Flow:** The `LocationPage` fetches data and renders `LocationView`. The `LocationView` renders `LocationFilter` and `LocationTable`. Actions in the view might open a `NewLocationForm` or `EditLocationForm`.

### B. Default Export for Pages
- **Export:** Use **default exports** for top-level page components to simplify lazy loading and routing (e.g., `export default function LoginPage()`).

## Summary Checklist for Agents
- [ ] Is the component placed in the correct `features/[feature-name]/components/` directory?
- [ ] Is the file named in `kebab-case.tsx`?
- [ ] Are props defined explicitly with an exported `type`?
- [ ] Is it a default export?
- [ ] Are shared UI components from `@khinemyaezin/seller-ui` being used instead of raw HTML elements where applicable?
- [ ] Is complex logic abstracted into custom hooks?
