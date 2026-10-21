import { describe, expect, it } from "vitest";
import { buildCreateStorefrontRequest } from "./create-storefront-request";
import type { StorefrontFormValues } from "@/features/storefront/types";

describe("buildCreateStorefrontRequest", () => {
  it("trims whitespace from name and slug", () => {
    const values: StorefrontFormValues = {
      name: "  My Awesome Store  ",
      slug: "  my-awesome-store  ",
    };

    const result = buildCreateStorefrontRequest(values);

    expect(result).toEqual({
      name: "My Awesome Store",
      slug: "my-awesome-store",
    });
  });

  it("handles clean inputs accurately", () => {
    const values: StorefrontFormValues = {
      name: "Boutique",
      slug: "boutique",
    };

    const result = buildCreateStorefrontRequest(values);

    expect(result).toEqual({
      name: "Boutique",
      slug: "boutique",
    });
  });
});
