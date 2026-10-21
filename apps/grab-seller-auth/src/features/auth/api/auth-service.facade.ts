import type { HateoasLink } from "@khinemyaezin/seller-api";
import { authService } from "./auth";
import type { IdentityLinks } from "../../shared/types/identity-model";
import { linkDiscoveryService } from "@/features/shared/api/link-discovery";
import { UserProfile } from "../types";

export interface AuthServiceFacade {
  getProfile(): Promise<UserProfile>;
  logout(): Promise<void>;
  refreshToken(): Promise<void>;
}

export function createAuthService(entryLink: HateoasLink): AuthServiceFacade {
  let discoveryPromise: Promise<IdentityLinks> | null = null;

  function ensureDiscovery(): Promise<IdentityLinks> {
    if (!discoveryPromise) {
      discoveryPromise = linkDiscoveryService.root(entryLink).catch((error) => {
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
      return authService.readProfile(root.getProfile).then(res => {
        const user: UserProfile = {
          id: res.id,
          email: res.email,
          name: "",
          avatar: "",
          createdAt: res.createdAt,
          accessContexts: [...res.accessContexts],
          currentAccessContext: res.currentAccessContext
        }
        return user;
      });
    },

    async logout(): Promise<void> {
      const root = await ensureDiscovery();
      if (!root.logout) {
        throw new Error("Identity root does not expose a 'logout' link");
      }
      return authService.logout(root.logout);
    },

    async refreshToken(): Promise<void> {
      const root = await ensureDiscovery();
      if (!root.refreshToken) {
        throw new Error("Identity root does not expose a 'refresh-token' link");
      }
      return authService.refreshToken(root.refreshToken);
    },
  };
}