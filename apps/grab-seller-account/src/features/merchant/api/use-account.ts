import { ApiError, HateoasLink } from "@khinemyaezin/seller-api";
import { useApi } from "@khinemyaezin/seller-ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateSellerAccountResponse, C2CApplicationStatusResponse, SubmitSellerAccountResponse, RetailerApplicationStatusResponse } from "@/features/merchant/types";
import { CreateAccountRequest, UpdateBasicMerchantProfileRequest, UpdateRetailerRegistrationRequest } from "@/features/merchant/types";

export function useAccount() {
    const api = useApi();
    return useMutation<CreateSellerAccountResponse, Error, { link: HateoasLink, request: CreateAccountRequest }>({
        mutationFn: ({ link, request }) => api.followLink(link, "POST", request),
    })
}

export function useUpdateAccount() {
    const api = useApi();
    return useMutation<CreateSellerAccountResponse, Error, { link: HateoasLink, request: UpdateBasicMerchantProfileRequest | UpdateRetailerRegistrationRequest }>({
        mutationFn: ({ link, request }) => api.followLink(link, "PATCH", request),
    })
}

export function useC2CApplicationGet(link?: HateoasLink) {
    const api = useApi();
    return useQuery<C2CApplicationStatusResponse, ApiError>({
        queryKey: ["c2c-application", link?.href],
        queryFn: () => api.followLink(link!, "GET"),
        enabled: !!link,
        retry: (failureCount, error) => {
            if (error.status === 404) {
                return false;
            }
            return failureCount < 3;
        }
    });
}

export function useRetailerApplicationGet(link?: HateoasLink) {
    const api = useApi();
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
    const api = useApi();
    return useMutation<SubmitSellerAccountResponse, Error, { link: HateoasLink }>({
        mutationFn: ({ link }) => api.followLink(link, "POST"),
    })
}
