import { ProductFormValue, ProductLifecycleEvent } from "../types";
import { HateoasLink } from "@khinemyaezin/seller-api";
export type ProductEditFormProps = {
    productId: string;
    seed: ProductFormValue;
    status?: string;
    actions?: Record<string, HateoasLink>;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export default function ProductEditForm({ productId, seed, status, actions, onLifecycleEvent, }: ProductEditFormProps): import("react").JSX.Element;
