# Architecture Rules — Seller Frontend Platform

This file is the implementation blueprint for new components, pages, features, and
cross-module integrations in `grab-web`.

The rules are derived from the current source and accepted ADRs. When this file
conflicts with older examples in `.agent/project-rules.md`, older generated
federation declarations, or superseded ADR sections, follow this file and the
latest accepted ADR.

## 1. Rule language and source of truth

- **MUST / MUST NOT**: required for new work.
- **SHOULD / SHOULD NOT**: preferred unless the change has a documented reason.
- **MAY**: optional.

Resolve conflicting evidence in this order:

1. Current runtime source and current `vite.config.ts` federation exposures.
2. The newest accepted ADR, including its supersedes/partially-supersedes notes.
3. Older architecture documentation.
4. Generated `@mf-types` declarations.

`@mf-types` is generated output. It MUST NOT be treated as the source of truth
when it disagrees with a remote's current `vite.config.ts`.

## 2. System architecture

The platform is a React 19, Vite, and Module Federation micro-frontend system.

### Applications

- `grab-seller`: shell/host. Owns global route mounting, layouts, session,
  `SellerPlatform`, remote boundaries, the backend event stream, and extension
  widget registration.
- `grab-seller-auth`: authentication and access-context remote.
- `grab-seller-account`: merchant selection and onboarding remote.
- `grab-seller-product`: product/catalog remote and parent of product extension
  slots.
- `grab-seller-inventory`: inventory routes and inventory slot widgets.
- `grab-seller-pricing`: pricing routes and pricing slot widgets.

Current federation surfaces:

- Auth exposes `./Routes`, `./AuthService`, and `./UserMenuWidget`.
- Account exposes `./Routes` and `./Service`.
- Product exposes `./Routes`.
- Inventory exposes `./DashboardRoutes`, `./LocationRoutes`, `./StockRoutes`,
  `./ProductInventoryWidget`, and `./InventoryItemEditWidget`.
- Pricing exposes `./Routes`, `./PricingCreateWidget`, and
  `./PricingEditWidget`.

Route exposures mount an MFE-owned route tree. Widget exposures are narrow
embedding ports and MUST use the extension-slot contract when composed inside
another domain's UI.

### Shared packages

- `@khinemyaezin/seller-contracts`: framework-light, versioned cross-boundary
  contracts, route definitions, platform events, slot names, payload schemas,
  and contribution slice names.
- `@khinemyaezin/seller-api`: HATEOAS HTTP client and transport-level helpers.
- `@khinemyaezin/seller-ui`: generic UI primitives, layouts, providers, hooks,
  and slot infrastructure.

### Dependency direction

New code MUST preserve this direction:

```text
seller-contracts
      ↓
seller-api
      ↓
seller-ui
      ↓
shell and domain MFEs
```

Current `seller-ui` legitimately uses types/helpers from `seller-api` and
`seller-contracts`; it MUST NOT acquire product, pricing, inventory, auth, or
account business logic.

Rules:

- A remote MFE MUST NOT import source or a federated module from another remote.
- Federated imports that compose multiple remotes MUST be concentrated in the
  shell.
- A domain MFE MUST own its UI state, server-state cache, API hooks, business
  rules, and request projections.
- The shell MUST orchestrate domains but MUST NOT absorb domain business logic.
- Shared packages MUST contain genuinely cross-domain infrastructure, not code
  moved merely to avoid a slot or a clear module boundary.
- React, React DOM, React Router, React Hook Form, TanStack Query, and the seller
  shared packages MUST remain compatible federation singletons where used
  across a mounted React tree.

## 3. Where new code belongs

Use the narrowest valid home:

- Used by one component: keep it in that component file.
- Used by one feature: keep it under that feature.
- Used by multiple features in one MFE: place it in that MFE's shared feature or
  application layer.
- Generic visual primitive or framework integration: `seller-ui`.
- Cross-MFE type, slot name, event payload, or schema: `seller-contracts`.
- Generic HTTP/HATEOAS transport behavior: `seller-api`.
- UI supplied by one MFE and embedded in another: expose a federated widget and
  compose it through an extension slot.
- Cross-MFE notification of a fact: a versioned `platform.events` contract.

Do not use a shared global Redux/Zustand-style store for domain state. Backend
data remains authoritative and each MFE owns its TanStack Query cache.

## 4. Feature folder blueprint

New domain features SHOULD use this structure:

