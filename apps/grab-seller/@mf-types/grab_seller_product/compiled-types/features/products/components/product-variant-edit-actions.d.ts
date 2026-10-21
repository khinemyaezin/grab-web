import { HateoasLink } from "@khinemyaezin/seller-api";
import { ProductLifecycleEvent } from "../types";
export type ProductVariantActionsMenuProps = {
    productId: string;
    links?: Record<string, HateoasLink>;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export default function ProductVariantActionsMenu({ productId, links, onLifecycleEvent, }: ProductVariantActionsMenuProps): import("react").JSX.Element | null;
export { ProductVariantActionsMenu as ProductVariantEditActions };
export type { ProductVariantActionsMenuProps as ProductVariantEditActionsProps };
