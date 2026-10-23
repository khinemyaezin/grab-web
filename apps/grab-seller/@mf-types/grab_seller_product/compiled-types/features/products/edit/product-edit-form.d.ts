import { ProductFormValue, ProductLifecycleEvent } from "@/features/products/types";
import { HateoasLink } from "@khinemyaezin/seller-api";
export type ProductEditFormProps = {
    productId: string;
    seed: ProductFormValue;
    actions?: Record<string, HateoasLink>;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export default function ProductEditForm({ productId, seed, actions, onLifecycleEvent, }: ProductEditFormProps): import("react").JSX.Element;
