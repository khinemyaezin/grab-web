import type { HateoasLink } from "@khinemyaezin/seller-api";
export type VariantMediaSyncResult = {
    status: "skipped";
} | {
    status: "synced";
} | {
    status: "failed";
    error: Error;
};
export type AttachVariantMediaOptions = {
    link?: HateoasLink;
    mediaIds: string[];
    thumbnailMediaId?: string | null;
    seedMediaIds?: string[];
    seedThumbnailMediaId?: string | null;
};
export declare function attachVariantMedia({ link, mediaIds, thumbnailMediaId, seedMediaIds, seedThumbnailMediaId, }: AttachVariantMediaOptions): Promise<VariantMediaSyncResult>;
