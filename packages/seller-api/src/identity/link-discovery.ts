import type { HalLinks, HateoasLink } from "../hateoas.js";
import { SellerApiLinks } from "../hateoas/api-links.js";
import { resolveLink } from "../hateoas/link-resolver.js";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { IdentityLinks } from "./types.js";

export const convertToIdentityLinks = (resp: { _links: HalLinks }): IdentityLinks => {
  return {
    self: resolveLink(resp._links, SellerApiLinks.discovery.self),
    getProfile: resolveLink(resp._links, SellerApiLinks.session.getProfile),
    login: resolveLink(resp._links, SellerApiLinks.auth.login),
    register: resolveLink(resp._links, SellerApiLinks.auth.register),
    logout: resolveLink(resp._links, SellerApiLinks.auth.logout),
    csrfToken: resolveLink(resp._links, SellerApiLinks.auth.csrf),
    listAccessContext: resolveLink(resp._links, SellerApiLinks.session.listAccessContexts),
  };
};

export const identityLinkDiscovery = {
  root: async (api: PlatformApiClient, link: HateoasLink): Promise<IdentityLinks> => {
    return api.followLink<{ _links: HalLinks }>(link, "GET").then(convertToIdentityLinks);
  },
};
