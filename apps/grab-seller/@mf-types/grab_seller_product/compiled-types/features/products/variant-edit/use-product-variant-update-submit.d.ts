import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { ProductLifecycleEvent, ProductVariantForm } from "@/features/products/types";
export type UseProductVariantUpdateSubmitOptions = {
    productId: string;
    variantId: string;
    seed: ProductVariantForm;
    actions?: Record<string, HateoasLink>;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export type UseProductVariantUpdateSubmitResult = {
    submit: () => Promise<void>;
};
export declare function useProductVariantUpdateSubmit({ productId, variantId, seed, actions, onLifecycleEvent, }: UseProductVariantUpdateSubmitOptions): UseProductVariantUpdateSubmitResult;
