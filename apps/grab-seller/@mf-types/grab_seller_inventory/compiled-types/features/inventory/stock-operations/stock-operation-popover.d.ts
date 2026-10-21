import { type ReactNode } from "react";
import type { LocationValues, StockOperationSubmit } from "./types";
import type { AdjustStockFormValues, CreateInventoryItemValues } from "@/features/inventory/types";
type AdjustPopoverProps = {
    op: "ADJUST";
    value?: AdjustStockFormValues;
};
type CreatePopoverProps = {
    op: "CREATE";
    value?: CreateInventoryItemValues;
    location: LocationValues;
};
export type StockOperationPopoverProps = {
    trigger: ReactNode;
    onConfirm: (payload: StockOperationSubmit) => Promise<void>;
} & (AdjustPopoverProps | CreatePopoverProps);
export default function StockOperationPopover(props: StockOperationPopoverProps): import("react").JSX.Element;
export {};
