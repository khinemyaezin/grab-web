import type { ProductFormValue, UpdateSellableProductRequest, UpdateProductContributions, UPDATE_INTENT } from "@/features/products/types";
export declare function buildUpdateSellableProductRequest(productId: string, values: ProductFormValue, intent: UPDATE_INTENT, contributions?: UpdateProductContributions): UpdateSellableProductRequest;
