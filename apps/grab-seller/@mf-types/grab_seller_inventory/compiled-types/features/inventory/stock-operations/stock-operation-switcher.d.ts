import { Ref } from "react";
import { LocationValues, type StockOperationFormHandle } from "./types";
import { AdjustStockFormValues, CreateInventoryItemValues } from "@/types";
type AdjustProps = {
    op: "ADJUST";
    formRef: Ref<StockOperationFormHandle>;
    value?: AdjustStockFormValues;
};
type CreateProps = {
    op: "CREATE";
    formRef: Ref<StockOperationFormHandle>;
    value?: CreateInventoryItemValues;
    location: LocationValues;
};
export type StockOperationSwitcherProps = AdjustProps | CreateProps;
export default function StockOperationSwitcher(props: StockOperationSwitcherProps): import("react").JSX.Element;
export {};
