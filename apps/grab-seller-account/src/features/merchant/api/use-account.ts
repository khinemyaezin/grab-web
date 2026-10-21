import { api, ApiError, HateoasLink } from "@khinemyaezin/seller-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateSellerAccountResponse, C2CApplicationStatusResponse, SubmitSellerAccountResponse, RetailerApplicationStatusResponse, SellerAccountResponse } from "@/features/merchant/types";
import { CreateAccountRequest, UpdateBasicMerchantProfileRequest, UpdateRetailerRegistrationRequest } from "@/features/merchant/types";

export function useAccount() {
    return useMutation<CreateSellerAccountResponse, Error, { link: HateoasLink, request: CreateAccountRequest }>({
        mutationFn: ({ link, request }) => api.followLink(link, "POST", request),
    })
}

export function useUpdateAccount() {
    return useMutation<CreateSellerAccountResponse, Error, { link: HateoasLink, request: UpdateBasicMerchantProfileRequest | UpdateRetailerRegistrationRequest }>({
        mutationFn: ({ link, request }) => api.followLink(link, "PATCH", request),
    })
}

export function useC2CApplicationGet(link?: HateoasLink) {
    return useQuery<C2CApplicationStatusResponse>({
        queryKey: ["c2c-application", link?.href],
        queryFn: () => api.followLink(link!, "GET"),
        enabled: !!link,
        retry: (failureCount, error) => {
            if (error instanceof ApiError && error.status === 404) {
                return false;
            }
            return failureCount < 3;
        }
    });
}

export function useRetailerApplicationGet(link?: HateoasLink) {
    return useQuery<RetailerApplicationStatusResponse>({
        queryKey: ["retailer-application", link?.href],
        queryFn: () => api.followLink(link!, "GET"),
        enabled: !!link,
        retry: (failureCount, error) => {
            if (error instanceof ApiError && error.status === 404) {
                return false;
            }
            return failureCount < 3;
        }
    });
}

export function useAccountApplicationSubmit() {
    return useMutation<SubmitSellerAccountResponse, Error, { link: HateoasLink }>({
        mutationFn: ({ link }) => api.followLink(link, "POST"),
    })
}

export function useCurrentAccountGet(link?: HateoasLink) {
    return useQuery<SellerAccountResponse>({
        queryKey: ["current-account"],
        queryFn: () => api.followLink(link!, "GET"),
        enabled: !!link,
        retry: (failureCount, error) => {
            if (error instanceof ApiError && error.status === 403) {
                return false;
            }
            return failureCount < 3;
        }
    })
}