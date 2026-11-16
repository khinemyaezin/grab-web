import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { SalesChannelRoot, SalesChannelResponse, SalesChannelsResponse } from "@/features/products/types/sales-channel.response";
type RootResponse = {
    _links?: Record<string, HateoasLink>;
};
export declare function salesChannelsFromCollection(data?: SalesChannelsResponse): SalesChannelResponse[];
export declare const salesChannelService: {
    root: (api: PlatformApiClient, link: HateoasLink) => Promise<RootResponse>;
    list: (api: PlatformApiClient, link: HateoasLink) => Promise<SalesChannelsResponse>;
};
export declare function fetchSalesChannelRoot(api: PlatformApiClient, link: HateoasLink): Promise<SalesChannelRoot>;
export {};
