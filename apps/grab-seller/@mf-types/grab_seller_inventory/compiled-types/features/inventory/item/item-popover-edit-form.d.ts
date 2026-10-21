import type { InventoryEditContext, InventoryEditPayload, SlotHandle } from "@khinemyaezin/seller-contracts";
export type InventoryItemEditProps = {
    context?: InventoryEditContext;
    value?: InventoryEditPayload;
    onChange?: (value: InventoryEditPayload) => void;
    registerHandle?: (handle: SlotHandle<InventoryEditPayload>) => void | (() => void);
};
export default function ItemPopoverEditForm({ context, value, onChange, registerHandle }: InventoryItemEditProps): import("react").JSX.Element;
