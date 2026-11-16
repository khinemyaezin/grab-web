import { resolveLink, SellerApiLinks, type HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type {
  SalesChannelRoot,
  SalesChannelResponse,
  SalesChannelsResponse,
} from "@/features/inventory/types/sales-channel.response";

type RootResponse = { _links?: Record<string, HateoasLink> };

export function salesChannelsFromCollection(data?: SalesChannelsResponse): SalesChannelResponse[] {
  return data?._embedded?.salesChannelResponseList
    ?? data?._embedded?.salesChannelResponses
    ?? [];
}

export const salesChannelService = {
  root: (api: PlatformApiClient, link: HateoasLink) => api.followLink<RootResponse>(link, "GET"),
  list: (api: PlatformApiClient, link: HateoasLink) => api.followLink<SalesChannelsResponse>(link, "GET"),
};

export async function fetchSalesChannelRoot(api: PlatformApiClient, link: HateoasLink): Promise<SalesChannelRoot> {
  const response = await salesChannelService.root(api, link);
  return {
    self: resolveLink(response._links, SellerApiLinks.discovery.self),
    listSalesChannels: resolveLink(response._links, SellerApiLinks.salesChannel.listSalesChannels),
    getSalesChannel: resolveLink(response._links, SellerApiLinks.salesChannel.getSalesChannel),
  };
}
