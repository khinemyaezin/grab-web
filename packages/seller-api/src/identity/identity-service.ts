import type { HateoasLink } from "../hateoas.js";
import type {
  IdentityProfile,
  IdentityService,
  PlatformApiClient,
} from "@khinemyaezin/seller-contracts";
import type { IdentityLinks, RawIdentityProfile } from "./types.js";
import { identityLinkDiscovery } from "./link-discovery.js";

export function createIdentityService(
  api: PlatformApiClient,
  entryLink: HateoasLink,
): IdentityService {
  let discoveryPromise: Promise<IdentityLinks> | null = null;

  function ensureDiscovery(): Promise<IdentityLinks> {
    if (!discoveryPromise) {
      discoveryPromise = identityLinkDiscovery.root(api, entryLink).catch((error) => {
        discoveryPromise = null;
        throw error;
      });
    }
    return discoveryPromise;
  }

  return {
    async getProfile(): Promise<IdentityProfile> {
      const root = await ensureDiscovery();
      if (!root.getProfile) {
        throw new Error("Identity root does not expose a 'get-profile' link");
      }
      const res = await api.followLink<RawIdentityProfile>(
        root.getProfile,
        "GET",
        undefined,
        undefined,
        undefined,
        { retryOnUnauthorized: false },
      );
      return {
        id: res.id,
        email: res.email,
        name: res.name || res.email?.split("@")[0] || "",
        avatar: res.avatar || undefined,
        createdAt: res.createdAt,
        roles: res.roles || [],
        permissions: res.permissions || [],
        accessContexts: [...(res.accessContexts || [])],
        currentAccessContext: res.currentAccessContext,
      };
    },

    async logout(): Promise<void> {
      const root = await ensureDiscovery();
      if (!root.logout) {
        throw new Error("Identity root does not expose a 'logout' link");
      }
      await api.followLink<void>(root.logout, "POST", undefined, undefined, undefined, {
        retryOnUnauthorized: false,
      });
    },

    async refreshToken(): Promise<void> {
      const root = await ensureDiscovery();
      if (!root.refreshToken) {
        throw new Error("Identity root does not expose a 'refresh' link");
      }
      await api.followLink<void>(root.refreshToken, "POST", undefined, undefined, undefined, {
        retryOnUnauthorized: false,
      });
    },
  };
}
