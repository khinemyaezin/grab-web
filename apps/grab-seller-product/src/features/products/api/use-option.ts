import { catalogService } from ".";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import { GetVariationOptionResult } from "@/features/products/types";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@khinemyaezin/seller-ui";
import { resolveUrlTemplate } from "@khinemyaezin/seller-api";

export function useVariationOptionSearch(
  variantOptionsLink: HateoasLink | undefined,
  name: string,
  type: string,
) {
  const api = useApi();
  const expendLink =
    variantOptionsLink && resolveUrlTemplate({ name: name, typeId: type }, variantOptionsLink);

  return useQuery<GetVariationOptionResult>({
    queryKey: ["option", variantOptionsLink?.href, `${name}-${type}`],
    queryFn: async () => catalogService.getVariationOption(api, expendLink!),
    enabled: !!variantOptionsLink && !!name?.trim(),
    staleTime: 1000 * 60 * 5,
  });
}
