import { api, type HateoasLink } from "@khinemyaezin/seller-api";
import type {
  PriceSetResponse,
  UpdatePriceRequest,
  VariantPriceSetLinksResponse,
} from "../types";
import { ListVariantPriceSetLinksRequest } from "../types/pricing.request";

export const priceSetService = {
  listVariantPriceLinks: (link: HateoasLink, request: ListVariantPriceSetLinksRequest, headers?: Record<string, string>) =>
    api.followLink<VariantPriceSetLinksResponse>(link, "POST", request, headers),

  getPriceSet: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<PriceSetResponse>(link, "GET", undefined, undefined, headers),

  updatePrice: (
    link: HateoasLink,
    request: UpdatePriceRequest,
    headers?: Record<string, string>,
  ) => api.followLink<PriceSetResponse>(link, "PUT", request, undefined, headers),
};

