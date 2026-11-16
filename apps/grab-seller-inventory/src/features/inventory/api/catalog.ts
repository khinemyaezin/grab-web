import { toPageParams, type HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type {
  ProductVariantSearchResponse,
  SearchCatalogProductsRequest,
} from "@/features/inventory/types";

export const catalogService = {
  searchProducts: (api: PlatformApiClient, link: HateoasLink, request: SearchCatalogProductsRequest) => {
    const { page, size, ...body } = request;
    return api.followLink<ProductVariantSearchResponse>(
      link,
      "POST",
      body,
      toPageParams({page,size}),
    );
  }
};