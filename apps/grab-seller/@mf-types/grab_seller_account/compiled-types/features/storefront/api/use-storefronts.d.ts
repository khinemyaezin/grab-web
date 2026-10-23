import type { QueryClient } from "@tanstack/react-query";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { CreateStorefrontRequest, StorefrontLifecycleRequest, StorefrontResponse, StorefrontsResponse, UpdateStorefrontProfileRequest } from "@/features/storefront/types";
export declare function invalidateStorefrontsQueries(queryClient: QueryClient): Promise<void>;
export declare function invalidateStorefrontQueries(queryClient: QueryClient, storefrontId?: string): Promise<void[]>;
export declare function useStorefronts(link?: HateoasLink): import("@tanstack/react-query").UseQueryResult<StorefrontsResponse, Error>;
export declare function useStorefront(link?: HateoasLink, storefrontId?: string): import("@tanstack/react-query").UseQueryResult<StorefrontResponse, Error>;
export declare function useCreateStorefrontMutation(): import("@tanstack/react-query").UseMutationResult<StorefrontResponse, Error, {
    link: HateoasLink;
    request: CreateStorefrontRequest;
}, unknown>;
export declare function useUpdateStorefrontMutation(): import("@tanstack/react-query").UseMutationResult<StorefrontResponse, Error, {
    link: HateoasLink;
    request: UpdateStorefrontProfileRequest;
}, unknown>;
export declare function useActivateStorefrontMutation(): import("@tanstack/react-query").UseMutationResult<StorefrontResponse, Error, HateoasLink, unknown>;
export declare function useReactivateStorefrontMutation(): import("@tanstack/react-query").UseMutationResult<StorefrontResponse, Error, HateoasLink, unknown>;
export declare function useSuspendStorefrontMutation(): import("@tanstack/react-query").UseMutationResult<StorefrontResponse, Error, {
    link: HateoasLink;
    request: StorefrontLifecycleRequest;
}, unknown>;
export declare function useCloseStorefrontMutation(): import("@tanstack/react-query").UseMutationResult<StorefrontResponse, Error, {
    link: HateoasLink;
    request: StorefrontLifecycleRequest;
}, unknown>;
