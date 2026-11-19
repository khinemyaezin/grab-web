import type { HateoasLink } from "../hateoas.js";
import type {
  IdentityProfile,
  IdentityService,
  PlatformApiClient,
} from "@khinemyaezin/seller-contracts";
import type { IdentityLinks, RawIdentityProfile } from "./types.js";
import { identityLinkDiscovery } from "./link-discovery.js";
import { isApiError } from "../client.js";

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
      const res = await api.followLink<RawIdentityProfile>(root.getProfile, "GET");
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

    async login(): Promise<void> {
      const root = await ensureDiscovery();
      if (!root.login?.href) {
        throw new Error("Identity root does not expose a 'login' link");
      }
      if (typeof window === "undefined") {
        throw new Error("OIDC login requires a browser window");
      }

      if (typeof window.location.assign === "function") {
        window.location.assign(root.login.href);
      } else {
        window.location.href = root.login.href;
      }
    },

    async logout(): Promise<void> {
      const root = await ensureDiscovery();
      if (!root.logout) {
        throw new Error("Identity root does not expose a 'logout' link");
      }
      if (typeof window === "undefined") {
        throw new Error("OIDC logout requires a browser window");
      }

      let logoutUrl: string | undefined;
      try {
        const res = await api.followLink<{ logoutUrl?: string; url?: string }>(
          root.logout,
          "POST",
        );
        logoutUrl = res?.logoutUrl || res?.url;
      } catch (err: unknown) {
        if (isApiError(err)) {
          if (err.body && typeof err.body === "object") {
            const body = err.body as { logoutUrl?: string; url?: string };
            logoutUrl = body.logoutUrl || body.url;
          }
          if (!logoutUrl && (err.status === 303 || err.status === 302)) {
            logoutUrl = "/";
          }
        }
      }

      if (logoutUrl) {
        if (typeof window.location.assign === "function") {
          window.location.assign(logoutUrl);
        } else {
          window.location.href = logoutUrl;
        }
        return;
      }
      const destination = "/";
      if (typeof window.location.assign === "function") {
        window.location.assign(destination);
      } else {
        window.location.href = destination;
      }
    },
  };
}
