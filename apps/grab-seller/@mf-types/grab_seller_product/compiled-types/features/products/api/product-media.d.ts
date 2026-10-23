import { type HateoasLink } from "@khinemyaezin/seller-api";
import { isMediaGalleryDirty, type MediaGalleryItemStatus } from "@khinemyaezin/seller-ui/components/media-gallery";
import type { CreateProductMediaUploadRequest, ProductMediaFormItem, ProductMediaUploadResponse, ReplaceProductMediaRequest } from "@/features/products/types";
export declare const PRODUCT_MEDIA_UPLOAD_ATTEMPTS = 3;
export type ProductMediaItemStatusHandler = (id: string, status: MediaGalleryItemStatus, error?: string) => void;
export type StageProductMediaOptions = {
    items: ProductMediaFormItem[];
    createUploadLink: HateoasLink;
    onItemStatus?: ProductMediaItemStatusHandler;
    onStaged?: (id: string, storageKey: string) => void;
};
export type AttachProductMediaOptions = {
    productId: string;
    items: ProductMediaFormItem[];
    seed?: ProductMediaFormItem[];
    replaceMediaLink: HateoasLink;
};
export { isMediaGalleryDirty as isGalleryDirty };
export declare function authorizeStagedUpload(link: HateoasLink, metadata: CreateProductMediaUploadRequest): Promise<ProductMediaUploadResponse>;
export declare function toReplaceMediaPayload(items: ProductMediaFormItem[]): ReplaceProductMediaRequest["medias"];
export declare function stageProductMedia({ items, createUploadLink, onItemStatus, onStaged, }: StageProductMediaOptions): Promise<Map<string, string>>;
export declare function attachProductMedia({ productId, items, seed, replaceMediaLink, }: AttachProductMediaOptions): Promise<void>;
