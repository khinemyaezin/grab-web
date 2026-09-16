# Data Fetching, API & Server State

This document establishes standards for API discovery, HATEOAS traversal, TanStack React Query, and DTO modeling.

---

## 1. End-to-End API Flow

All business API operations MUST follow this explicit flow:

```text
Shell entry link
  → MFE EntryLinkProvider
  → Feature root discovery query (e.g. useRoot)
  → Relation / capability link (e.g. searchProducts, createSellableProduct)
  → Optional URL-template expansion (resolveUrlTemplate)
  → Domain API service in api/ (api.followLink)
  → TanStack Query hook in api/ (useQuery / useMutation)
  → Screen / View / Form
```

---

## 2. HATEOAS & Capability Signals

- **No Hardcoded URLs**: Backend endpoint paths MUST NOT be hardcoded in UI components or hooks.
- **Links as Capabilities**: An action link is an authorization and capability signal. UI actions MUST be rendered or enabled only when the corresponding link relation exists.
- **Link Scoping**: Resource-specific action links SHOULD be resolved from that resource's `_links` field.
- **Link Passing**: Pass links down via component props or hook arguments. Do NOT store links in global stores.

---

## 3. Pure API Services (`api/*.ts`)

Every domain feature maintains pure TypeScript services under `api/`:

```ts
import { api, type HateoasLink } from "@khinemyaezin/seller-api";

export const catalogService = {
  getFullProduct: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<GetFullProductResponse>(link, "GET", undefined, undefined, headers),

  createSellableProduct: (link: HateoasLink, request: CreateSellableProductRequest) =>
    api.followLink<CreateSellableProductResponse>(link, "POST", request),
};
```

### Rules:
- Services MUST be React-free (no hooks, no JSX).
- Services MUST accept a typed `HateoasLink`, method payload, and optional headers.
- Services MUST NOT show toasts, trigger navigation, or manipulate React state.

---

## 4. TanStack Query Conventions

Query hooks wrap domain services to manage server state:

### A. Structured Query Keys & Invalidation
Always define stable, structured query keys and export centralized cache invalidation functions:

```ts
export function invalidateProductsQueries(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: ["products"] });
}

export function invalidateProductDetailQueries(queryClient: QueryClient, productId: string) {
  return queryClient.invalidateQueries({ queryKey: ["product", productId] });
}

export function invalidateProductQueries(queryClient: QueryClient, productId?: string) {
  const promises = [invalidateProductsQueries(queryClient)];
  if (productId) {
    promises.push(invalidateProductDetailQueries(queryClient, productId));
  }
  return Promise.all(promises);
}
```

### B. Enabled Guards
Queries that require a valid link or entity ID MUST guard execution with `enabled`:

```ts
export function useProductGet(link?: HateoasLink, productId?: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => catalogService.getFullProduct(resolvedLink),
    enabled: Boolean(link && productId),
  });
}
```

### C. Thin Mutation Wrappers
`useMutation` wrappers in `api/` must stay thin: `mutationFn` plus optional query invalidation. They MUST NOT read React Hook Form, validate extension slots, display toasts, or trigger navigation.

---

## 5. Type & DTO Separation

Keep domain and transport types separated into discrete files under `types/`:

| File Pattern | Purpose | Example |
|:---|:---|:---|
| **`*.response.ts`** | Backend response schemas and HATEOAS models | `GetFullProductResponse`, `CatalogRoot` |
| **`*.request.ts`** | Backend request DTOs | `CreateSellableProductRequest`, `ProductSearchRequest` |
| **`*.model.ts`** | UI/domain presentation models | `Product`, `ProductVariant`, `CategoryLeaf` |
| **`*.form.ts`** | Editable form state schemas | `ProductFormValue`, `ProductFilterFormValue` |
| **`lib/*`** | Pure adapters converting between types | `to-product-form-value.ts`, `create-sellable-product-request.ts` |

> [!TIP]
> Complex create and edit workflows MUST use pure adapters in `lib/` instead of building nested request DTOs inside JSX or mutation callbacks. Pure adapters must be unit tested.
