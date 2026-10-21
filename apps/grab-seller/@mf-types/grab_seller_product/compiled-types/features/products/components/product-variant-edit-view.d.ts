import type { ProductLifecycleEvent } from "../types";
export type ProductVariantEditViewProps = {
    productId: string;
    variantId?: string;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export default function ProductVariantEditView({ productId, variantId, onLifecycleEvent, }: ProductVariantEditViewProps): import("react").JSX.Element;