```text
src/
├── app/
│   └── *Routes.tsx
└── features/
    └── <feature>/
        ├── pages/
        │   ├── <entity>-list-page.tsx
        │   ├── <entity>-new-page.tsx
        │   └── <entity>-edit-page.tsx
        ├── components/
        │   ├── <entity>s-view.tsx
        │   ├── <entity>-new-form.tsx
        │   ├── <entity>-edit-form.tsx
        │   ├── <entity>-fieldset.tsx
        │   ├── <entity>-filter.tsx
        │   └── <entity>-table.tsx
        ├── hooks/
        │   ├── use-<entity>s.ts
        │   ├── use-<entity>-filter.ts
        │   └── use-<entity>-submit.ts
        ├── api/
        │   ├── discovery.ts
        │   ├── <entity>.ts
        │   └── index.ts
        ├── adapters/
        │   └── <operation>-<entity>-request.ts
        ├── types/
        │   ├── <entity>.request.ts
        │   ├── <entity>.response.ts
        │   ├── <entity>.model.ts
        │   ├── <entity>.form.ts
        │   └── index.ts
        ├── constants/
        ├── context/
        ├── lib/
        └── utils/
```

Only create folders that the feature needs.

### Folder responsibilities

- `pages`: route-level composition and shell-facing behavior.
- `components`: views, forms, fieldsets, filters, tables, dialogs, and domain UI.
- `hooks`: React Query wrappers and React orchestration logic.
- `api`: transport calls using `seller-api`; no React.
- `adapters` / `lib`: pure transformations, request builders, projections, and
  domain algorithms.
- `types`: separate API request, API response, internal model, and form types.
- `context`: feature-local React context only.
- `constants`: stable feature constants and workflow names.

### Naming and imports

- Files and directories SHOULD be kebab-case.
- Components and types MUST be PascalCase.
- Hooks MUST use the `use` prefix.
- Feature imports SHOULD use the configured `@/` alias.
- Relative imports SHOULD be used for nearby files inside the same component
  subtree.
- Pages and primary route wrappers MAY use default exports. Reusable hooks,
  utilities, contracts, and slot widgets SHOULD use named exports.
- Existing route forms commonly use `new`; slot/domain operation forms commonly
  use `create`. Pick one vocabulary for the flow and do not alternate names for
  the same operation.

## 5. Page, view, and component responsibilities

`page → view → form/table → fieldset` is a responsibility split, not a
mandatory number of wrappers. Skip a layer only when it would be a pass-through.

### Page

A `*-page.tsx` is a route boundary. It SHOULD own:

- route parameter parsing and required-parameter guards;
- page container and page-scoped providers such as `SlotProvider`;
- shell breadcrumbs;
- feature-root capability discovery (`useRoot`, `useCatalogLink`,
  `useInventoryLink`) needed to decide whether the screen/action is available;
- nested capability discovery: a parent GET **only** to resolve a child
  collection/create/get link and breadcrumb names;
- mapping typed child lifecycle events to shell toasts, breadcrumbs, or
  navigation.

Header ownership is **not** automatically the page. See Header ownership below.

A page MUST NOT contain field-level form state, request mapping, domain tables,
resource summaries, fieldsets, or other resource domain UI. A page MUST NOT
call the query for the resource being edited when that resource's `_links` are
required to render the Header; the view loads it instead.

### View

A `*-view.tsx` SHOULD be introduced when it coordinates a meaningful screen
region, such as:

- list filter + create action + table;
- dashboard filters + KPIs + charts;
- detail summary + multiple action forms/tables;
- parent summary + child list;
- a wizard or multi-step workflow;
- selection and routing among several forms;
- edit/detail whose Header needs resource `_links`.

A view MAY own list/filter hooks, the screen's resource query, loading/error
for that query, and composition state. Do not add a view that only forwards
unchanged props to one form. Create screens stay `page → form`.

### Form and leaf components

- A `*-form.tsx` owns one form lifecycle and its React Hook Form provider.
- A `*-fieldset.tsx` or `*-fields.tsx` owns related controls and reads typed form
  context.
- A `*-table.tsx` owns tabular rendering, row actions, loading/empty states, and
  pagination callbacks.
- A `*-filter.tsx` owns filter controls, not result fetching.
- Reusable controls MUST use `seller-ui` primitives when an equivalent exists.
  Semantic HTML wrappers such as `form`, `main`, `section`, and layout `div`s
  are allowed.

