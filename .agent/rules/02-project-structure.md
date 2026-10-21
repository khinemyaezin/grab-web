# Project Structure & Organization Rules

This document governs folder organization, file placement, and naming standards across the Seller Frontend Platform.

---

## 1. Feature Shape

Every domain feature consists of a **Shared Kernel** plus **Modules**:

```text
src/
├── app/                         # Routes, standalone bootstrap, providers
└── features/
    └── <domain>/
        ├── api/                 # Transport services + useQuery / thin useMutation
        ├── types/               # *.request.ts, *.response.ts, *.model.ts, *.form.ts
        ├── lib/                 # Pure transforms, request builders, matrix math (no React)
        ├── ui/                  # Shared fieldsets, fields, consumer slot ports (ui/slots/)
        ├── widgets/             # Supplying federated widgets (only if exposed by this MFE)
        ├── <module>/            # Screen module OR Entity module
        └── use-*.ts             # Only hooks shared by multiple modules (e.g. use-workflow-awaiter)
```

### Module Types: Screen vs Entity

Choose the module model based on the bounded context:
- **Screen Modules** (few entities, several distinct screens): Used in catalog/product (`list/`, `create/`, `edit/`, `variant-edit/`).
- **Entity Modules** (many discrete resources with CRUD operations): Used in inventory (`location/`, `zone/`, `bin/`, `item/`, `dashboard/`).
- **Mixed (only when the domain demands it)**: Merchant uses onboarding screen modules (`selection/`, `c2c-onboarding/`, `retailer-onboarding/`) plus a storefront entity module.

Do not mix both models in the same feature unless the domain legitimately demands it.

---

## 2. File Placement Decision Tree

When adding a new file, place it in the first matching location:

1. **Visual primitive or layout used across multiple remotes** → `@khinemyaezin/seller-ui`.
2. **Cross-boundary contract, slot name, payload schema, event topic, route builder** → `@khinemyaezin/seller-contracts`.
3. **Generic HTTP / HATEOAS link traversal / stream client** → `@khinemyaezin/seller-api`.
4. **Domain transport service or TanStack Query hook** → Feature `api/` (`catalog.ts`, `use-products.ts`).
5. **Pure data transformation / request builder / formatter** → Feature `lib/` (`create-sellable-product-request.ts`).
6. **Component or fieldset shared by multiple screens/entities within the domain** → Feature `ui/`.
7. **Consumer slot port / adapter** → Feature `ui/slots/<domain>/`.
8. **Component, hook, or form used by only one screen or entity** → That specific `<module>/` folder (`create/product-new-form.tsx`).
9. **Federated widget supplied to another MFE** → Feature `widgets/` (`widgets/pricing-create-widget.tsx`).

> [!IMPORTANT]
> Create a folder only when it contains at least two related files or serves a clear public architectural role. Co-locate unit tests (`*.test.ts` / `*.test.tsx`) right next to the source file they cover.

---

## 3. Naming & Export Conventions

- **Directories and filenames**: `kebab-case` (`product-new-form.tsx`, `use-product-create-submit.ts`, `catalog.response.ts`).
- **Components & Types**: `PascalCase` (`ProductNewForm`, `ProductFormValue`).
- **Hooks**: `camelCase` with mandatory `use` prefix (`useProductCreateSubmit`, `useMatrixSync`).
- **Internal Imports**: Use the `@/` alias mapped to `./src` (`@/features/products/lib/product-form-defaults`).
- **Nearby Module Imports**: Use relative paths (`./product-edit-form`, `../ui/product-basic-fieldset`).
- **Cross-Package Imports**: Use published scoped package specifiers (`@khinemyaezin/seller-ui`, `@khinemyaezin/seller-api`).
- **Exports**:
  - Route components and pages: default export.
  - Reusable components, hooks, adapters, utilities, and widgets: named exports.
- **Barrels (`index.ts`)**: Keep barrels thin and restricted to `types/index.ts` and `api/index.ts`. Avoid feature-wide barrel exports (`components/index.ts`, `hooks/index.ts`) that obscure dependency trees.

---

## 4. Anti-Patterns & Forbidden Structures

The following patterns are strictly prohibited:

- ❌ **Flat Component / Hook Hell**: Dumping 20+ flat components or hooks into a single unstructured `components/` or `hooks/` directory.
- ❌ **Technical-Type Packaging**: Grouping by technical layer (`views/`, `forms/`, `tables/`, `queries/`).
- ❌ **External Widget Sibling**: Creating a sibling `features/widget/` directory outside the domain feature. Federated widgets belong under `features/<domain>/widgets/`.
- ❌ **Layered Framework Overkill**: Applying Atomic Design (`atoms/molecules/organisms`) or deep FSD pyramids on top of MFE boundaries.
- ❌ **Barrels Hiding Module Graphs**: Global barrels re-exporting internal module internals.
- ❌ **Compatibility Shims**: Leaving forwarding aliases at old paths when refactoring. Update callers in the same commit.
