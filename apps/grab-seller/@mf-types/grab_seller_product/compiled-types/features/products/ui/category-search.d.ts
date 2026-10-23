import { Category } from "@/features/products/types";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { ComponentPropsWithoutRef } from 'react';
export type CategoryPickerProps = {
    onChange: (category: Category) => void;
    value: string;
};
export default function CategorySearch({ value, onChange, ...inputProps }: ComponentPropsWithoutRef<typeof Input> & CategoryPickerProps): import("react").JSX.Element;
