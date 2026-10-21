import type { PricingEditPayload } from "@khinemyaezin/seller-contracts";
export type UsePricingEditOptions = {
    variantId?: string;
    contextSku?: string;
    initialValue?: PricingEditPayload;
};
export declare function usePricingEdit({ variantId, contextSku, initialValue, }: UsePricingEditOptions): {
    seed: PricingEditPayload;
    isLoading: boolean;
    isError: boolean;
};
