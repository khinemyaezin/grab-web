import type { ProductFormValue, UpdateProductRequest, UPDATE_INTENT } from "@/features/products/types";
export declare function determineUpdateIntent({ hasVariationTypes, }: {
    hasVariationTypes: boolean;
}): UPDATE_INTENT;
export declare function buildUpdateProductRequest(values: ProductFormValue, intent: UPDATE_INTENT): UpdateProductRequest;
