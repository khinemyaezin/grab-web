import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { PriceSetResponse, UpdatePriceRequest, VariantPriceSetLinksResponse } from "../types";
import { ListVariantPriceSetLinksRequest } from "../types/pricing.request";
export declare const priceSetService: {
    listVariantPriceLinks: (api: PlatformApiClient, link: HateoasLink, request: ListVariantPriceSetLinksRequest, headers?: Record<string, string>) => Promise<VariantPriceSetLinksResponse>;
    getPriceSet: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<PriceSetResponse>;
    updatePrice: (api: PlatformApiClient, link: HateoasLink, request: UpdatePriceRequest, headers?: Record<string, string>) => Promise<PriceSetResponse>;
};
