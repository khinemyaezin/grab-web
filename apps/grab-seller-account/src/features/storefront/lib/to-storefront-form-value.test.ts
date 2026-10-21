import { describe, expect, it } from "vitest";
import { toStorefrontFormValue } from "./to-storefront-form-value";
import type { StorefrontResponse } from "@/features/storefront/types";

describe("toStorefrontFormValue", () => {
  it("maps StorefrontResponse properties to form values", () => {
    const storefront: StorefrontResponse = {
      storefrontId: "sf-123",
      merchantId: "merch-456",
      name: "Flagship Outlet",
      slug: "flagship-outlet",
      status: "ACTIVE",
      createdAt: "2026-09-01T00:00:00Z",
      updatedAt: "2026-09-02T00:00:00Z",
    };

    const result = toStorefrontFormValue(storefront);

    expect(result).toEqual({
      name: "Flagship Outlet",
      slug: "flagship-outlet",
    });
  });
});
