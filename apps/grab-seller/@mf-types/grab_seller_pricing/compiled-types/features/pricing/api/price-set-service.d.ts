import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { PriceSetResponse, UpdatePriceRequest, VariantPriceSetLinksResponse } from "../types";
import { ListVariantPriceSetLinksRequest } from "../types/pricing.request";
export declare const priceSetService: {
    listVariantPriceLinks: (link: HateoasLink, request: ListVariantPriceSetLinksRequest, headers?: Record<string, string>) => Promise<VariantPriceSetLinksResponse>;
    getPriceSet: (link: HateoasLink, headers?: Record<string, string>) => Promise<PriceSetResponse>;
    updatePrice: (link: HateoasLink, request: UpdatePriceRequest, headers?: Record<string, string>) => Promise<PriceSetResponse>;
};
