import type { ProductVariantSearchResponse, SearchCatalogProductsRequest } from "@/types";
export declare function useProductSearch(filters?: SearchCatalogProductsRequest): import("@tanstack/react-query").UseQueryResult<ProductVariantSearchResponse, Error>;
