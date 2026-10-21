import type { ReactNode } from "react";
import type { PricingEditContext, PricingEditPayload, SlotWidgetProps } from "@khinemyaezin/seller-contracts";
export type PricingEditFormContextProps = SlotWidgetProps<PricingEditContext, PricingEditPayload> & {
    loadingFallback?: ReactNode;
    children: ReactNode;
};
export declare function PricingEditFormContext({ context, initialValue, onChange, registerHandle, loadingFallback, children, }: PricingEditFormContextProps): string | number | bigint | boolean | import("react").JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>;
