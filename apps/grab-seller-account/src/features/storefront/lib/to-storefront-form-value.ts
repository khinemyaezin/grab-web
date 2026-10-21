import type { StorefrontFormValues, StorefrontResponse } from "@/features/storefront/types";

export function toStorefrontFormValue(storefront: StorefrontResponse): StorefrontFormValues {
  return {
    name: storefront.name,
    slug: storefront.slug,
  };
}
