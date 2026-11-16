import { useQuery } from "@tanstack/react-query";
import { useEntryLink, useApi } from "@khinemyaezin/seller-ui";
import { fetchPricingRoot } from "./discovery";
import type { PricingRoot } from "../types";

export function usePricingRoot() {
  const api = useApi();
  const entryLink = useEntryLink();

  return useQuery<PricingRoot>({
    queryKey: ["pricing-root", entryLink?.href],
    queryFn: () => fetchPricingRoot(api, entryLink!),
    enabled: !!entryLink,
    staleTime: Infinity,
  });
}

export function usePricingLink(rel: keyof PricingRoot) {
  return usePricingRoot().data?.[rel];
}
