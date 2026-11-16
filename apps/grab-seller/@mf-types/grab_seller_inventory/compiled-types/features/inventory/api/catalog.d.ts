import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { ProductVariantSearchResponse, SearchCatalogProductsRequest } from "@/features/inventory/types";
export declare const catalogService: {
    searchProducts: (api: PlatformApiClient, link: HateoasLink, request: SearchCatalogProductsRequest) => Promise<ProductVariantSearchResponse>;
};
