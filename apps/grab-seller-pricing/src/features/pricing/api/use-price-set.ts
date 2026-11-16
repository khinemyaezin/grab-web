import { useQuery } from "@tanstack/react-query";
import { useApi } from "@khinemyaezin/seller-ui";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import { priceSetService } from "./price-set-service";

export function useVariantPriceLinkGet(link?: HateoasLink, variantId?: string) {
  const api = useApi();
  return useQuery({
    queryKey: ["variant-price-links", variantId, link?.href],
    queryFn: async () => {
      const response = await priceSetService.listVariantPriceLinks(api, link!, {
        variantIds: [variantId!],
      });
      return (
        response?._embedded?.variantPriceSetLinkResponseList?.find(
          (item) => item.variantId === variantId,
        ) ?? null
      );
    },
    enabled: !!link && !!variantId,
    staleTime: 1000 * 60,
  });
}

export function usePriceSetLinkGet(getPriceSetLink?: HateoasLink) {
  const api = useApi();
  return useQuery({
    queryKey: ["price-set", getPriceSetLink?.href],
    queryFn: () => priceSetService.getPriceSet(api, getPriceSetLink!),
    enabled: !!getPriceSetLink,
    staleTime: 1000 * 60,
  });
}
