import { InventoryEditContext, InventoryEditPayload, SlotHandle, SlotWidgetHandle } from "@khinemyaezin/seller-contracts";
import type { InventoryItemResponse } from "@/features/inventory/types";
import type { StockOperationSubmit } from "@/features/inventory/stock-operations";
import type { InventoryItemEditForm } from "@/features/inventory/types/inventory.form";
export type InventoryEditWidgetHandle = SlotWidgetHandle<InventoryEditPayload>;
export type UseInventoryEditControllerOptions = {
    context?: InventoryEditContext;
    value?: InventoryEditPayload;
    onChange?: (value: InventoryEditPayload) => void;
    onConfirm?: (item: InventoryItemResponse | undefined, payload: StockOperationSubmit) => Promise<void>;
    registerHandle?: (handle: SlotHandle<InventoryEditPayload>) => void | (() => void);
};
export declare function useInventoryEdit({ context, value, onChange, onConfirm, registerHandle, }: UseInventoryEditControllerOptions): {
    formValue: InventoryItemEditForm | undefined;
    isLoading: boolean;
    locations: import("@/features/inventory/types").LocationResponse[];
    createOnly: boolean;
    confirmForItem: (locationId: string) => (payload: StockOperationSubmit) => Promise<void>;
    applyLocationSelection: (selectedIds: string[]) => void;
};
