import { HateoasLink } from "@khinemyaezin/seller-api";
import type { ProductLifecycleEvent } from "@/features/products/types";
export type ProductsViewProps = {
    link: HateoasLink;
    canCreate: boolean;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export default function ProductsView({ link, canCreate, onLifecycleEvent }: ProductsViewProps): import("react").JSX.Element;
