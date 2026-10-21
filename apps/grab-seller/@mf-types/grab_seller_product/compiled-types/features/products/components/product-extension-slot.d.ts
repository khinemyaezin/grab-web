import type { ReactNode } from "react";
import { PRODUCT_EXTENSION_SLOTS, PRICING_DOMAIN, PRICING_EDIT_DOMAIN, INVENTORY_DOMAIN, INVENTORY_EDIT_DOMAIN, type ProductExtensionSlotName } from "@khinemyaezin/seller-contracts";
import { type ExtensionSlotProps } from "@khinemyaezin/seller-ui";
export type ProductExtensionSlotProps<TContext, TPayload> = {
    name: ProductExtensionSlotName;
    domain: string;
    groupId: string;
    context: TContext;
    variant?: ExtensionSlotProps["variant"];
    optional?: boolean;
    fallback?: ReactNode;
};
export declare function ProductExtensionSlot<TContext, TPayload>({ name, domain, groupId, context, variant, optional, fallback, }: ProductExtensionSlotProps<TContext, TPayload>): import("react").JSX.Element;
export { PRODUCT_EXTENSION_SLOTS, PRICING_DOMAIN, PRICING_EDIT_DOMAIN, INVENTORY_DOMAIN, INVENTORY_EDIT_DOMAIN, };
