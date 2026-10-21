import type { ProductLifecycleEvent } from "../types";
import { HateoasLink } from "@khinemyaezin/seller-api";
export type ProductNewFormProps = {
    link: HateoasLink;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
    onCreated?: (productId: string) => void;
};
export default function ProductNewForm(props: ProductNewFormProps): import("react").JSX.Element;
