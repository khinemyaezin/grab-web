# Screen Module Blueprint (Catalog / Product Flagship)

This blueprint documents the reference architecture for screen-based remote MFEs, exemplified by `grab-seller-product`.

---

## 1. Domain Context

Screen-based modules are chosen when a bounded context has **few entity types but multiple rich screens/views** for managing those entities (e.g. Catalog Product with List, Create, Edit, and Variant-Edit screens).

---

## 2. Directory Layout

```text
grab-seller-product/src/
├── app/
│   ├── AppRoutes.tsx            # Exposed routing entrypoint (receives link, platform, extensions)
│   └── StandaloneApp.tsx        # Dev server wrapper with mocked providers
├── features/
│   └── products/
│       ├── api/                 # Pure transport services + TanStack Query hooks
│       │   ├── catalog.ts       # HATEOAS followLink calls
│       │   ├── discovery.ts     # Feature root discovery
│       │   ├── product-media.ts # Staging & media uploads
│       │   ├── product-descriptions.ts # Descriptions replace endpoint
│       │   ├── use-products.ts  # Thin useQuery and useMutation wrappers
│       │   ├── use-root.ts      # Catalog root capability hook
│       │   ├── use-categories.ts
│       │   ├── use-variation-matrix.ts
│       │   ├── workflow-product-id.ts
│       │   └── index.ts
│       ├── types/               # Cleanly separated TypeScript definitions
│       │   ├── catalog.request.ts
│       │   ├── catalog.response.ts
│       │   ├── catalog.model.ts
│       │   ├── catalog.form.ts
│       │   └── index.ts
│       ├── lib/                 # Pure transforms, adapters, request builders, math
│       │   ├── create-sellable-product-request.ts
│       │   ├── update-sellable-product-request.ts
│       │   ├── update-product-variant-request.ts
│       │   ├── to-product-form-value.ts
│       │   ├── product-form-defaults.ts
│       │   ├── product-form-dirty.ts
│       │   ├── inventory-group-id.ts
│       │   └── pricing-instance-id.ts
│       ├── ui/                  # Reusable fieldsets, fields, and consumer slot ports
│       │   ├── product-basic-fieldset.tsx
│       │   ├── product-media-fieldset.tsx
│       │   ├── product-variation-fieldset.tsx
│       │   ├── category-search.tsx
│       │   ├── manage-inventory-field.tsx
│       │   ├── product-standalone-field.tsx
│       │   ├── product-status.tsx
│       │   ├── variant-table.tsx
│       │   └── slots/           # Consumer slot adapters
│       │       ├── product-extension-slot.tsx
│       │       ├── pricing/     # Pricing inline, full, and standalone slots
│       │       └── inventory/   # Inventory full and standalone slots
│       ├── list/                # List Screen Module
│       │   ├── product-list-page.tsx
│       │   ├── products-view.tsx
│       │   ├── products-filter.tsx
│       │   ├── product-table.tsx
│       │   └── use-product-filter.ts
│       ├── create/              # Create Screen Module
│       │   ├── product-create-page.tsx
│       │   ├── product-new-form.tsx
│       │   ├── product-new-variation.tsx
│       │   ├── use-product-create-submit.ts
│       │   ├── use-product-create-command.ts
│       │   └── use-product-create-events.ts
│       ├── edit/                # Edit Screen Module
│       │   ├── product-edit-page.tsx
│       │   ├── product-edit-view.tsx
│       │   ├── product-edit-form.tsx
│       │   ├── product-edit-actions.tsx
│       │   ├── product-edit-variation.tsx
│       │   ├── use-product-edit.ts
│       │   ├── use-product-update-submit.ts
│       │   ├── use-product-update-command.ts
│       │   └── use-product-edit-events.ts
│       ├── variant-edit/        # Variant Edit Screen Module
│       │   ├── product-variant-edit-page.tsx
│       │   ├── product-variant-edit-view.tsx
│       │   ├── product-variant-edit-form.tsx
│       │   ├── product-variant-edit-actions.tsx
│       │   ├── product-variant-nav.tsx
│       │   ├── product-variant-fieldset.tsx
│       │   ├── use-product-variant-edit.ts
│       │   ├── use-product-variant-update-submit.ts
│       │   ├── use-product-variant-update-command.ts
│       │   └── use-product-variant-edit-events.ts
│       ├── use-matrix-sync.ts   # Synchronizers used by multiple modules
│       ├── use-workflow-awaiter.ts
│       ├── use-product-media-sync.ts
│       ├── use-product-description-sync.ts
│       └── use-product-name-watch.ts
```

---

## 3. Key Design Choices in this Blueprint

1. **Screen Independence**: Each screen (`list`, `create`, `edit`, `variant-edit`) is completely self-contained with its own page, forms, sagas, commands, and tests.
2. **Shared Kernel**: Transport (`api/`), contracts (`types/`), math/adapters (`lib/`), and UI primitives/slots (`ui/`) are shared across all screens.
3. **No Cross-Screen Coupling**: `create/` does not depend on `edit/`, and vice-versa.
