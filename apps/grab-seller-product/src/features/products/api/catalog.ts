import type {
  CategoryLeavesResult,
  CreateProductMediaUploadRequest,
  CreateProductRequest,
  CreateSellableProductRequest,
  CreateSellableProductResponse,
  GetFullProductResponse,
  GetVariantResponse,
  GetVariationOptionResult,
  GetVariationTypeResult,
  UpdateProductRequest,
  UpdateProductResponse,
  UpdateSellableProductRequest,
  UpdateSellableProductResponse,
  UpdateProductVariantRequest,
  UpdateProductVariantResponse,
  VariationMatrixRequest,
  VariationMatrixResponse,
  DeleteProductResponse,
  ProductMediaUploadResponse,
  ProductModerationResponse,
  ProductSearchRequest,
  ProductSearchResponse,
  ReplaceProductMediaRequest,
  ReplaceProductMediaResponse,
  ReplaceProductDescriptionsRequest,
  ReplaceProductDescriptionsResponse,
  BatchVariantImagesRequest,
  BatchVariantImagesResponse,
  UnpublishProductFromChannelRequest,
  ProductPublicationResponse,
} from "@/features/products/types";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { HateoasLink } from "@khinemyaezin/seller-api";

export const catalogService = {
  createVariationMatrix: (api: PlatformApiClient, link: HateoasLink, request: VariationMatrixRequest, headers?: Record<string, string>) =>
    api.followLink<VariationMatrixResponse>(link, "POST", request, undefined, headers),

  getCategories: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<CategoryLeavesResult>(link, "GET", undefined, undefined, headers),

  createProduct: (api: PlatformApiClient, link: HateoasLink, request: CreateProductRequest, headers?: Record<string, string>) =>
    api.followLink<void>(link, "POST", request, undefined, headers),

  getVariationType: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<GetVariationTypeResult>(link, "GET", undefined, undefined, headers),

  getVariationOption: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<GetVariationOptionResult>(link, "GET", undefined, undefined, headers),

  searchProducts: (api: PlatformApiClient, link: HateoasLink, request: ProductSearchRequest, headers?: Record<string, string>) => {
    const { page, size, ...body } = request;
    const params = { page: String(page), size: String(size) };
    return api.followLink<ProductSearchResponse>(link, "POST", body, params, headers);
  },

  getFullProduct: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<GetFullProductResponse>(link, "GET", undefined, undefined, headers),

  getVariant: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<GetVariantResponse>(link, "GET", undefined, undefined, headers),

  updateProduct: (api: PlatformApiClient, link: HateoasLink, request: UpdateProductRequest, headers?: Record<string, string>) =>
    api.followLink<UpdateProductResponse>(link, "PUT", request, undefined, headers),

  deleteProduct: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<DeleteProductResponse>(link, "DELETE", undefined, undefined, headers),

  restoreProduct: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<ProductModerationResponse>(link, "POST", undefined, undefined, headers),

  publishProduct: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<ProductModerationResponse>(link, "POST", undefined, undefined, headers),

  suspendProduct: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<ProductModerationResponse>(link, "POST", undefined, undefined, headers),

  getCreateSellableProduct: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<CreateSellableProductResponse>(link, "GET", undefined, undefined, headers),

  createProductMediaUpload: (
    api: PlatformApiClient,
    link: HateoasLink,
    request: CreateProductMediaUploadRequest,
    headers?: Record<string, string>,
  ) =>
    api.followLink<ProductMediaUploadResponse>(link, "POST", request, undefined, headers),

  replaceProductMedia: (
    api: PlatformApiClient,
    link: HateoasLink,
    request: ReplaceProductMediaRequest,
    headers?: Record<string, string>,
  ) =>
    api.followLink<ReplaceProductMediaResponse>(link, "PUT", request, undefined, headers),

  replaceProductDescriptions: (
    api: PlatformApiClient,
    link: HateoasLink,
    request: ReplaceProductDescriptionsRequest,
    headers?: Record<string, string>,
  ) =>
    api.followLink<ReplaceProductDescriptionsResponse>(link, "PUT", request, undefined, headers),

  createSellableProduct: (
    api: PlatformApiClient,
    link: HateoasLink,
    request: CreateSellableProductRequest,
    headers?: Record<string, string>,
  ) =>
    api.followLink<CreateSellableProductResponse>(link, "POST", request, undefined, headers),

  updateSellableProduct: (
    api: PlatformApiClient,
    link: HateoasLink,
    request: UpdateSellableProductRequest,
    headers?: Record<string, string>,
  ) =>
    api.followLink<UpdateSellableProductResponse>(link, "POST", request, undefined, headers),

  updateProductVariant: (
    api: PlatformApiClient,
    link: HateoasLink,
    request: UpdateProductVariantRequest,
    headers?: Record<string, string>,
  ) =>
    api.followLink<UpdateProductVariantResponse>(link, "POST", request, undefined, headers),

  deleteProductVariant: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<void>(link, "DELETE", undefined, undefined, headers),

  restoreProductVariant: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<void>(link, "POST", undefined, undefined, headers),

  unpublishProductFromChannel: (
    api: PlatformApiClient,
    link: HateoasLink,
    request: UnpublishProductFromChannelRequest,
    headers?: Record<string, string>,
  ) =>
    api.followLink<ProductPublicationResponse>(link, "POST", request, undefined, headers),

  setVariantMedia: (
    api: PlatformApiClient,
    link: HateoasLink,
    request: BatchVariantImagesRequest,
    headers?: Record<string, string>,
  ) =>
    api.followLink<BatchVariantImagesResponse>(link, "POST", request, undefined, headers),
};
