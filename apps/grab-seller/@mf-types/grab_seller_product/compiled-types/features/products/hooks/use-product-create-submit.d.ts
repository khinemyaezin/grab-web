import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { ProductLifecycleEvent } from "@/features/products/types";
export type UseProductCreateSubmitOptions = {
    link: HateoasLink;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
    onSuccess?: (productId: string) => void;
};
export type UseProductCreateSubmitResult = {
    submit: () => Promise<void>;
};
export declare function useProductCreateSubmit({ link, onLifecycleEvent, onSuccess, }: UseProductCreateSubmitOptions): UseProductCreateSubmitResult;