### Header ownership

`Header` is owned by the nearest layer that already has the data to render it.

- **Page:** static title, description, back navigation, and list-level create.
  Typical for list, create, and edit screens whose header does not read resource
  `_links`.
- **View:** resource-gated header actions (archive, restore, and similar) when
  those items come from the loaded resource's `_links`. Reference:
  product-edit-view composes `Header` + `ProductActionsMenu` + form.

Do not portal header controls. Do not copy resource `_links` onto the page.
Resource lifecycle actions that already live in the body (form footers, detail
action panels) MAY stay there; this rule does not require every entity to grow
a header ellipsis.

### List blueprint

```text
<entity>-list-page
  ├── Header (static chrome) and route-level back/create
  └── <entity>s-view
      ├── use-<entity>-filter
      ├── <entity>-filter
      └── <entity>-table
          └── use-<entity>s query
```

The page supplies static chrome. The view coordinates filter state and domain
UI. The table or view loads rows through a query hook, following the convention
already used by that feature.

## 6. Data and API flow

All business API calls MUST follow this flow:

```text
shell entry link
  → MFE EntryLinkProvider
  → feature root discovery query
  → relation/capability link
  → optional URL-template expansion
  → domain API service using api.followLink
  → TanStack Query hook
  → view/form
```

### HATEOAS and capabilities

- Backend URLs MUST NOT be hard-coded in components or domain hooks.
- Pages/features MUST discover entry links and relation links.
- An action link is also an authorization/capability signal. UI actions MUST be
  rendered or enabled only when the corresponding relation exists.
- Resource-specific action links SHOULD be resolved from that resource's
  `_links`.
- Links SHOULD be passed to the component or hook that performs the action;
  they MUST NOT be stored in a cross-MFE global store.

### API services

- API service files MUST be React-free.
- Services MUST accept a typed `HateoasLink`, method input, and optional transport
  metadata such as headers.
- Services MUST call shared `api.followLink` and return typed responses.
- Services MUST NOT show toasts, navigate, or mutate React state.

### TanStack Query hooks

- Query hooks MUST define stable, structured keys that include entity IDs,
  filters, and link identity where relevant.
- Queries that require a link or ID MUST use `enabled` guards.
- Mutation hooks SHOULD centralize predictable cache invalidation helpers.
- UI filter-to-request normalization MAY live in a query hook; complex or
  reusable request mapping MUST be a pure adapter.
- Components MUST NOT call `fetch` directly.
- `api/` `useMutation` wrappers MUST stay thin: `mutationFn` plus optional
  cache invalidation. They MUST NOT read React Hook Form, validate slots,
  show toasts, or navigate.

### Types and adapters

Keep these concepts separate:

- `*.response.ts`: server response and HATEOAS shapes.
- `*.request.ts`: server request DTOs.
- `*.model.ts`: UI/domain model independent of transport.
- `*.form.ts`: editable form shape.
- `adapters/*`: response-to-form and form-to-request transformations.

Complex create/edit flows MUST use pure adapters instead of constructing nested
requests in JSX or mutation callbacks. Pure transformations SHOULD be exported
and unit tested.

## 7. Form architecture

React Hook Form is the standard form state layer.

### Shared form rules

- The form owner MUST create the form with a typed `useForm<T>()`.
- It MUST wrap fields in `FormProvider` when child fieldsets use
  `useFormContext<T>()`.
- Field components MUST use stable field names and display validation errors
  with shared field primitives.
- Use `Controller`/`useController` for controlled or non-native components and
  `register` for suitable native inputs.
- Server state MUST NOT be copied into an untyped collection of local states.
- Pending actions MUST be disabled appropriately and SHOULD communicate state
  with `ButtonStatus`.
- A form SHOULD emit a typed lifecycle event to its page instead of directly
  owning shell toasts or breadcrumbs.

For ordinary forms, inline React Hook Form validation rules are valid. A Zod
schema is not mandatory for every form.

Cross-MFE slot forms MUST validate against the canonical shared payload schema
when one exists. Current pricing/inventory slots use Zod resolvers created from
JSON schemas in `seller-contracts`.

### Write-path layers

FormContext is for **fields**. Commands take an already-built payload.

Skip a file when it would be a pass-through:

- Simple POST (no slots, no workflow await, no extra attach): the form, or a
  tiny submit hook, MAY call the TanStack mutation directly. Do not add a
  command file.
