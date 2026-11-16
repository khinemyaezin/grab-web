import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type {
  PriceSetResponse,
  UpdatePriceRequest,
  VariantPriceSetLinksResponse,
} from "../types";
import { ListVariantPriceSetLinksRequest } from "../types/pricing.request";

export const priceSetService = {
  listVariantPriceLinks: (api: PlatformApiClient, link: HateoasLink, request: ListVariantPriceSetLinksRequest, headers?: Record<string, string>) =>
    api.followLink<VariantPriceSetLinksResponse>(link, "POST", request, headers),

  getPriceSet: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<PriceSetResponse>(link, "GET", undefined, undefined, headers),

  updatePrice: (
    api: PlatformApiClient,
    link: HateoasLink,
    request: UpdatePriceRequest,
    headers?: Record<string, string>,
  ) => api.followLink<PriceSetResponse>(link, "PUT", request, undefined, headers),
};

