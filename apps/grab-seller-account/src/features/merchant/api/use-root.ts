import { MerchantRoot } from "@/features/merchant/types";
import { useApi, useEntryLink } from "@khinemyaezin/seller-ui";
import { useQuery } from "@tanstack/react-query";
import { fetchMerchantRoot } from "./discovery";

export function useRoot() {
  const api = useApi();
  const entryLink = useEntryLink();

  return useQuery<MerchantRoot>({
    queryKey: ["merchant-root", entryLink?.href],
    queryFn: () => fetchMerchantRoot(api, entryLink!),
    enabled: !!entryLink,
    staleTime: Infinity,
  });
}

export function useMerchantLink(rel: keyof MerchantRoot) {
  return useRoot().data?.[rel];
}
