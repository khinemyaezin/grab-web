import { MerchantRoot } from "@/features/merchant/types";
import { api, HalLinks, HateoasLink, resolveLink } from "@khinemyaezin/seller-api";

export async function fetchMerchantRoot(link: HateoasLink): Promise<MerchantRoot> {
    const response = await api.followLink<{ _links: HalLinks }>(link, "GET");
    return {
        listMerchants: resolveLink(response?._links, "list-merchants"),
        createC2cApplication: resolveLink(response?._links, "create-c2c-application"),
        getC2cApplication: resolveLink(response?._links, "get-c2c-application"),
        createRetailerApplication: resolveLink(response?._links, "create-first-party-retailer-application"),
        getRetailerApplication: resolveLink(response?._links, "get-first-party-retailer-application"),
        getCurrentMerchant: resolveLink(response?._links, "get-current-merchant"),
        listStorefronts: resolveLink(response?._links, "list-storefronts"),
        createStorefront: resolveLink(response?._links, "create-storefront"),
        getStorefront: resolveLink(response?._links, "get-storefront"),
    };
}
