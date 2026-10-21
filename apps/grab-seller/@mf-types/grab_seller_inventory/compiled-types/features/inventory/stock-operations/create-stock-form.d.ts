import { Ref } from "react";
import type { CreateInventoryItemValues } from "@/features/inventory/types";
import type { LocationValues, StockOperationFormHandle } from "./types";
export type CreateStockFormProps = {
    value?: CreateInventoryItemValues;
    locations: LocationValues;
    ref: Ref<StockOperationFormHandle>;
};
export default function CreateStockForm({ value, locations, ref, }: CreateStockFormProps): import("react").JSX.Element;
