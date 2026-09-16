# Project structure blueprint

Target folder architecture for the Seller Frontend Platform.

This file is the structure source of truth. It supersedes the feature-folder and
screen-layer sections of `.agent/architecture-rules.md` (those described the
quick-dev tree: `pages/` + `components/` + `hooks/` as sibling buckets). ADRs
and runtime source still win for behavior (federation, slots, events, HATEOAS).

**Pattern:** Bulletproof React + colocation, adapted for Module Federation.
Package by **feature**, then colocate by **screen** or **entity**. Do not package
by technical type (`views/`, `forms/`, `tables/`, `hooks/queries`).

**Status:** target. Land remotely, starting with `grab-seller-product`. Do not
reshape every MFE in one change.

---

## 1. Workspace

```text
grab-seller                 host / shell
grab-seller-auth            identity
grab-seller-account         merchant + onboarding
grab-seller-product         catalog (parent of extension slots)
grab-seller-inventory       stock, locations, slot widgets
grab-seller-pricing         prices, slot widgets

grab-seller-shared/packages/
  seller-contracts          slot names, events, routes, schemas
  seller-api                HATEOAS HTTP only
  seller-ui                 primitives, layout, slot runtime (no domain)
```

```text
seller-contracts
      ↓
seller-api
      ↓
seller-ui
      ↓
shell and domain remotes
```

Rules:

- Do not merge remotes. Federation is the physical architecture.
- A remote MUST NOT import another remote's source or federated modules.
- Cross-domain UI is a federated **widget**. Cross-domain facts are versioned
  **events**. Shared packages MUST NOT absorb domain business logic.
- Each remote is a small Bulletproof app: `src/app` + `src/features/<domain>`.
  Do not flatten a domain to `src/` with no `features/` folder.
- Generated `@mf-types` is output. Do not hand-edit it; do not treat it as
  source of truth when it disagrees with `vite.config.ts`.

---

## 2. Where a new file belongs

Use the first match:

1. Used by two remotes and has no domain meaning → `seller-ui`.
2. Slot name, payload schema, event, or route contract → `seller-contracts`.
3. Generic follow-link / HTTP → `seller-api`. Feature transport stays in that
   feature's `api/`.
4. Pure map (request, response, form, matrix math) → feature `lib/`.
5. HTTP + TanStack Query → feature `api/` (not a parallel `hooks/` drawer).
6. Used by two or more screens/entities in the same feature → feature `ui/`.
7. Used by one screen or one entity → that **module** folder.
8. Embedded into another MFE → supplying feature `widgets/` (`*-widget.tsx` +
   `*-slot.tsx`). Consuming feature `ui/slots/<domain>/`.

Create a folder only when it has at least two files or a clear public role.
Tests live next to the file they cover (`*.test.ts` / `*.test.tsx`).

---

## 3. Feature shape

Every domain feature has a **shared kernel** plus **modules**.

```text
src/
  app/                         # Routes, standalone bootstrap, providers
  features/
    <domain>/
      api/                     # transport + useQuery / useMutation
      types/                   # *.request.ts, *.response.ts, *.model.ts, *.form.ts
      lib/                     # pure transforms (includes former adapters/)
      ui/                      # shared fields, fieldsets, consumer slot ports
      widgets/                 # only if this MFE exposes federated widgets
      <module>/                # screen module OR entity module
      use-*.ts                 # only hooks shared by several modules
```

Pick the module kind from the bounded context:

- **Screen modules** — few entities, several screens (catalog product:
  `list/`, `create/`, `edit/`, `variant-edit/`).
- **Entity modules** — many resources, CRUD each (inventory: `location/`,
  `zone/`, `bin/`, `item/`, `dashboard/`).

Do not mix both kinds in the same feature unless the feature truly has both a
small screen set *and* a large entity set.

### Composition inside a module

This is a responsibility split, not a folder type. Skip a file that would only
forward props.

```text
*-page.tsx     route: params, providers, breadcrumbs, toasts, capability gate
*-view.tsx     only if it coordinates a real region (list, header+_links,
               summary + child). Create often skips this.
*-form.tsx     one React Hook Form lifecycle
*-table.tsx    rows, row actions, empty/loading, pagination callbacks
*-filter.tsx   filter controls, not the collection query
*-fieldset.tsx / *-fields.tsx   leaf controls; read typed form context
use-*-submit.ts    screen use-case (validate, adapt, sequence, lifecycle)
use-*-command.ts   payload in / result out when the write awaits a workflow
use-*-events.ts    page maps facts to toasts / breadcrumbs / navigate
```

### `api/` vs leftover hooks

- `api/` owns HTTP and React Query (`useProductSearch`, `useRoot`,
  `useInventoryLink`, mutations, query keys, invalidation). A `useMutation`
  wrapper MUST stay thin: no form reads, slot validation, or toasts.
- A module owns the write-path saga (`use-product-create-submit`) and, when
  the write awaits a workflow or sequences extra attach steps, the payload-in
  command (`use-product-create-command`). Do not name a hook `*-workflow.ts`.
- Page event hooks (`use-product-create-events`) map lifecycle facts to chrome.
  They MUST NOT own HTTP.
- Skip the command file for a simple POST with no slots, no workflow await,
  and no extra attach. The form or a tiny submit hook may call `useMutation`.
- Feature-root `use-*.ts` is only for hooks used by two or more modules
  (`use-workflow-awaiter`, `use-matrix-sync`).

### `ui/` vs module UI

- `ui/` is not a dump. A fieldset used by one screen stays in that screen
  folder.
