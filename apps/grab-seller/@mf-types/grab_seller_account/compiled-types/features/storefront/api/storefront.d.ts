import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { CreateStorefrontRequest, StorefrontLifecycleRequest, StorefrontResponse, StorefrontsResponse, UpdateStorefrontProfileRequest } from "@/features/storefront/types";
export declare const storefrontService: {
    list: (link: HateoasLink) => Promise<StorefrontsResponse>;
    get: (link: HateoasLink) => Promise<StorefrontResponse>;
    create: (link: HateoasLink, request: CreateStorefrontRequest) => Promise<StorefrontResponse>;
    update: (link: HateoasLink, request: UpdateStorefrontProfileRequest) => Promise<StorefrontResponse>;
    activate: (link: HateoasLink) => Promise<StorefrontResponse>;
    reactivate: (link: HateoasLink) => Promise<StorefrontResponse>;
    suspend: (link: HateoasLink, request: StorefrontLifecycleRequest) => Promise<StorefrontResponse>;
    close: (link: HateoasLink, request: StorefrontLifecycleRequest) => Promise<StorefrontResponse>;
};
