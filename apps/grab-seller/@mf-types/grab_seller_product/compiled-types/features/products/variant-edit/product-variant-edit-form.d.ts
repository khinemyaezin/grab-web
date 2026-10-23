import type { ProductLifecycleEvent, ProductMedia, ProductVariantForm } from "@/features/products/types";
import type { HateoasLink } from "@khinemyaezin/seller-api";
export type ProductVariantEditFormProps = {
    productId: string;
    variantId: string;
    seed: ProductVariantForm;
    productMedias?: ProductMedia[];
    actions?: Record<string, HateoasLink>;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export default function ProductVariantEditForm({ productId, variantId, seed, productMedias, actions, onLifecycleEvent, }: ProductVariantEditFormProps): import("react").JSX.Element;
