import { IdentityLinks } from "@/features/shared/types/identity-model";
import { api, HalLinks, HateoasLink, resolveLink, SellerApiLinks } from "@khinemyaezin/seller-api";

const convertToModel = (resp: { _links: HalLinks }): IdentityLinks => {
    return {
        self: resolveLink(resp._links, SellerApiLinks.discovery.self),
        getProfile: resolveLink(resp._links, SellerApiLinks.session.getProfile),
        login: resolveLink(resp._links, SellerApiLinks.auth.login),
        register: resolveLink(resp._links, SellerApiLinks.auth.register),
        logout: resolveLink(resp._links, SellerApiLinks.auth.logout),
        refreshToken: resolveLink(resp._links, SellerApiLinks.auth.refresh),
        listAccessContext: resolveLink(resp._links, SellerApiLinks.session.listAccessContexts)
    }
};

const linkDiscoveryService = {
    root: async (link: HateoasLink): Promise<IdentityLinks> => {
        return api.followLink<{ _links: HalLinks }>(link, "GET", undefined, undefined, undefined, { retryOnUnauthorized: false })
            .then(convertToModel)
    }
}

export { linkDiscoveryService }
