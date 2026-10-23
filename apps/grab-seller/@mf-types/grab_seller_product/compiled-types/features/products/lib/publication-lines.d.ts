import type { UpdateSellableProductPublicationLine, Variant, VariationType } from "@/features/products/types";
export declare function matrixPublicationSkus(variants: Variant[] | undefined): string[];
export declare function publicationTargetSkus(values: {
    variationTypes?: VariationType[] | null;
    product: {
        standaloneVariant?: {
            sku?: string;
        };
        variants?: Variant[];
    };
}): string[];
export declare function unionChannelIds(lines: UpdateSellableProductPublicationLine[] | undefined, skus: string[]): string[];
export declare function channelPublishedOnAllSkus(lines: UpdateSellableProductPublicationLine[] | undefined, skus: string[], channelId: string): boolean;
export declare function togglePublicationChannelForSkus(lines: UpdateSellableProductPublicationLine[] | undefined, skus: string[], channelId: string, currentlyPublished: boolean): UpdateSellableProductPublicationLine[];
export declare function syncPublicationLinesForMatrixVariants(lines: UpdateSellableProductPublicationLine[] | undefined, standaloneSku: string, matrixSkus: string[]): UpdateSellableProductPublicationLine[];
export declare function collapsePublicationLinesToStandalone(lines: UpdateSellableProductPublicationLine[] | undefined, standaloneSku: string): UpdateSellableProductPublicationLine[];
