import { UseControllerProps, UseFormGetValues } from "react-hook-form";
import type { ProductFormValue } from "@/features/products/types";
type VariationTypeRowProps = {
    index: number;
    onRemove: () => void;
    getValues: UseFormGetValues<ProductFormValue>;
};
export declare function VariationTypeField({ index, onRemove, control, getValues }: UseControllerProps<ProductFormValue> & VariationTypeRowProps): import("react").JSX.Element;
export {};
