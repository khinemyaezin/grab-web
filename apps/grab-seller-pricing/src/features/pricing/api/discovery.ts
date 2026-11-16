import { resolveLink, SellerApiLinks, type HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { PricingRoot, PricingRootResponse } from "../types";

export async function fetchPricingRoot(
  api: PlatformApiClient,
  link: HateoasLink,
): Promise<PricingRoot> {
  const response = await api.followLink<PricingRootResponse>(link);

  return {
    self: resolveLink(response._links, SellerApiLinks.discovery.self),
    createPriceSet: resolveLink(response._links, SellerApiLinks.pricing.createPriceSet),
    calculatePrices: resolveLink(response._links, SellerApiLinks.pricing.calculatePrices),
    listVariantPriceLinks: resolveLink(
      response._links,
      SellerApiLinks.pending.listVariantPriceLinks,
    ),
  };
}
