import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { ProductVariantSearchResponse, SearchCatalogProductsRequest } from "@/features/inventory/types";
export declare const catalogService: {
    searchProducts: (link: HateoasLink, request: SearchCatalogProductsRequest) => Promise<ProductVariantSearchResponse>;
};