- Complex write (slots and/or workflow await and/or media/description attach):
  submit saga + command + pure adapter.

Hook taxonomy:

- **Page events** (`use-<entity>-<op>-events.ts`): map lifecycle facts to
  `platform.events`, breadcrumbs, and navigate. MUST NOT read the form, call
  HTTP, or validate slots.
- **Submit saga** (`use-<entity>-<op>-submit.ts`): one use-case. MAY use RHF,
  `useValidateAllSlots`, adapters, the command, and media helpers. MUST NOT
  call `mutateAsync` or `awaitWorkflow` directly when a command exists.
  Validate slots **once**, here. Then build the request in `lib/`,
  `command.execute(payload)`, optional attach, invalidate, emit past-tense
  lifecycle.
- **Command** (`use-<entity>-<op>-command.ts`): payload in, result out.
  MAY use `useMutation`, `useWorkflowAwaiter`, and resolve-id helpers.
  MUST NOT use `useFormContext`, validate slots, toast, or navigate.
- **Query / mutation** (`api/use-*.ts`): TanStack Query and the React-free
  service. MUST NOT read the form, slots, or chrome.
- **Adapter** (`lib/`): pure data. No React.
- **Field UI** (`ui/` or the screen folder): MAY use `useFormContext`. MUST NOT
  build request DTOs.

Do **not** name a React hook `*-workflow.ts`. That collides with TanStack
`useQuery` and with workflow *name* constants. The awaiter stays
`useWorkflowAwaiter`.

One fact stream: do not add a parallel `onCreated` / `onSuccess` beside
lifecycle events. If the page must navigate, put the id on the event
(`{ type: "created", productId }`).

Happy path order:

1. **Show screen** — the layer that owns the query renders loading / error /
   empty / success (`useRoot` on create; the resource query on an edit view).
2. **Input** — RHF + fieldsets + slots. Derived effects such as matrix sync
   stay on the form, not in submit.
3. **Validate once** — `handleSubmit` (host fields), then one slot `validate()`.
   Fail → `validationFailed` → page toast. Stop.
4. **Submit** — adapter → command → optional attach → invalidate → lifecycle.
   The page maps events to toast / breadcrumb / navigate.

### Create form blueprint

```text
<entity>-new-page
  ├── resolve create capability link (root or nested parent GET)
  ├── loading / error / empty when the create link is missing
  ├── Header / Back action (static; page-owned)
  ├── lifecycle event → toast/navigation
  └── <entity>-new-form(link, onLifecycleEvent)
      ├── useForm<FormValues>({ defaultValues, mode })
      ├── FormProvider
      ├── <form onSubmit={handleSubmit(submit)}>
      ├── Card / <entity>-fieldset
      ├── simple: useMutation
      ├── complex: use-<entity>-create-submit
      │     └── use-<entity>-create-command(payload)
      └── success: invalidate, reset, emit { type: "created", id }
```

Do not add a create view that only wraps the form. Nested create pages MAY use
a parent GET on the page solely to resolve the create link and breadcrumb names.

Create-form requirements:

1. Define a typed, immutable default value.
2. Receive or resolve a valid create link before rendering an actionable form.
   The page MUST show loading, error, and empty when that link is unavailable.
3. Use a simple mutation directly only when there are no slots, no workflow
   await, and no extra attach steps.
4. Otherwise extract a submit saga, a payload-in command when the write awaits
   a workflow or sequences extra calls, and a pure request adapter.
5. Reset only after confirmed success. Discard MUST reset the host form and
   any extension-slot seed.
6. Emit past-tense success/failure lifecycle events on one channel. Include
   the created id when the page must navigate.

### Edit form blueprint

Choose who loads the resource from Header ownership:

**A. Static Header (page-owned).** Typical for location/zone/bin edit. The form
MAY load the resource.

```text
<entity>-edit-page
  ├── validate route ID
  ├── nested/root get capability link
  ├── Header / Back action / breadcrumb
  ├── lifecycle event → toast/title/navigation
  └── <entity>-edit-form(id or link, onLifecycleEvent)
      ├── load resource
      ├── loading / error
      ├── transform response → seed
      ├── useForm + fieldsets
      ├── simple: useMutation
      ├── complex: use-<entity>-update-submit
      │     └── use-<entity>-update-command(payload)
      └── body lifecycle actions from resource._links
```

