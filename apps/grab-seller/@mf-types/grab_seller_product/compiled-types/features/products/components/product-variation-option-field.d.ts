import type { ProductFormValue } from "@/features/products/types";
import { UseControllerProps, UseFormGetValues } from "react-hook-form";
interface VariationOptionItemProps {
    index: number;
    typeIndex: number;
    getValues: UseFormGetValues<ProductFormValue>;
    onRemove: () => void;
    showTrash: boolean;
    onSelectOption: () => void;
    onClearOption?: () => void;
}
export declare function VariationOptionField({ typeIndex, index, onRemove, getValues, showTrash, onSelectOption, onClearOption }: UseControllerProps<ProductFormValue> & VariationOptionItemProps): import("react").JSX.Element;
export {};
