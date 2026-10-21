import { useQuery } from "@tanstack/react-query";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import { priceSetService } from "./price-set-service";

export function useVariantPriceLinkGet(link?: HateoasLink, variantId?: string) {
  return useQuery({
    queryKey: ["variant-price-links", variantId, link?.href],
    queryFn: async () => {
      const response = await priceSetService.listVariantPriceLinks(link!, {
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
  return useQuery({
    queryKey: ["price-set", getPriceSetLink?.href],
    queryFn: () => priceSetService.getPriceSet(getPriceSetLink!),
    enabled: !!getPriceSetLink,
    staleTime: 1000 * 60,
  });
}
