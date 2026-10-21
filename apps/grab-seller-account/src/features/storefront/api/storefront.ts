import { api } from "@khinemyaezin/seller-api";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type {
  CreateStorefrontRequest,
  StorefrontLifecycleRequest,
  StorefrontResponse,
  StorefrontsResponse,
  UpdateStorefrontProfileRequest,
} from "@/features/storefront/types";

export const storefrontService = {
  list: (link: HateoasLink) =>
    api.followLink<StorefrontsResponse>(link, "GET"),

  get: (link: HateoasLink) =>
    api.followLink<StorefrontResponse>(link, "GET"),

  create: (link: HateoasLink, request: CreateStorefrontRequest) =>
    api.followLink<StorefrontResponse>(link, "POST", request),

  update: (link: HateoasLink, request: UpdateStorefrontProfileRequest) =>
    api.followLink<StorefrontResponse>(link, "PATCH", request),

  activate: (link: HateoasLink) =>
    api.followLink<StorefrontResponse>(link, "POST"),

  reactivate: (link: HateoasLink) =>
    api.followLink<StorefrontResponse>(link, "POST"),

  suspend: (link: HateoasLink, request: StorefrontLifecycleRequest) =>
    api.followLink<StorefrontResponse>(link, "POST", request),

  close: (link: HateoasLink, request: StorefrontLifecycleRequest) =>
    api.followLink<StorefrontResponse>(link, "POST", request),
};