- Consumer slot adapters (`pricing-*-slot.tsx`, `inventory-*-slot.tsx`,
  `product-extension-slot.tsx`) live under `ui/slots/`.

### `widgets/` vs `features/widget`

Federated entrypoints belong **inside** the domain feature
(`features/pricing/widgets`, `features/inventory/widgets`). Do not create a
sibling `features/widget` feature. Vite **expose keys** are the public API;
folder moves MUST NOT rename `./PricingCreateWidget` and the like.

---

## 4. Naming and imports

- Directories and files: kebab-case.
- Components and types: PascalCase.
- Hooks: `use` prefix.
- Feature-internal imports: `@/` to the **file**
  (`@/features/products/edit/use-product-edit`).
- Nearby files in the same module: relative imports.
- Cross-package: published exports only (`@khinemyaezin/seller-ui/...`).
- Pages and route wrappers MAY use default exports. Hooks, lib, widgets, and
  contracts SHOULD use named exports.
- No feature-level barrels (`components/index.ts`, `hooks/index.ts`,
  `<domain>/index.ts`) except `types/index.ts` and `api/index.ts` when they
  already exist and stay thin.
- No compatibility shims at old paths. `git mv` and update imports in the same
  change.

---

## 5. Target trees

### 5.1 Product — screen modules (flagship)

```text
grab-seller-product/src/
  app/
    AppRoutes.tsx
    StandaloneApp.tsx
  features/products/
    api/
      catalog.ts
      discovery.ts
      product-media.ts
      storage.ts
      use-products.ts
      use-root.ts
      use-categories.ts
      use-variation-matrix.ts
      use-option.ts
      use-type.ts
    types/
    lib/                         # request builders, dirty, matrix, formatters
    ui/
      product-basic-fieldset.tsx
      product-media-fieldset.tsx
      product-variation-fieldset.tsx
      category-search.tsx
      manage-inventory-field.tsx
      product-standalone-field.tsx
      product-variation-type-field.tsx
      product-variation-option-field.tsx
      slots/
        product-extension-slot.tsx
        pricing/
        inventory/
    list/
      product-list-page.tsx
      products-view.tsx
      products-filter.tsx
      product-table.tsx
      use-product-filter.ts
    create/
      product-create-page.tsx
      product-new-form.tsx
      product-new-variation.tsx
      use-product-create-submit.ts
      use-product-create-command.ts
      use-product-create-events.ts
    edit/
      product-edit-page.tsx
      product-edit-view.tsx
      product-edit-form.tsx
      product-edit-actions.tsx
      product-edit-variation.tsx
      product-status.tsx
      use-product-edit.ts
      use-product-update-submit.ts
      use-product-update-command.ts
      use-product-edit-events.ts
      use-product-media-sync.ts
    variant-edit/
      product-variant-edit-page.tsx
      product-variant-edit-view.tsx
      product-variant-edit-form.tsx
      product-variant-edit-actions.tsx
      product-variant-nav.tsx
      product-variant-fieldset.tsx
      variant-table.tsx
      use-product-variant-edit.ts
      use-product-variant-update-submit.ts
      use-product-variant-update-command.ts
      use-product-variant-edit-events.ts
    use-matrix-sync.ts
    use-workflow-awaiter.ts
    use-product-name-watch.ts
```

### 5.2 Inventory — entity modules

```text
grab-seller-inventory/src/features/inventory/
  api/                           # discovery + shared transport + root query
  types/
  lib/
  widgets/
    inventory-create-widget.tsx
    inventory-create-slot.tsx
    inventory-edit-widget.tsx
    inventory-edit-slot.tsx
  location/
  zone/
  bin/
  item/                          # includes popover forms used by widgets
  dashboard/
  stock-operations/
```

Each entity module owns its pages, views, forms, tables, and entity-local
hooks. Shared discovery stays in `api/`.

### 5.3 Pricing — one feature, widgets inside it

```text
grab-seller-pricing/src/features/pricing/
  api/
  types/
  lib/
  pages/                         # or a list/ module if it grows
  ui/                            # fields shared by page and widgets
  widgets/
    pricing-create-widget.tsx
    pricing-create-slot.tsx
    pricing-edit-widget.tsx
    pricing-edit-slot.tsx
```

### 5.4 Auth, account, host

- **Auth:** `features/auth`, `features/access`, `features/shared/hooks`
  (plural). Keep `user-menu-widget` in `auth`.
- **Account:** keep multi-feature slices (`merchant-selection`, onboarding,
  `shared`). Do not add taxonomy folders.
- **Host:** `src/app` (providers + `App.tsx`), `src/routes` (remote mount),
  `src/layouts` (shell chrome), `src/pages` (shell-only). Do this after product
  validates the pattern.

---

## 6. Rejected structures

- `components/views|forms|tables|actions`
- `hooks/queries|forms|matrix|workflow`
- Sibling `features/widget` outside the domain feature
- Feature-Sliced Design pyramid (`app/pages/widgets/features/entities/shared`)
  on top of MFEs
- Atomic Design (`atoms/molecules/organisms`) as the domain folder system
- Flattening `features/<domain>/` away
- Compatibility re-exports at old paths
- Feature-wide barrels that hide the module graph

---

## 7. Rollout

1. Reshape `grab-seller-product` to the tree in §5.1. Prove with
   `npm --prefix grab-seller-product run typecheck` and `run test`.
2. Lift inventory to entity modules + `widgets/`. Keep Vite expose keys.
3. Colocate pricing widgets; rename auth `hook/` → `hooks/`; then host
   `layouts/` if still useful.

Stop after step 1 if typecheck or federation DTS fails; fix the blueprint
before copying it.
