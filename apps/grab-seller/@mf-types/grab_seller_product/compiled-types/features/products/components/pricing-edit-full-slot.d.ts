import { type PricingEditContext } from "@khinemyaezin/seller-contracts";
export type PricingLineSlotProps = {
    groupId: string;
    context: PricingEditContext;
};
export declare function PricingLineEditFullSlot({ groupId, context }: PricingLineSlotProps): import("react").JSX.Element;
