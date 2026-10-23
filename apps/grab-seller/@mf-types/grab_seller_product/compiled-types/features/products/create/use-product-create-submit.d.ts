import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { ProductLifecycleEvent } from "@/features/products/types";
export type UseProductCreateSubmitOptions = {
    link: HateoasLink;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export type UseProductCreateSubmitResult = {
    submit: () => Promise<void>;
};
export declare function useProductCreateSubmit({ link, onLifecycleEvent, }: UseProductCreateSubmitOptions): UseProductCreateSubmitResult;
