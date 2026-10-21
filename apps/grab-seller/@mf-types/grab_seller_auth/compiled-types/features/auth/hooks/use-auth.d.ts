import { HateoasLink } from "@khinemyaezin/seller-api";
import { LoginRequest, RegisterUserRequest } from "../types/auth.request";
import { LoginResponse, RegisterUserReponse } from "../types/auth.response";
export declare const useLoginMutation: () => import("@tanstack/react-query").UseMutationResult<LoginResponse, Error, {
    link: HateoasLink;
    request: LoginRequest;
}, unknown>;
export declare const useRegisterMutation: () => import("@tanstack/react-query").UseMutationResult<RegisterUserReponse, Error, {
    link: HateoasLink;
    request: RegisterUserRequest;
}, unknown>;
export declare const useProfileGet: (link?: HateoasLink) => import("@tanstack/react-query").UseQueryResult<import("../types").ProfileResponse, Error>;
