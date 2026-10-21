import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { ProductFormValue, ProductLifecycleEvent } from "@/features/products/types";
export type UseProductUpdateSubmitOptions = {
    productId: string;
    seed: ProductFormValue;
    actions?: Record<string, HateoasLink>;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export type UseProductUpdateSubmitResult = {
    submit: () => Promise<void>;
};
export declare function useProductUpdateSubmit({ productId, seed, actions, onLifecycleEvent, }: UseProductUpdateSubmitOptions): UseProductUpdateSubmitResult;
