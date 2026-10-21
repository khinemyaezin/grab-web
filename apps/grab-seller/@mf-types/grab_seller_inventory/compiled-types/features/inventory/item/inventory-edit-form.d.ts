import type { InventoryEditOp, InventoryEditPayload } from "@khinemyaezin/seller-contracts";
import type { InventoryItemEditForm, InventoryItemEditRow } from "@/features/inventory/types/inventory.form";
import type { InventoryItemResponse, LocationResponse } from "@/features/inventory/types";
export declare const EMPTY_INVENTORY_ITEMS: InventoryItemResponse[];
export declare const EMPTY_LOCATIONS: LocationResponse[];
export declare function createRow(location: LocationResponse, prev?: InventoryItemEditRow, commit?: boolean): Extract<InventoryItemEditRow, {
    op: "CREATE";
}>;
export declare function adjustRow(location: LocationResponse, inventory: InventoryItemResponse, prev?: InventoryItemEditRow): Extract<InventoryItemEditRow, {
    op: "ADJUST";
}>;
export declare function opsByLocationId(ops: InventoryEditOp[] | undefined, items: InventoryItemResponse[]): Map<string, InventoryEditOp>;
export declare function toEditPayload(form: InventoryItemEditForm | undefined, sku?: string, variantId?: string): InventoryEditPayload;
export declare function seedEditForm(args: {
    sku?: string;
    variantId?: string;
    locations: LocationResponse[];
    items: InventoryItemResponse[];
    payload?: InventoryEditPayload;
}): InventoryItemEditForm;
export declare function reconcileEditForm(args: {
    prev: InventoryItemEditForm;
    sku?: string;
    variantId?: string;
    locations: LocationResponse[];
    items: InventoryItemResponse[];
}): InventoryItemEditForm;
export declare function rowsFromSelection(args: {
    selectedIds: string[];
    locations: LocationResponse[];
    items: InventoryItemResponse[];
    prev?: InventoryItemEditForm;
}): InventoryItemEditRow[];
