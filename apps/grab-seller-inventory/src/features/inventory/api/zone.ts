import {
  CreateZoneRequest,
  ListZoneResponse,
  UpdateZoneRequest,
  ZonesFilterForm,
} from "@/features/inventory/types";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import { ZoneResponse } from "@/features/inventory/types/inventory.response";
import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";

export const zoneService = {
  createZone: (
    api: PlatformApiClient,
    link: HateoasLink,
    request: CreateZoneRequest,
    headers?: Record<string, string>,
  ) => api.followLink<ZoneResponse>(link, "POST", request, undefined, headers),

  searchZones: (
    api: PlatformApiClient,
    link: HateoasLink,
    filters?: ZonesFilterForm & Pageable,
    headers?: Record<string, string>,
  ) => api.followLink<ListZoneResponse>(link, "POST", filters, undefined, headers),

  getZone: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<ZoneResponse>(link, "GET", undefined, undefined, headers),

  removeZone: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<ZoneResponse>(link, "DELETE", undefined, undefined, headers),

  activate: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<ZoneResponse>(link, "PATCH", undefined, undefined, headers),

  deactivate: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<ZoneResponse>(link, "PATCH", undefined, undefined, headers),

  update: (
    api: PlatformApiClient,
    link: HateoasLink,
    body: UpdateZoneRequest,
    headers?: Record<string, string>,
  ) => api.followLink<ZoneResponse>(link, "PATCH", body, undefined, headers),
};
