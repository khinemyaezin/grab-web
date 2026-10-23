import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { SalesChannelRoot, SalesChannelResponse, SalesChannelsResponse } from "@/features/products/types/sales-channel.response";
type RootResponse = {
    _links?: Record<string, HateoasLink>;
};
export declare function salesChannelsFromCollection(data?: SalesChannelsResponse): SalesChannelResponse[];
export declare const salesChannelService: {
    root: (link: HateoasLink) => Promise<RootResponse>;
    list: (link: HateoasLink) => Promise<SalesChannelsResponse>;
};
export declare function fetchSalesChannelRoot(link: HateoasLink): Promise<SalesChannelRoot>;
export {};
