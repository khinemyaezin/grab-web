import type { StorefrontFormValues, UpdateStorefrontProfileRequest } from "@/features/storefront/types";

export function buildUpdateStorefrontProfileRequest(
  values: StorefrontFormValues,
): UpdateStorefrontProfileRequest {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
  };
}
