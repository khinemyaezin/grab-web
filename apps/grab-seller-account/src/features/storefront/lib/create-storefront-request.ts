import type { CreateStorefrontRequest, StorefrontFormValues } from "@/features/storefront/types";

export function buildCreateStorefrontRequest(values: StorefrontFormValues): CreateStorefrontRequest {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
  };
}
