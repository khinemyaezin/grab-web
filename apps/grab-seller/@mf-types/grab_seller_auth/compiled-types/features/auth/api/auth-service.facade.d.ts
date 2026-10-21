import type { HateoasLink } from "@khinemyaezin/seller-api";
import { UserProfile } from "../types";
export interface AuthServiceFacade {
    getProfile(): Promise<UserProfile>;
    logout(): Promise<void>;
    refreshToken(): Promise<void>;
}
export declare function createAuthService(entryLink: HateoasLink): AuthServiceFacade;
