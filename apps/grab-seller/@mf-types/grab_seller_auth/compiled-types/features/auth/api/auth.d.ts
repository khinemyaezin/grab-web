import { HateoasLink } from "@khinemyaezin/seller-api";
import { LoginRequest, RegisterUserRequest } from "../types/auth.request";
import { LoginResponse, RegisterUserReponse, ProfileResponse } from "../types/auth.response";
export declare const authService: {
    login: (link: HateoasLink, request: LoginRequest, headers?: Record<string, string>) => Promise<LoginResponse>;
    registerUser: (link: HateoasLink, request: RegisterUserRequest, headers?: Record<string, string>) => Promise<RegisterUserReponse>;
    readProfile: (link: HateoasLink, headers?: Record<string, string>) => Promise<ProfileResponse>;
    logout: (link: HateoasLink, headers?: Record<string, string>) => Promise<void>;
    refreshToken: (link: HateoasLink, headers?: Record<string, string>) => Promise<void>;
};
