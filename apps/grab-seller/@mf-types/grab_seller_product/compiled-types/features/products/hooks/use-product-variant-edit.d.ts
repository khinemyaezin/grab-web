import type { GetVariantResponse, ProductVariantForm } from "../types";
export declare const DEFAULT_PRODUCT_VARIANT_FORM_VALUE: ProductVariantForm;
export declare const DEFAULT_VARIANT_FORM: ProductVariantForm;
export declare function getVariantName(apiData: GetVariantResponse): string;
export declare function transformVariantToFormValue(apiData: GetVariantResponse): ProductVariantForm;
export type UseProductVariantEditProps = {
    productId: string;
    variantId: string;
};
export declare function useProductVariantEdit({ productId, variantId, }: UseProductVariantEditProps): {
    isLoading: boolean;
    isError: boolean;
    seed: import("../types").Variant | null;
    status: string | undefined;
    actions: Record<string, import("@khinemyaezin/seller-api").HateoasLink> | undefined;
    data: GetVariantResponse | undefined;
};
