import type { ProductSearchCriteria } from "@/features/products/hooks/use-product-filter";
export type ProductsFilterProps = {
    onChange: (criteria: ProductSearchCriteria) => void;
};
export default function ProductsFilter({ onChange }: ProductsFilterProps): import("react").JSX.Element;
