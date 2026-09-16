# Workflow, Git Conventions & Implementation Checklists

This document defines version control conventions, architectural decision records (ADRs), and implementation checklists.

---

## 1. Git Commit Conventions

Commit messages MUST adhere to the conventional format:

```text
type: description
```

### Allowed Types:
- `feat`: New feature or capability
- `fix`: Bug fix
- `refactor`: Code restructuring with no behavior change
- `docs`: Documentation updates
- `test`: Test suite updates or additions
- `chore`: Tooling, dependency, or config updates

### Formatting Rules:
- Lowercase, imperative mood ("add", "fix", "refactor", not "added" or "adds").
- No trailing period.
- Focused and atomic.

```text
feat: add product variant edit form with pricing slot
fix: resolve draft reset race condition in slot provider
refactor: decompose product edit form into submit saga and command
docs: document slot contribution slice merge rules
```

---

## 2. Architectural Decision Records (ADRs)

| ADR | Title | Key Decisions |
|:---|:---|:---|
| **ADR-001** | MFE State Sharing & Communication | Framework-agnostic custom `EventBus` singleton. Rejected global Redux/Zustand and native browser CustomEvents. |
| **ADR-002** | Auth State Sharing for MFEs | `SellerPlatform` as single integration contract. `SessionSnapshot` discriminated union, `SessionApi`, HttpOnly cookies. |
| **ADR-003** | Host-Mediated Session-Durable Event Bus | Event bus lifecycle managed by the shell; replay buffers for early mount listeners. |
| **ADR-004** | Host-Owned Backend Event Stream | Shell alone owns the authenticated backend SSE stream; maps messages to versioned platform event topics. |
| **ADR-005** | Workflow Terminal Signals | Asynchronous sagas correlate via idempotency keys; typed `COMPLETED`, `FAILED`, and timeout handling. |
| **ADR-006** | SlotBridge Capability Registry | Extension slots use a declaration-driven, props-down/handles-up architecture. |
| **ADR-007** | Declaration-Driven Slot Contributions | Slots project typed slices (`SlotContribution[]`); parents merge via explicit slice allowlists. |

---

## 3. Feature Implementation Checklists

### A. New List Screen Checklist
- [ ] Add nested route in owning remote's `AppRoutes.tsx`.
- [ ] Create thin `*-page.tsx` with static `Header`, route params, breadcrumbs, and lifecycle toast handling.
- [ ] Create `*-view.tsx` to coordinate filter state and table.
- [ ] Create `*-table.tsx` with loading, empty, and pagination states.
- [ ] Create `*-filter.tsx` with controlled filter inputs.
- [ ] Add pure API service in `api/` and TanStack Query hook with structured query keys.
- [ ] Gate actions by discovered HATEOAS relation links.
- [ ] Add co-located unit tests (`*.test.tsx`).

### B. New Create Form Checklist
- [ ] Resolve create capability link from root or parent query on the page.
- [ ] Keep static `Header` and back navigation on `*-page.tsx`. Do not wrap with a view.
- [ ] Render `QueryState` with fallback card if create link is unavailable.
- [ ] Wrap form with `SlotProvider` if extension slots are embedded.
- [ ] Implement `*-form.tsx` using `useForm<T>()` with immutable defaults.
- [ ] Extract submit saga (`use-*-submit.ts`), payload-in command (`use-*-command.ts`), and pure adapter in `lib/`.
- [ ] Validate host fields with `handleSubmit`, then slots once via `useValidateAllSlots()`.
- [ ] Merge contributions with `mergeContributions(results, allowlist)`.
- [ ] Wire `useContextBar` with composite dirty state (`isDirty || isExtensionDirty`).
- [ ] Emit past-tense lifecycle events (`{ type: "created", id }`). Include ID for navigation.
- [ ] Test command, saga, adapter, and form independently.

### C. New Edit Form Checklist
- [ ] Validate route ID from `useParams`.
- [ ] If `Header` requires actions from resource `_links`, load resource in `*-view.tsx` and pass `seed` + `actions` to form.
- [ ] Transform backend response into form seed via pure adapter in `lib/`.
- [ ] Handle loading and error states with `QueryState`.
- [ ] Reset form only on genuine seed identity changes.
- [ ] Gate body/header actions by discovered resource `_links`.
- [ ] Implement `onDiscard` to restore seed, reset slot handles, and clear dirty flags.
- [ ] Invalidate relevant query keys upon successful mutation.
- [ ] Test hydration, capability actions, update saga, and discard reset.

### D. New Cross-MFE Slot Checklist
- [ ] Define canonical slot name, context, payload schema, and slice names in `@khinemyaezin/seller-contracts`.
- [ ] Implement domain slot component, presentation variants (`full` vs `inline`), and handle (`validate`, `reset`, `project`).
- [ ] Wrap widget with `createExposedSlot`.
- [ ] Expose widget entry in supplying remote's `vite.config.ts`.
- [ ] Register lazy widget and domain entry link in `grab-seller` shell extension registry.
- [ ] Add parent placement wrapper under `SlotProvider` with stable `groupId`.
- [ ] Add slice name to parent's contribution allowlist.
- [ ] Test missing handle, validation error, draft updates, reset, and projection.
