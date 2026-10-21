import type { Variant } from "@/features/products/types";
type VariantTableProps = {
    onAllVariantsDeleted?: () => void;
    columns?: VariantColumnExtension[];
};
type VariantColumnExtension = {
    id: string;
    header: React.ReactNode;
    cell: (variant: Variant, index: number) => React.ReactNode;
};
export declare function VariantTable({ onAllVariantsDeleted, columns }: VariantTableProps): false | import("react").JSX.Element;
export {};
