import type { ProductLifecycleEvent } from "@/features/products/types";
import { HateoasLink } from "@khinemyaezin/seller-api";
export type ProductNewFormProps = {
    link: HateoasLink;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export default function ProductNewForm(props: ProductNewFormProps): import("react").JSX.Element;
