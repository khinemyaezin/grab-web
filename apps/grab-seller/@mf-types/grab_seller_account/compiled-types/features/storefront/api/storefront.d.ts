import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { CreateStorefrontRequest, StorefrontLifecycleRequest, StorefrontResponse, StorefrontsResponse, UpdateStorefrontProfileRequest } from "@/features/storefront/types";
export declare const storefrontService: {
    list: (api: PlatformApiClient, link: HateoasLink) => Promise<StorefrontsResponse>;
    get: (api: PlatformApiClient, link: HateoasLink) => Promise<StorefrontResponse>;
    create: (api: PlatformApiClient, link: HateoasLink, request: CreateStorefrontRequest) => Promise<StorefrontResponse>;
    update: (api: PlatformApiClient, link: HateoasLink, request: UpdateStorefrontProfileRequest) => Promise<StorefrontResponse>;
    activate: (api: PlatformApiClient, link: HateoasLink) => Promise<StorefrontResponse>;
    reactivate: (api: PlatformApiClient, link: HateoasLink) => Promise<StorefrontResponse>;
    suspend: (api: PlatformApiClient, link: HateoasLink, request: StorefrontLifecycleRequest) => Promise<StorefrontResponse>;
    close: (api: PlatformApiClient, link: HateoasLink, request: StorefrontLifecycleRequest) => Promise<StorefrontResponse>;
};
