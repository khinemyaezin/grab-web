import { type PricingEditPayload, type PricingPayload, type SlotContribution } from "@khinemyaezin/seller-contracts";
export declare function projectPricingCreate(payload: PricingPayload): SlotContribution[];
export declare function projectPricingEdit(payload: PricingEditPayload, variantId?: string): SlotContribution[];
