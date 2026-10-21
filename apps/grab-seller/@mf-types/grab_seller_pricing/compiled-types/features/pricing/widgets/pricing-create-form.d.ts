import { type ReactNode } from "react";
import { type PricingCreateContext, type PricingPayload, type SlotHandle } from "@khinemyaezin/seller-contracts";
export type PricingCreateFormProps = {
    context?: PricingCreateContext;
    defaultValues?: PricingPayload;
    onValuesChange?: (values: PricingPayload) => void;
    registerHandle?: (handle: SlotHandle<PricingPayload>) => void | (() => void);
    children: ReactNode;
};
export declare function PricingCreateForm({ context, defaultValues, onValuesChange, registerHandle, children, }: PricingCreateFormProps): import("react").JSX.Element;
