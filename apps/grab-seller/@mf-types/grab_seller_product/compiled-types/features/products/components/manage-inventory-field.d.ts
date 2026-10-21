import { type FieldPath, type FieldValues } from "react-hook-form";
type ManageInventoryFieldProps<TFieldValues extends FieldValues> = {
    name: FieldPath<TFieldValues>;
    id?: string;
};
export declare function tracksInventory(value?: boolean | null): boolean;
export declare function ManageInventoryField<TFieldValues extends FieldValues>({ name, id, }: ManageInventoryFieldProps<TFieldValues>): import("react").JSX.Element;
export {};
