import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
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
    api: PlatformApiClient;
    link?: HateoasLink;
    mediaIds: string[];
    thumbnailMediaId?: string | null;
    seedMediaIds?: string[];
    seedThumbnailMediaId?: string | null;
};
export declare function attachVariantMedia({ api, link, mediaIds, thumbnailMediaId, seedMediaIds, seedThumbnailMediaId, }: AttachVariantMediaOptions): Promise<VariantMediaSyncResult>;
