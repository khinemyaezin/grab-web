import { describe, expect, it } from "vitest";
import { buildUpdateStorefrontProfileRequest } from "./update-storefront-profile-request";
import type { StorefrontFormValues } from "@/features/storefront/types";

describe("buildUpdateStorefrontProfileRequest", () => {
  it("trims whitespace from name and slug", () => {
    const values: StorefrontFormValues = {
      name: "  Renamed Store  ",
      slug: "  renamed-store  ",
    };

    const result = buildUpdateStorefrontProfileRequest(values);

    expect(result).toEqual({
      name: "Renamed Store",
      slug: "renamed-store",
    });
  });
});
