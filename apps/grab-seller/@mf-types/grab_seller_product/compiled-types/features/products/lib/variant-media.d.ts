import { type MediaGalleryItem } from "@khinemyaezin/seller-ui/components/media-gallery";
import type { ProductMedia } from "@/features/products/types";
export declare function orderVariantMediaIds(mediaIds: string[] | null | undefined, thumbnailMediaId?: string | null): string[];
export declare function toVariantGalleryItems(productMedias: ProductMedia[] | null | undefined, mediaIds: string[] | null | undefined): MediaGalleryItem[];
export declare function isVariantMediaDirty(current: {
    mediaIds?: string[] | null;
    thumbnailMediaId?: string | null;
}, seed: {
    mediaIds?: string[] | null;
    thumbnailMediaId?: string | null;
}): boolean;
