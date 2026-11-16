import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import { LoginRequest, RegisterUserRequest } from "../types/auth.request";
import { LoginResponse, RegisterUserReponse, ProfileResponse } from "../types/auth.response";

export const authService = {
  login: (api: PlatformApiClient, link: HateoasLink, request: LoginRequest, headers?: Record<string, string>): Promise<LoginResponse> => 
    api.followLink<LoginResponse>(link, "POST", request, undefined, headers, { retryOnUnauthorized: false }),

  registerUser: (api: PlatformApiClient, link: HateoasLink, request: RegisterUserRequest, headers?: Record<string, string>): Promise<RegisterUserReponse> => 
    api.followLink<RegisterUserReponse>(link, "POST", request, undefined, headers, { retryOnUnauthorized: false }),

  readProfile: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>): Promise<ProfileResponse> =>
    api.followLink<ProfileResponse>(link, "GET", undefined, undefined, headers, { retryOnUnauthorized: false }),

  logout: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>): Promise<void> =>
    api.followLink<void>(link, "POST", undefined, undefined, headers, { retryOnUnauthorized: false }),

  refreshToken: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>): Promise<void> =>
    api.followLink<void>(link, "POST", undefined, undefined, headers, { retryOnUnauthorized: false })
};