**B. Header needs resource `_links`.** Typical for product edit. The view MUST
load; the form receives `seed` and `actions`.

```text
<entity>-edit-page
  ├── validate route ID
  ├── root get capability gate (loading / error / empty)
  ├── lifecycle event → toast/title/navigation
  ├── SlotProvider
  └── <entity>-edit-view(id, onLifecycleEvent)
      ├── load resource
      ├── Header (back + resource-gated actions)
      ├── loading / error
      └── <entity>-edit-form(seed, actions, onLifecycleEvent)
          ├── useForm + fieldsets
          ├── use-<entity>-update-submit
          │     └── use-<entity>-update-command(payload)
          └── submit / discard
```

Do not add an edit view that only forwards props to one form when the Header is
static and the form already loads the resource.

Edit-form requirements:

1. Loading, missing data, and load failure MUST have explicit render paths in
   the layer that owns the query (view in blueprint B, form in blueprint A).
2. Transform API data to a form seed in a pure function.
3. The form MUST reset when a genuinely new seed is loaded.
4. Reset effects MUST depend on stable seed identity to avoid erasing user edits
   on unrelated renders.
5. Update, activate, archive, publish, or delete controls MUST be based on the
   resource's available action links.
6. Discard MUST restore both the local form seed and any extension-slot seed.
7. Successful mutation MUST update the form baseline or navigate/refetch so the
   screen is not left falsely dirty.
8. Follow the write-path skip rule: simple mutation, or submit + command when
   slots, workflow await, or extra attach steps are involved. Validate slots
   once in the saga. Map timeout/failed lifecycle events in the saga.

### Shell context bar

Long or composite forms MAY integrate with `useContextBar`.

- Dirty state MUST combine the host form and extension drafts when slots exist.
- `onSave` MUST await `handleSubmit`; validation failure MUST reject/throw so the
  shell does not report a false success.
- `onDiscard` MUST reset the host form and all slot handles.
- Shell `form:save:v1` and `form:discard:v1` are explicit chrome-command
  exceptions to the general past-tense event rule.

## 8. Typed lifecycle events

Children SHOULD report domain outcomes through discriminated unions:

```ts
type EntityLifecycleEvent =
  | { type: "titleResolved"; title: string }
  | { type: "created"; id: string }
  | { type: "createFailed" }
  | { type: "updated" }
  | { type: "updateFailed" }
  | { type: "validationFailed"; errors: Record<string, unknown> };
```

Rules:

- Events SHOULD describe facts that already happened.
- Include the created resource id on `created` when the page must navigate.
  Do not add a parallel `onCreated` / `onSuccess` callback.
- Pages or page hooks translate lifecycle events into shell toasts,
  breadcrumbs, and navigation.
- Forms/hooks own operation details; pages own page-level presentation.
- Failure events SHOULD preserve actionable categories such as validation,
  timeout, and request failure instead of collapsing everything into one
  generic error when the distinction changes the user response.

## 9. Cross-module component decision guide

Before creating a slot, choose the right mechanism:

- Same feature and same MFE: direct component import.
- Generic reusable visual component: add or reuse `seller-ui`.
- Cross-MFE compile-time type or event: `seller-contracts`.
- One MFE's UI rendered inside another MFE's page/form: extension slot.
- Authentication, toast, breadcrumb, workflow, stream lifecycle, or another
  true cross-MFE notification: `platform.events`.
- Backend data change: REST/HATEOAS and the owning MFE's query cache; a signal
  may trigger refetch.

Do not use `platform.events` as a substitute for React props, form bindings,
slot validation, or imperative widget handles in the same React tree.

## 10. Extension slot architecture

The current slot model is declaration-driven and uses a props-down/handles-up
bridge.

```text
shell registry
  → lazy federated widget + platform + domain entry link
  → parent MFE ExtensionProvider
  → parent placement wrapper
  → ExtensionSlot declares intent
  → remote widget registers SlotHandle
  → widget onChange updates SlotProvider draft cache
  → parent validates all declarations
  → domain handle projects SlotContribution[]
  → parent merges only allowlisted slices
  → parent request adapter builds the final request
```

### Ownership

The shell owns:

- importing remote widgets lazily;
- mapping canonical slot names to widget components;
- injecting `SellerPlatform` and the supplying domain's entry link;
- fault isolation through the normal remote/slot boundaries.

The parent MFE owns:

