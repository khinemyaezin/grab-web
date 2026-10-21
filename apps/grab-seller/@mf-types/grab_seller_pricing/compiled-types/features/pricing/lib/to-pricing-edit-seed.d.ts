import type { PricingEditPayload } from "@khinemyaezin/seller-contracts";
export type PricingEditPriceSeed = {
    id?: string;
    currencyCode?: string;
    amount?: number;
};
export type ToPricingEditSeedInput = {
    initialValue?: PricingEditPayload;
    contextSku?: string;
    sku?: string;
    price?: PricingEditPriceSeed;
    priceSetId?: string;
};
export declare function toPricingEditSeed({ initialValue, contextSku, sku, price, priceSetId, }: ToPricingEditSeedInput): PricingEditPayload;
