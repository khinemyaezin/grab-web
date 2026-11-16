import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type {
  LocationResponse,
  LocationsResponse,
  CreateLocationRequest,
  UpdateLocationRequest,
  LocationsFilterForm,
} from "@/features/inventory/types";
import type { Pageable } from "@khinemyaezin/seller-api";

export const locationService = {
  createLocation: (
    api: PlatformApiClient,
    link: HateoasLink,
    request: CreateLocationRequest,
    headers?: Record<string, string>,
  ) => api.followLink<LocationResponse>(link, "POST", request, undefined, headers),

  getLocation: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<LocationResponse>(link, "GET", undefined, undefined, headers),

  getLocationByCode: (
    api: PlatformApiClient,
    link: HateoasLink,
    headers?: Record<string, string>,
  ) => api.followLink<LocationResponse>(link, "GET", undefined, undefined, headers),

  searchLocations: (
    api: PlatformApiClient,
    link: HateoasLink,
    filters?: LocationsFilterForm & Pageable,
  ) => api.followLink<LocationsResponse>(link, "POST", filters),

  removeLocation: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<void>(link, "DELETE", undefined, undefined, headers),

  activate: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<LocationResponse>(link, "PATCH", undefined, undefined, headers),

  deactivate: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<LocationResponse>(link, "PATCH", undefined, undefined, headers),

  update: (
    api: PlatformApiClient,
    link: HateoasLink,
    body: UpdateLocationRequest,
    headers?: Record<string, string>,
  ) => api.followLink<LocationResponse>(link, "PATCH", body, undefined, headers),

  linkToChannel: (
    api: PlatformApiClient,
    link: HateoasLink,
    request: { salesChannelId: string },
    headers?: Record<string, string>,
  ) => api.followLink<LocationResponse>(link, "POST", request, undefined, headers),

  unlinkFromChannel: (
    api: PlatformApiClient,
    link: HateoasLink,
    request: { salesChannelId: string },
    headers?: Record<string, string>,
  ) => api.followLink<LocationResponse>(link, "POST", request, undefined, headers),
};
