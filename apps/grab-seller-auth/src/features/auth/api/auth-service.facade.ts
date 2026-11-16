import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import { authService } from "./auth";
import type { IdentityLinks } from "../../shared/types/identity-model";
import { linkDiscoveryService } from "@/features/shared/api/link-discovery";
import { UserProfile } from "../types";

/**
 * @deprecated Use createIdentityService from @khinemyaezin/seller-api and IdentityService from @khinemyaezin/seller-contracts.
 */
export interface AuthServiceFacade {
  getProfile(): Promise<UserProfile>;
  logout(): Promise<void>;
  refreshToken(): Promise<void>;
}

/**
 * @deprecated Use createIdentityService from @khinemyaezin/seller-api directly.
 */
export function createAuthService(
  api: PlatformApiClient,
  entryLink: HateoasLink,
): AuthServiceFacade {
  let discoveryPromise: Promise<IdentityLinks> | null = null;

  function ensureDiscovery(): Promise<IdentityLinks> {
    if (!discoveryPromise) {
      discoveryPromise = linkDiscoveryService.root(api, entryLink).catch((error) => {
        discoveryPromise = null;
        throw error;
      });
    }
    return discoveryPromise;
  }

  return {
    async getProfile(): Promise<UserProfile> {
      const root = await ensureDiscovery();
      if (!root.getProfile) {
        throw new Error("Identity root does not expose a 'get-profile' link");
      }
      return authService.readProfile(api, root.getProfile).then((res) => {
        const user: UserProfile = {
          id: res.id,
          email: res.email,
          name: "",
          avatar: "",
          createdAt: res.createdAt,
          accessContexts: [...res.accessContexts],
          currentAccessContext: res.currentAccessContext,
        };
        return user;
      });
    },

    async logout(): Promise<void> {
      const root = await ensureDiscovery();
      if (!root.logout) {
        throw new Error("Identity root does not expose a 'logout' link");
      }
      return authService.logout(api, root.logout);
    },

    async refreshToken(): Promise<void> {
      const root = await ensureDiscovery();
      if (!root.refreshToken) {
        throw new Error("Identity root does not expose a 'refresh' link");
      }
      return authService.refreshToken(api, root.refreshToken);
    },
  };
}
