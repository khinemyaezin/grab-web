# Testing Requirements & Patterns

This document defines testing standards, frameworks, and mock conventions for the Seller Frontend Platform.

---

## 1. Test Setup & Framework

- **Test Runner**: Vitest with `jsdom` environment.
- **Assertion Library**: `@testing-library/react` and `@testing-library/jest-dom`.
- **Mock Server**: MSW (Mock Service Worker) for network/HATEOAS boundaries.
- **Co-location**: All test files MUST be co-located with their source units (`*.test.ts` or `*.test.tsx`).

```ts
// src/test/setup.ts
import "@testing-library/jest-dom/vitest";
```

---

## 2. Testing by Architectural Layer

Test each architectural layer with targeted, proportional test suites:

### A. Pure Adapters (`lib/*.test.ts`)
Test data transformations without React or DOM overhead:
```ts
describe("buildCreateSellableProductRequest", () => {
  it("transforms form values and merged contributions into valid request DTO", () => {
    const payload = buildCreateSellableProductRequest(mockFormValues, mockContributions);
    expect(payload).toEqual(expectedRequestDto);
  });
});
```

### B. Commands (`use-*-command.test.ts`)
Test payload execution and workflow correlation independently of form state:
```ts
describe("useCreateSellableProductCommand", () => {
  it("executes mutation and awaits workflow completion", async () => {
    // Mock awaitWorkflow and mutateAsync
    const { result } = renderHook(() => useCreateSellableProductCommand(mockLink));
    const output = await result.current.execute(mockPayload);
    expect(output.productId).toBe("prod-123");
  });
});
```

### C. Submit Sagas (`use-*-submit.test.ts`)
Mock the command and test validation, contribution merging, and lifecycle events:
```ts
describe("useProductCreateSubmit", () => {
  it("validates slots once and emits created event on success", async () => {
    const onLifecycleEvent = vi.fn();
    // Render hook inside FormProvider and QueryClientProvider
    // Trigger submit
    expect(onLifecycleEvent).toHaveBeenCalledWith({ type: "created", productId: "prod-123" });
  });

  it("stops and emits validationFailed when slot validation fails", async () => {
    // Mock slot validation failure
    // Trigger submit
    expect(onLifecycleEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "validationFailed" })
    );
  });
});
```

### D. Extension Slots
Verify slot contracts:
1. Required declarations fail validation if no widget registers a handle.
2. `optional: true` passes when unregistered.
3. Draft changes update `useSlotDraft`.
4. `useResetAllSlots` restores baseline state.
5. Unknown contribution slices throw `UnknownSlotSliceError`.

---

## 3. Mocking Conventions

### Mocking HATEOAS API Client:
```ts
vi.mock("@khinemyaezin/seller-api", async () => {
  const actual = await vi.importActual("@khinemyaezin/seller-api");
  return {
    ...actual,
    api: { followLink: vi.fn() },
  };
});
```

### Mocking Navigation (`react-router`):
```ts
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
```

### Rendering Hooks with Providers:
```ts
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

renderHook(() => useMyHook(), {
  wrapper: ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  ),
});
```
