import { type ReactNode } from "react";
import { type PricingEditPayload, type SlotHandle } from "@khinemyaezin/seller-contracts";
export type PricingEditFormProps = {
    seed?: PricingEditPayload;
    contextSku?: string;
    variantId?: string;
    onValuesChange?: (values: PricingEditPayload) => void;
    registerHandle?: (handle: SlotHandle<PricingEditPayload>) => void | (() => void);
    children: ReactNode;
};
export declare function PricingEditForm({ seed, contextSku, variantId, onValuesChange, registerHandle, children, }: PricingEditFormProps): import("react").JSX.Element;
