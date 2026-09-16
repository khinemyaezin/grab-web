# Entity Module Blueprint (Inventory & Pricing)

This blueprint documents the reference architecture for entity-based remote MFEs that manage multiple resources or supply federated extension slot widgets.

---

## 1. Domain Context

Entity-based modules are chosen when a bounded context has **many discrete resources, each having their own CRUD lifecycle**, or when an MFE serves primarily as an **extension widget provider**.

---

## 2. Inventory Architecture (`grab-seller-inventory`)

```text
grab-seller-inventory/src/
├── app/
│   ├── DashboardRoutes.tsx
│   ├── LocationRoutes.tsx
│   ├── StockRoutes.tsx
│   ├── InventoryProviders.tsx
│   └── StandaloneApp.tsx
└── features/
    └── inventory/
        ├── api/                 # Discovery, root queries, shared transport
        ├── types/               # Entity models and DTOs
        ├── lib/                 # Location/stock calculations & adapters
        ├── widgets/             # Federated extension slot widgets supplied to Product
        │   ├── inventory-create-widget.tsx
        │   ├── inventory-create-slot.tsx
        │   ├── inventory-edit-widget.tsx
        │   └── inventory-edit-slot.tsx
        ├── location/            # Location entity module (pages, views, forms, tables)
        ├── zone/                # Zone entity module
        ├── bin/                 # Bin entity module
        ├── item/                # Item entity module (includes widget popover forms)
        ├── dashboard/           # Inventory dashboard KPI & overview module
        └── stock-operations/   # Stock adjustment, transfer, and count operations
```

### Module Rules:
- Each entity module (`location/`, `zone/`, `bin/`) owns its own pages, forms, and table components.
- Shared root discovery stays in `api/`.
- Federated widgets live directly under `features/inventory/widgets/` (NEVER in an external `features/widget/` directory).

---

## 3. Pricing Architecture (`grab-seller-pricing`)

```text
grab-seller-pricing/src/
├── app/
│   ├── AppRoutes.tsx
│   └── StandaloneApp.tsx
└── features/
    └── pricing/
        ├── api/                 # Price set services and query hooks
        ├── types/               # Price schemas, currencies, price set models
        ├── lib/                 # Currency formatting and tax calculations
        ├── pages/               # Top-level pricing screens
        ├── ui/                  # Fields shared between standalone pages and widgets
        └── widgets/             # Federated extension widgets supplied to Product
            ├── pricing-create-widget.tsx
            ├── pricing-create-slot.tsx
            ├── pricing-edit-widget.tsx
            └── pricing-edit-slot.tsx
```

### Module Rules:
- Widgets (`pricing-create-widget.tsx`, etc.) are wrapped with `createExposedSlot`.
- Slices projected adhere to canonical contracts (`PRODUCT_CONTRIBUTION_SLICES.PRICING_LINES`).
- Vite exposure keys (e.g. `./PricingCreateWidget`) are strictly maintained.
