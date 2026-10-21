import { type InventoryCreateContext } from "@khinemyaezin/seller-contracts";
export type InventoryLineSlotProps = {
    groupId: string;
    context: InventoryCreateContext;
};
export declare function InventoryLineFullSlot({ groupId, context }: InventoryLineSlotProps): import("react").JSX.Element;
