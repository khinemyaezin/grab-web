import type { HalLinks, HateoasLink } from "../hateoas.js";
import { SellerApiLinks } from "../hateoas/api-links.js";
import { resolveLink } from "../hateoas/link-resolver.js";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { MerchantRoot } from "./types.js";

export async function fetchMerchantRoot(
  api: PlatformApiClient,
  link: HateoasLink,
): Promise<MerchantRoot> {
  const response = await api.followLink<{ _links: HalLinks }>(link, "GET");
  return {
    listMerchants: resolveLink(response?._links, SellerApiLinks.merchant.listMerchants),
    createC2cApplication: resolveLink(
      response?._links,
      SellerApiLinks.merchantApplication.createC2cApplication,
    ),
    getC2cApplication: resolveLink(
      response?._links,
      SellerApiLinks.merchantApplication.getC2cApplication,
    ),
    createRetailerApplication: resolveLink(
      response?._links,
      SellerApiLinks.merchantApplication.createFirstPartyRetailerApplication,
    ),
    getRetailerApplication: resolveLink(
      response?._links,
      SellerApiLinks.merchantApplication.getFirstPartyRetailerApplication,
    ),
    listRegionCountries: resolveLink(response?._links, SellerApiLinks.region.listRegionCountries),
    getMerchant: resolveLink(response?._links, SellerApiLinks.merchant.getMerchant),
    listStorefronts: resolveLink(response?._links, SellerApiLinks.storefront.listStorefronts),
    createStorefront: resolveLink(response?._links, SellerApiLinks.storefront.createStorefront),
    getStorefront: resolveLink(response?._links, SellerApiLinks.storefront.getStorefront),
  };
}
