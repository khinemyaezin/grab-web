import { Ref } from "react";
import { AdjustStockFormValues } from "@/features/inventory/types";
import type { StockOperationFormHandle } from "./types";
export type AdjustStockFormProps = {
    value?: AdjustStockFormValues;
    ref: Ref<StockOperationFormHandle>;
};
export default function AdjustStockForm({ value, ref }: AdjustStockFormProps): import("react").JSX.Element;