- where the slot appears;
- stable slot instance/group IDs;
- context passed to the widget;
- whether the slot is required or optional;
- the accepted contribution-slice allowlist;
- final request assembly.

The supplying domain MFE owns:

- the exposed widget entry;
- payload validation;
- local field UI and presentation variants;
- reset baseline;
- conversion of validated domain values into `SlotContribution[]`.

Shared packages own:

- canonical slot/context/payload/contribution contracts;
- `ExtensionSlot`, `SlotProvider`, declaration, draft, validation, reset, error,
  and contribution-merging infrastructure;
- `createExposedSlot` and generic RHF slot-handle helpers.

### Canonical slot contract

New widgets MUST follow the `SlotWidgetProps<TContext, TPayload>` shape:

```ts
type SlotWidgetProps<TContext, TPayload> = {
  groupId: string;
  slotId: string;
  variant?: "full" | "inline";
  context?: TContext;
  initialValue?: TPayload;
  onChange: (value: TPayload) => void;
  registerHandle?: (handle: SlotHandle<TPayload>) => void | (() => void);
};
```

Rules:

- Slot names, context types, payload types/schemas, and contribution slice names
  MUST be defined in `seller-contracts`.
- `groupId` MUST identify one logical instance, such as one variant/row, and
  remain stable for that instance.
- A new logical instance MUST receive a new `groupId`.
- Presentation is a `variant` (`full` or `inline`), not a separate slot ID.
- Context changes flow down as props. They MUST NOT be hydrate events.
- Draft changes flow up through `onChange`.
- Capabilities flow up through `registerHandle`.
- A slot MUST NOT register fields directly into the parent MFE's React Hook Form
  or depend on the parent's field names. Its payload contract is the boundary.
- An embedded slot form MUST NOT render a nested HTML `<form>` when the parent
  already owns the submit form.
- Sibling slots MUST NOT call or subscribe to one another. Shared context must be
  mediated by the parent.

### Parent placement wrapper

The parent SHOULD create a domain-specific wrapper around generic
`ExtensionSlot`, as product does with `ProductExtensionSlot`.

The wrapper SHOULD:

- read/write the draft cache with `useSlotDraft(domain, groupId)`;
- read validation messages with `useSlotErrors(groupId)`;
- pass only `groupId`, typed context, `initialValue`, and `onChange`;
- set `optional` deliberately;
- provide a useful loading/unavailable fallback when appropriate.

`ExtensionSlot` injects `slotId`, `variant`, and `registerHandle`. A parent
wrapper MUST NOT invent a competing handle registry.

### Declaration and availability

- Every rendered `ExtensionSlot` declares intent for its lifetime, even before
  a lazy widget mounts.
- Required is the default.
- A required declaration without a registered handle MUST fail validation with
  a structured `_slot` error.
- `optional: true` MAY be used only when omitting the domain contribution is
  valid business behavior.
- An optional slot MUST NOT be used merely to hide a missing or broken required
  remote.
- Slot validation MUST have a finite timeout. The current shared default is
  10 seconds.

### Widget implementation

An exposed widget SHOULD be built with `createExposedSlot` so platform and entry
link providers are installed consistently.

The slot component SHOULD:

1. Select presentation fields from `variant`.
2. Create or compose the domain form.
3. Seed from `initialValue` once for the logical instance.
4. Apply live parent context, such as SKU, without marking the field dirty when
   it is parent-controlled.
5. emit current values through `onChange`.
6. register a handle with `validate`, `getValues`, `reset`, and `project`.

For React Hook Form slots, use `useRhfValueSource`,
`useSlotChangeEmitter`, and `useRhfSlotHandle` unless the widget has a justified
custom state model.

The handle proxy MUST be registered in layout timing without waiting for
`ref.current`; the actual imperative widget ref may be populated later.

### Drafts, dirty state, and reset

- The widget form owns active field interaction.
- `SlotProvider`'s draft store is the parent-side cache for remounting,
  initial values, and dirty tracking.
- The backend remains the persistent source of truth.
- A widget reset MUST restore its captured baseline and emit that baseline
  through `onChange` so the parent cache also resets.
- The parent MUST call `useResetAllSlots()` when discarding or after a successful
  operation that returns to a clean baseline.
- The parent MUST include `useIsExtensionDirty()` when computing composite dirty
  state.

### Validation and projection

On save, the parent MUST:

