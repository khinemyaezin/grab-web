import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type {
  CreateStorefrontRequest,
  StorefrontLifecycleRequest,
  StorefrontResponse,
  StorefrontsResponse,
  UpdateStorefrontProfileRequest,
} from "@/features/storefront/types";

export const storefrontService = {
  list: (api: PlatformApiClient, link: HateoasLink) =>
    api.followLink<StorefrontsResponse>(link, "GET"),

  get: (api: PlatformApiClient, link: HateoasLink) =>
    api.followLink<StorefrontResponse>(link, "GET"),

  create: (api: PlatformApiClient, link: HateoasLink, request: CreateStorefrontRequest) =>
    api.followLink<StorefrontResponse>(link, "POST", request),

  update: (api: PlatformApiClient, link: HateoasLink, request: UpdateStorefrontProfileRequest) =>
    api.followLink<StorefrontResponse>(link, "PATCH", request),

  activate: (api: PlatformApiClient, link: HateoasLink) =>
    api.followLink<StorefrontResponse>(link, "POST"),

  reactivate: (api: PlatformApiClient, link: HateoasLink) =>
    api.followLink<StorefrontResponse>(link, "POST"),

  suspend: (api: PlatformApiClient, link: HateoasLink, request: StorefrontLifecycleRequest) =>
    api.followLink<StorefrontResponse>(link, "POST", request),

  close: (api: PlatformApiClient, link: HateoasLink, request: StorefrontLifecycleRequest) =>
    api.followLink<StorefrontResponse>(link, "POST", request),
};
