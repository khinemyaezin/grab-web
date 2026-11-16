import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import { isMediaGalleryDirty, type MediaGalleryItemStatus } from "@khinemyaezin/seller-ui/components/media-gallery";
import type { CreateProductMediaUploadRequest, ProductMediaFormItem, ProductMediaUploadResponse, ReplaceProductMediaRequest } from "@/features/products/types";
export declare const PRODUCT_MEDIA_UPLOAD_ATTEMPTS = 3;
export type ProductMediaItemStatusHandler = (id: string, status: MediaGalleryItemStatus, error?: string) => void;
export type StageProductMediaOptions = {
    api: PlatformApiClient;
    items: ProductMediaFormItem[];
    createUploadLink: HateoasLink;
    onItemStatus?: ProductMediaItemStatusHandler;
    onStaged?: (id: string, storageKey: string) => void;
};
export type AttachProductMediaOptions = {
    api: PlatformApiClient;
    productId: string;
    items: ProductMediaFormItem[];
    seed?: ProductMediaFormItem[];
    replaceMediaLink: HateoasLink;
};
export { isMediaGalleryDirty as isGalleryDirty };
export declare function authorizeStagedUpload(api: PlatformApiClient, link: HateoasLink, metadata: CreateProductMediaUploadRequest): Promise<ProductMediaUploadResponse>;
export declare function toReplaceMediaPayload(items: ProductMediaFormItem[]): ReplaceProductMediaRequest["medias"];
export declare function stageProductMedia({ api, items, createUploadLink, onItemStatus, onStaged, }: StageProductMediaOptions): Promise<Map<string, string>>;
export declare function attachProductMedia({ api, productId, items, seed, replaceMediaLink, }: AttachProductMediaOptions): Promise<void>;
