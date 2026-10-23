import type { ProductVariantForm, UpdateProductContributions, UpdateProductVariantRequest } from "@/features/products/types";
export declare function buildUpdateProductVariantRequest(productId: string, variantId: string, variant: ProductVariantForm, contributions?: UpdateProductContributions): UpdateProductVariantRequest;