1. call `useValidateAllSlots().validate()`;
2. stop if any result is invalid;
3. surface keyed errors using `${groupId}::${slotId}`;
4. merge valid contributions through `mergeContributions`;
5. pass an explicit allowlist of accepted slices;
6. pass merged contributions to a pure final request adapter.

A domain `project()` MUST return:

```ts
type SlotContribution = {
  slice: string;
  append: unknown[];
};
```

The parent MUST NOT inspect or recreate domain projection internals. Unknown
slices MUST be hard errors, not silently ignored.

### Federation registration

Adding a slot widget requires all of these:

1. Add canonical types/constants/schema/slices to `seller-contracts`.
2. Implement the domain slot form, fields, validation, reset, and projection.
3. Wrap the slot with `createExposedSlot`.
4. Expose the widget in the supplying remote's `vite.config.ts`.
5. Add a lazy registry row in the shell.
6. Inject the supplying domain's entry link in the shell registry wrapper.
7. Pass the extension registry to the parent remote.
8. Add parent placement with a stable `groupId` under `SlotProvider`.
9. Add the contribution slice to the parent's allowlist when applicable.
10. Test missing, loading, validation, reset, projection, and merge behavior.
11. Regenerate federation declarations; do not hand-edit generated `@mf-types`.

## 11. Platform events and backend stream

`SellerPlatform` is the only shell integration object remotes consume. A remote
route may additionally receive its domain entry link, base-path data, or an
extension registry as explicit mount props.

### Event rules

- Remotes MUST use `platform.events`, normally through `usePlatform()`.
- Event names MUST be versioned: `domain:fact:v1`.
- Payloads MUST be declared in `seller-contracts`.
- Auth events remain signal-only; consumers read the session snapshot.
- Toast, breadcrumb, form chrome, stream lifecycle, and workflow signals are
  valid platform events.
- Slot hydrate, draft, validate, validated, and reset traffic MUST NOT use the
  event bus.
- New request/response event pairs SHOULD NOT be introduced for same-tree
  composition.
- `emit` is for signals/commands; `setState` is only for explicitly contracted
  page-session state requiring replay.

### Backend stream

- The shell alone owns the authenticated backend SSE/fetch stream.
- Remotes MUST NOT open their own stream or import the stream client.
- The shell maps relevant backend events to versioned `platform.events` topics.
- Heartbeats stay inside the stream parser.
- REST/HATEOAS remains authoritative; stream events trigger coordination or
  refetch rather than replacing server state.

### Workflow completion

For asynchronous workflows:

- Generate an idempotency key before the POST.
- Subscribe before triggering the request so a fast terminal event is not lost.
- Correlate using workflow name plus idempotency key.
- Treat `COMPLETED`, `FAILED`, `COMPENSATED`, and timeout distinctly.
- Invalidate/refetch authoritative queries after confirmed success.

## 12. Routing and remote boundaries

- Canonical shell paths and route builders SHOULD live in
  `seller-contracts/src/routes.ts`.
- The shell mounts remote route roots through `RemoteBoundary`.
- Each remote owns its nested `<Routes>` and not-found route.
- Remote route entry components receive the domain entry link and optional
  platform/extension registry through props, then install the corresponding
  providers.
- The shell MUST NOT duplicate a remote's nested route definitions or feature
  pages.
- Remote loading/error failures MUST remain isolated from the rest of the shell.

## 13. Loading, errors, and authorization

- Every asynchronous screen MUST define loading, error, empty, and success
  behavior in the layer that owns the query.
- Edit forms MUST not render editable fields before a valid seed exists unless
  their reset/hydration behavior is explicitly safe.
- Missing capabilities MUST disable or omit actions; they MUST NOT fall through
  to hard-coded endpoints.
- Slot errors MUST render near the corresponding slot when possible and MAY
  additionally be summarized in a toast.
- Errors crossing a lifecycle boundary SHOULD preserve enough structure for the
  page to produce an actionable message.
- Error boundaries/fallbacks do not make required slot data optional; required
  declarations still fail closed.

## 14. Styling and shared UI

- Use Tailwind utility classes and existing `seller-ui` primitives.
- Do not introduce a second design system for a domain MFE.
- Add a primitive to `seller-ui` only when it is generic and reusable across
  domains.
- Keep domain wording, business status, request logic, and domain-specific
  layouts in the owning MFE.
