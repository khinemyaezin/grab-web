import { useQuery } from "@tanstack/react-query";
import { useApi } from "@khinemyaezin/seller-ui";
import { catalogService } from ".";
import type { ProductVariantSearchResponse, SearchCatalogProductsRequest } from "@/types";
import { useInventoryLink } from "./use-root";

const CATALOG_STALE_TIME = 5 * 60 * 1000;

export function useProductSearch(filters?: SearchCatalogProductsRequest) {
  const api = useApi();
  const productSearchLink = useInventoryLink("searchProductVariants");

  return useQuery<ProductVariantSearchResponse>({
    queryKey: ["products", "search", productSearchLink?.href, filters],
    queryFn: async () => catalogService.searchProducts(api, productSearchLink!, filters!),
    enabled: !!productSearchLink && !!filters,
    placeholderData: (previousData) => previousData,
    staleTime: CATALOG_STALE_TIME,
  });
}
