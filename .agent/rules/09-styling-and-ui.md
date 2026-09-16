# Styling & UI Primitives

This document defines styling guidelines, design system conventions, and UI component standards across all MFEs.

---

## 1. Styling Framework: Tailwind CSS v4

- **Tailwind CSS v4 Only**: Do NOT use CSS Modules, styled-components, Emotion, or inline style objects.
- **Entry Stylesheet (`src/styles.css`)**:
  All MFEs configure a single global stylesheet entry:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@khinemyaezin/seller-ui/styles.css";
@source "../node_modules/@khinemyaezin/seller-ui/dist";
```

- **Vite Integration**: Uses `@tailwindcss/vite` in `vite.config.ts`.

---

## 2. Design System & Shared UI (`@khinemyaezin/seller-ui`)

All common visual controls MUST be imported from `@khinemyaezin/seller-ui` (built on shadcn/ui and Radix primitives):

```tsx
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@khinemyaezin/seller-ui/components/card";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { QueryState } from "@khinemyaezin/seller-ui/components/query-state";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
```

### Core Rules:
1. **No Raw Form Controls**: Never use unstyled `<input>`, `<select>`, `<textarea>`, or `<button>` tags. Always use `@khinemyaezin/seller-ui` equivalents.
2. **Semantic Containers Allowed**: Standard semantic HTML wrappers (`form`, `section`, `article`, `header`, `div`, `p`, `span`) are permitted for structural layout.
3. **Domain Isolation**:
   - Generic primitives live in `@khinemyaezin/seller-ui`.
   - Domain-specific layout, status badges, terminology, and workflows stay inside the owning domain MFE.
4. **Accessibility (a11y)**:
   - Provide accessible labels (`FieldLabel`).
   - Wire `aria-invalid` to form field errors.
   - Use shared `FieldError` to display validation messages.
   - Support keyboard navigation on all interactive elements.
