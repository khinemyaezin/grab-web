import { HateoasLink } from "@khinemyaezin/seller-api";
import { CreateSellerAccountResponse, C2CApplicationStatusResponse, SubmitSellerAccountResponse, RetailerApplicationStatusResponse, SellerAccountResponse } from "../types/account-response";
import { CreateAccountRequest, UpdateBasicMerchantProfileRequest, UpdateRetailerRegistrationRequest } from "../types/account-request";
export declare function useAccount(): import("@tanstack/react-query").UseMutationResult<CreateSellerAccountResponse, Error, {
    link: HateoasLink;
    request: CreateAccountRequest;
}, unknown>;
export declare function useUpdateAccount(): import("@tanstack/react-query").UseMutationResult<CreateSellerAccountResponse, Error, {
    link: HateoasLink;
    request: UpdateBasicMerchantProfileRequest | UpdateRetailerRegistrationRequest;
}, unknown>;
export declare function useC2CApplicationGet(link?: HateoasLink): import("@tanstack/react-query").UseQueryResult<C2CApplicationStatusResponse, Error>;
export declare function useRetailerApplicationGet(link?: HateoasLink): import("@tanstack/react-query").UseQueryResult<RetailerApplicationStatusResponse, Error>;
export declare function useAccountApplicationSubmit(): import("@tanstack/react-query").UseMutationResult<SubmitSellerAccountResponse, Error, {
    link: HateoasLink;
}, unknown>;
export declare function useCurrentAccountGet(link?: HateoasLink): import("@tanstack/react-query").UseQueryResult<SellerAccountResponse, Error>;
