import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import { UserProfile } from "../types";
export interface AuthServiceFacade {
    getProfile(): Promise<UserProfile>;
    logout(): Promise<void>;
    refreshToken(): Promise<void>;
}
export declare function createAuthService(api: PlatformApiClient, entryLink: HateoasLink): AuthServiceFacade;
