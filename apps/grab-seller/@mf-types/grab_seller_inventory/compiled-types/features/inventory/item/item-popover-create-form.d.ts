import { type ReactNode } from "react";
import { type InventoryPayload, type SlotHandle } from "@khinemyaezin/seller-contracts";
export type InventoryCreateFormProps = {
    seed?: InventoryPayload;
    contextSku?: string;
    onValuesChange?: (values: InventoryPayload) => void;
    registerHandle?: (handle: SlotHandle<InventoryPayload>) => void | (() => void);
    children: ReactNode;
};
export declare function ItemPopoverCreateForm({ seed, contextSku, onValuesChange, registerHandle, children, }: InventoryCreateFormProps): import("react").JSX.Element;
