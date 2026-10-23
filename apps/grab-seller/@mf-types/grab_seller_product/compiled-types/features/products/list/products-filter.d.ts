import type { ProductSearchCriteria } from "./use-product-filter";
export type ProductsFilterProps = {
    onChange: (criteria: ProductSearchCriteria) => void;
};
export default function ProductsFilter({ onChange }: ProductsFilterProps): import("react").JSX.Element;
