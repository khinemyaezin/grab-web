# Seller Frontend Platform — Agent & Architecture Knowledge Base

Welcome to the central architectural standards and coding rules for the **Seller Frontend Platform** (`grab-web`).

All AI coding assistants and developers working in this repository MUST adhere to the standards organized in this directory.

---

## 📚 Categorized Rules (`.agent/rules/`)

The rules are decomposed into focused, single-responsibility topic documents:

| Rule Document | Topic & Focus Area | Key Architectural Principles |
|:---|:---|:---|
| **[01. System Architecture](file:///Users/khinemyaezin/Repository/grab-web/.agent/rules/01-system-architecture.md)** | MFE Topology & Module Federation | Shell orchestration, domain remotes, shared packages hierarchy, singleton dependencies, zero cross-remote imports. |
| **[02. Project Structure](file:///Users/khinemyaezin/Repository/grab-web/.agent/rules/02-project-structure.md)** | Folder Standards & File Placement | Shared kernel + modules (`<domain>/api`, `types`, `lib`, `ui`, `widgets`), "Where a new file belongs" decision tree, naming conventions. |
| **[03. Screen Layers](file:///Users/khinemyaezin/Repository/grab-web/.agent/rules/03-screen-layers.md)** | UI Component Hierarchy | `Page → View → Form / Table / Filter → Fieldsets`, Header ownership rules, pass-through view elimination. |
| **[04. Data & API Flow](file:///Users/khinemyaezin/Repository/grab-web/.agent/rules/04-data-and-api.md)** | HATEOAS, Services & Server State | Dynamic link traversal via `seller-api`, React-free services, structured query keys, cache invalidation, DTO typing. |
| **[05. Forms & Mutations](file:///Users/khinemyaezin/Repository/grab-web/.agent/rules/05-forms-and-mutations.md)** | Write-Path Architecture | Submit sagas (`use-*-submit.ts`), payload-in commands (`use-*-command.ts`), pure request adapters, composite dirty state via `ContextBar`. |
| **[06. Extension Slots](file:///Users/khinemyaezin/Repository/grab-web/.agent/rules/06-extension-slots.md)** | Cross-MFE UI Plugins | `SlotBridge` declaration-driven model, `SlotProvider`, `ProductExtensionSlot` parent wrapper, validation passes, contribution slices. |
| **[07. Events & Messaging](file:///Users/khinemyaezin/Repository/grab-web/.agent/rules/07-events-and-messaging.md)** | EventBus & Backend Streams | `platform.events` (`domain:fact:v1`), host-owned SSE stream, `useWorkflowAwaiter`, typed `EntityLifecycleEvent` discriminated unions. |
| **[08. Auth & Session](file:///Users/khinemyaezin/Repository/grab-web/.agent/rules/08-auth-and-session.md)** | Authentication & Security | `platform.session`, `SessionSnapshot` discriminated union, HttpOnly cookies, CSRF protection, `RefreshCoordinator`. |
| **[09. Styling & UI](file:///Users/khinemyaezin/Repository/grab-web/.agent/rules/09-styling-and-ui.md)** | Design System & Components | Tailwind CSS v4, `@khinemyaezin/seller-ui` primitives, accessibility, prohibited unstyled raw form inputs. |
| **[10. Testing](file:///Users/khinemyaezin/Repository/grab-web/.agent/rules/10-testing.md)** | Testing Strategy & Tooling | Vitest + jsdom + RTL, MSW network mocking, co-located test suites (`*.test.ts`, `*.test.tsx`). |
| **[11. Workflow & Git](file:///Users/khinemyaezin/Repository/grab-web/.agent/rules/11-workflow-and-git.md)** | Version Control & Checklists | Conventional Commits, ADR registry (ADR-001 to ADR-007), implementation checklists for new features and slots. |

---

## 📐 Reference Blueprints (`.agent/blueprints/`)

Detailed target trees and module structures:

- **[Screen Module Blueprint](file:///Users/khinemyaezin/Repository/grab-web/.agent/blueprints/screen-module-blueprint.md)**: Flagship screen-based layout used by `grab-seller-product` (`list/`, `create/`, `edit/`, `variant-edit/`).
- **[Entity Module Blueprint](file:///Users/khinemyaezin/Repository/grab-web/.agent/blueprints/entity-module-blueprint.md)**: Entity-based layout used by `grab-seller-inventory` and `grab-seller-pricing` (`location/`, `bin/`, `widgets/`).

---

## 🛠️ Skills (`.agent/skills/`)

- **[App Generator Skill](file:///Users/khinemyaezin/Repository/grab-web/.agent/skills/app-generator/SKILL.md)**: Standard recipe for scaffolding a new React + Vite + Module Federation remote MFE.