- Use accessible labels, `aria-invalid`, shared `FieldError`, and semantic
  controls.

## 15. Testing requirements

Tests SHOULD be colocated as `*.test.ts` or `*.test.tsx` and use Vitest. Use
Testing Library for React behavior and MSW for HTTP integration boundaries.

Add tests proportional to the change:

- Pure adapter/transformer: input/output cases and edge cases.
- Query hook: key inputs, enabled conditions, request normalization, and cache
  invalidation where non-trivial.
- Create form: validation, submitted DTO, pending state, lifecycle success/fail,
  and reset after success.
- Edit form: response-to-seed transform, loading/error path, hydration/reset,
  action capability visibility, and update lifecycle.
- Slot: required/optional declaration, missing handle, validation error,
  timeout, draft propagation, reset baseline, projection, and unknown slice.
- Platform event: typed payload and relevant subscribe/cleanup behavior.
- Federation exposure: typecheck/build the supplier and consumer; regenerate
  declarations when exposure contracts change.

Do not require a Storybook story: the repository currently has no established
story convention.

For changes spanning shared packages and MFEs, verify the shared packages first,
then every touched supplier, shell registry, and parent consumer.

## 16. Implementation checklists

### New list/detail feature

- [ ] Add route in the owning remote.
- [ ] Add canonical route builder if shell/global navigation needs it.
- [ ] Create thin page with params, breadcrumbs, lifecycle mapping, and static
      Header when chrome does not need resource `_links`.
- [ ] Create a view if it coordinates multiple regions, parent summary + child
      list, or a Header that needs resource `_links`. Skip a pass-through view.
- [ ] Keep resource domain UI (summaries, tables, fieldsets) off the page.
- [ ] Add typed response/request/model/form types as needed.
- [ ] Add HATEOAS service and React Query hook.
- [ ] Gate actions by discovered relations.
- [ ] Add loading, error, empty, and success states.
- [ ] Add focused tests.

### New create form

- [ ] Resolve a create capability link (root or nested parent GET on the page).
- [ ] Keep Header on the page (static title/back). Do not add a wrap-only view.
- [ ] Show loading, error, and empty when the create link is unavailable.
- [ ] Define typed defaults and form values.
- [ ] Create fieldsets from shared controls.
- [ ] Choose write-path shape: inline mutation (simple) or submit saga +
      command (slots, workflow await, or extra attach) + pure adapter.
- [ ] Validate host fields via `handleSubmit`, then slots once in the saga.
- [ ] Emit typed created/createFailed/validation lifecycle events. Put the
      created id on `created` when the page navigates. No parallel `onCreated`.
- [ ] Invalidate authoritative query keys.
- [ ] Reset only on confirmed success. Discard resets form and slots.
- [ ] Test the command without RHF. Test the saga by mocking the command.
- [ ] Test validation, payload, lifecycle, and reset.

### New edit form

- [ ] Validate route IDs.
- [ ] If Header needs resource `_links`, load in a view and pass seed/actions
      into the form. Otherwise the form MAY load the resource.
- [ ] Do not portal header actions or copy `_links` onto the page.
- [ ] Transform response to a stable seed.
- [ ] Render explicit loading and error states in the layer that owns the query.
      The page MUST show empty/unauthorized when the get capability is missing.
- [ ] Reset on seed change without wiping active edits.
- [ ] Resolve all actions from resource `_links`.
- [ ] Implement save and discard baselines.
- [ ] Choose write-path shape: inline mutation or submit saga + command.
- [ ] Emit typed lifecycle events and update breadcrumbs.
- [ ] Test the command without RHF. Test the saga by mocking the command.
- [ ] Test hydration, capability actions, update, and discard.

### New cross-MFE slot

- [ ] Confirm direct import or shared UI is not the correct mechanism.
- [ ] Add canonical slot/context/payload/schema/slice contracts.
- [ ] Implement domain form, variant fields, handle, reset, and projection.
- [ ] Wrap with `createExposedSlot`.
- [ ] Add current federation exposure.
- [ ] Register lazy widget and entry link in the shell.
- [ ] Add parent wrapper/placement under `SlotProvider`.
- [ ] Choose required or optional deliberately.
- [ ] Use stable logical `groupId`s.
- [ ] Add parent contribution allowlist.
- [ ] Validate before final request assembly.
- [ ] Cover unavailable, invalid, reset, and projection behavior.
- [ ] Regenerate federation types.