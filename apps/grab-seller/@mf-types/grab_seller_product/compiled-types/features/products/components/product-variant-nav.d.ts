import type { GetFullProductResponse } from "../types";
export type ProductVariantNavProps = {
    variants: GetFullProductResponse["variants"];
    variantTypes?: GetFullProductResponse["variantTypes"];
    currentVariantId: string;
    onSelect?: (variantId: string) => void;
};
export declare function ProductVariantNav({ variants, variantTypes, currentVariantId, onSelect, }: ProductVariantNavProps): import("react").JSX.Element;
export default ProductVariantNav;
