import type { ProductFormValue, UpdateSellableProductPublicationLine } from "@/features/products/types";
export type ProductPublicationDiff = {
    publicationLines: UpdateSellableProductPublicationLine[];
    unpublish: UpdateSellableProductPublicationLine[];
};
export declare function diffProductPublications(seed: ProductFormValue, values: ProductFormValue): ProductPublicationDiff;
