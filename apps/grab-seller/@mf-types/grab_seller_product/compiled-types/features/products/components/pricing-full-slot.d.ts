import { type PricingCreateContext } from "@khinemyaezin/seller-contracts";
export type PricingLineSlotProps = {
    groupId: string;
    context: PricingCreateContext;
};
export declare function PricingLineFullSlot({ groupId, context }: PricingLineSlotProps): import("react").JSX.Element;
