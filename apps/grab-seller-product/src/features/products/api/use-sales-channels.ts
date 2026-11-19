import { useQuery } from "@tanstack/react-query";
import { useApi } from "@khinemyaezin/seller-ui";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import {
  fetchSalesChannelRoot,
  salesChannelService,
  salesChannelsFromCollection,
} from "./sales-channel";
import type { SalesChannelResponse } from "@/features/products/types/sales-channel.response";

export function useSalesChannels(entryLink?: HateoasLink | null) {
  const api = useApi();
  return useQuery<SalesChannelResponse[]>({
    queryKey: ["sales-channels", entryLink?.href],
    queryFn: async () => {
      const root = await fetchSalesChannelRoot(api, entryLink!);
      if (!root.listSalesChannels) {
        return [];
      }
      const collection = await salesChannelService.list(api, root.listSalesChannels);
      return salesChannelsFromCollection(collection);
    },
    enabled: !!entryLink,
    staleTime: 5 * 60 * 1000,
  });
}
