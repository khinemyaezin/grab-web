import type { ProductLifecycleEvent } from "@/features/products/types";
export type UseProductVariantUpdateSubmitOptions = {
    productId: string;
    variantId: string;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export type UseProductVariantUpdateSubmitResult = {
    submit: () => Promise<void>;
};
export declare function useProductVariantUpdateSubmit({ productId, variantId, onLifecycleEvent, }: UseProductVariantUpdateSubmitOptions): UseProductVariantUpdateSubmitResult;
