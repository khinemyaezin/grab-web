import { IdentityLinks } from "@/features/shared/types/identity-model";
import { api, HalLinks, HateoasLink, resolveLink } from "@khinemyaezin/seller-api";

const convertToModel = (resp: { _links: HalLinks }): IdentityLinks => {
    return {
        self: resolveLink(resp._links, "self"),
        getProfile: resolveLink(resp._links, "get-profile"),
        login: resolveLink(resp._links, "login"),
        register: resolveLink(resp._links, "register"),
        logout: resolveLink(resp._links, "logout"),
        refreshToken: resolveLink(resp._links, "refresh-token"),
        listAccessContext: resolveLink(resp._links, "list-access-contexts")
    }
};

const linkDiscoveryService = {
    root: async (link: HateoasLink): Promise<IdentityLinks> => {
        return api.followLink<{ _links: HalLinks }>(link, "GET", undefined, undefined, undefined, { retryOnUnauthorized: false })
            .then(convertToModel)
    }
}

export { linkDiscoveryService }