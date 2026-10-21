import { HateoasLink } from "@khinemyaezin/seller-api";
import { ProductFilterFormValue, ProductLifecycleEvent } from "@/features/products/types";
export type ProductTableProps = {
    link: HateoasLink;
    filter: ProductFilterFormValue;
    onPageChange?: (page: number) => void;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export default function ProductTable({ link, filter, onPageChange, onLifecycleEvent }: ProductTableProps): import("react").JSX.Element;
