import type { AdjustStockFormValues, CreateInventoryItemValues } from "@/features/inventory/types";
export type StockOperationOp = "CREATE" | "ADJUST";
export type LocationValues = {
    locationId: string;
    locationName: string;
};
export type StockOperationSubmit = {
    op: "CREATE";
    value: CreateInventoryItemValues;
} | {
    op: "ADJUST";
    value: AdjustStockFormValues;
};
export type StockOperationFormHandle = {
    submit: () => Promise<StockOperationSubmit | null>;
};
export declare function formatEnumLabel(value: string): string;
