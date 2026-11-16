import {
  DEFAULT_MEDIA_UPLOAD_ATTEMPTS,
  resolveUrlTemplate,
  stageMediaDrafts,
  type HateoasLink,
} from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import {
  formatMediaReplacements,
  isMediaGalleryDirty,
  type MediaGalleryItemStatus,
} from "@khinemyaezin/seller-ui/components/media-gallery";
import { catalogService } from "./catalog";
import { putPresignedObject } from "./storage";
import type {
  CreateProductMediaUploadRequest,
  ProductMediaFormItem,
  ProductMediaUploadResponse,
  ReplaceProductMediaRequest,
} from "@/features/products/types";

export const PRODUCT_MEDIA_UPLOAD_ATTEMPTS = DEFAULT_MEDIA_UPLOAD_ATTEMPTS;

export type ProductMediaItemStatusHandler = (
  id: string,
  status: MediaGalleryItemStatus,
  error?: string,
) => void;

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

export function authorizeStagedUpload(
  api: PlatformApiClient,
  link: HateoasLink,
  metadata: CreateProductMediaUploadRequest,
): Promise<ProductMediaUploadResponse> {
  return catalogService.createProductMediaUpload(api, link, metadata);
}

export function toReplaceMediaPayload(items: ProductMediaFormItem[]): ReplaceProductMediaRequest["medias"] {
  return formatMediaReplacements(items);
}

function replacePayload(items: ProductMediaFormItem[]): ReplaceProductMediaRequest["medias"] {
  return toReplaceMediaPayload(items);
}

export async function stageProductMedia({
  api,
  items,
  createUploadLink,
  onItemStatus,
  onStaged,
}: StageProductMediaOptions): Promise<Map<string, string>> {
  return stageMediaDrafts({
    items,
    authorizer: (metadata) => authorizeStagedUpload(api, createUploadLink, metadata),
    uploader: putPresignedObject,
    maxAttempts: PRODUCT_MEDIA_UPLOAD_ATTEMPTS,
    onItemStatus,
    onStaged,
  });
}

export async function attachProductMedia({
  api,
  productId,
  items,
  seed = [],
  replaceMediaLink,
}: AttachProductMediaOptions): Promise<void> {
  if (!isMediaGalleryDirty(items, seed)) return;

  await catalogService.replaceProductMedia(
    api,
    resolveUrlTemplate({ productId }, replaceMediaLink),
    { medias: replacePayload(items) },
  );
}
