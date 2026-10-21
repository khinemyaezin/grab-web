import type { ProductLifecycleEvent, ProductVariantForm } from "../types";
export type ProductVariantEditFormProps = {
    productId: string;
    variantId: string;
    seed: ProductVariantForm;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export default function ProductVariantEditForm({ productId, variantId, seed, onLifecycleEvent, }: ProductVariantEditFormProps): import("react").JSX.Element;
