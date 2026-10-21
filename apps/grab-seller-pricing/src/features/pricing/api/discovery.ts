import { api, resolveLink, type HateoasLink } from "@khinemyaezin/seller-api";
import type { PricingRoot, PricingRootResponse } from "../types";

export async function fetchPricingRoot(link: HateoasLink): Promise<PricingRoot> {
  const response = await api.followLink<PricingRootResponse>(link);

  return {
    self: resolveLink(response._links, "self"),
    createPriceSet: resolveLink(response._links, "create-price-set"),
    calculatePrices: resolveLink(response._links, "calculate-prices"),
    listVariantPriceLinks: resolveLink(response._links, "list-variant-price-links"),
  };
}
