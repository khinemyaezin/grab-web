import { MerchantRoot } from "@/features/merchant/types";
import { api, HalLinks, HateoasLink, resolveLink, SellerApiLinks } from "@khinemyaezin/seller-api";

export async function fetchMerchantRoot(link: HateoasLink): Promise<MerchantRoot> {
    const response = await api.followLink<{ _links: HalLinks }>(link, "GET");
    return {
        listMerchants: resolveLink(response?._links, SellerApiLinks.merchant.listMerchants),
        createC2cApplication: resolveLink(response?._links, SellerApiLinks.merchantApplication.createC2cApplication),
        getC2cApplication: resolveLink(response?._links, SellerApiLinks.merchantApplication.getC2cApplication),
        createRetailerApplication: resolveLink(response?._links, SellerApiLinks.merchantApplication.createFirstPartyRetailerApplication),
        getRetailerApplication: resolveLink(response?._links, SellerApiLinks.merchantApplication.getFirstPartyRetailerApplication),
        listRegionCountries: resolveLink(response?._links, SellerApiLinks.region.listRegionCountries),
        getMerchant: resolveLink(response?._links, SellerApiLinks.merchant.getMerchant),
        listStorefronts: resolveLink(response?._links, SellerApiLinks.storefront.listStorefronts),
        createStorefront: resolveLink(response?._links, SellerApiLinks.storefront.createStorefront),
        getStorefront: resolveLink(response?._links, SellerApiLinks.storefront.getStorefront),
    };
}
