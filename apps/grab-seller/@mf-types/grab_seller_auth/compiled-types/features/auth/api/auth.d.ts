import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import { LoginRequest, RegisterUserRequest } from "../types/auth.request";
import { LoginResponse, RegisterUserReponse, ProfileResponse } from "../types/auth.response";
export declare const authService: {
    login: (api: PlatformApiClient, link: HateoasLink, request: LoginRequest, headers?: Record<string, string>) => Promise<LoginResponse>;
    registerUser: (api: PlatformApiClient, link: HateoasLink, request: RegisterUserRequest, headers?: Record<string, string>) => Promise<RegisterUserReponse>;
    readProfile: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<ProfileResponse>;
    logout: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<void>;
    refreshToken: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<void>;
};
