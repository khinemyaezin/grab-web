import { ProductFormValue, GetFullProductResponse } from "../types";
export declare const DEFAULT_PRODUCT_FORM_VALUE: ProductFormValue;
export declare function transformProductToFormValue(apiData: GetFullProductResponse): ProductFormValue;
export type UseProductEditProps = {
    productId: string;
};
export declare function useProductEdit({ productId }: UseProductEditProps): {
    isLoading: boolean;
    isError: boolean;
    seed: ProductFormValue | null;
    status: string | undefined;
    actions: Record<string, import("@khinemyaezin/seller-api").HateoasLink> | undefined;
};
