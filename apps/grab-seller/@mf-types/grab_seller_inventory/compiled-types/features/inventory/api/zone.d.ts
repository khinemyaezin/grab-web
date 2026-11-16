import { CreateZoneRequest, ListZoneResponse, UpdateZoneRequest, ZonesFilterForm } from "@/features/inventory/types";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import { ZoneResponse } from "@/features/inventory/types/inventory.response";
import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
export declare const zoneService: {
    createZone: (api: PlatformApiClient, link: HateoasLink, request: CreateZoneRequest, headers?: Record<string, string>) => Promise<ZoneResponse>;
    searchZones: (api: PlatformApiClient, link: HateoasLink, filters?: ZonesFilterForm & Pageable, headers?: Record<string, string>) => Promise<ListZoneResponse>;
    getZone: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<ZoneResponse>;
    removeZone: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<ZoneResponse>;
    activate: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<ZoneResponse>;
    deactivate: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<ZoneResponse>;
    update: (api: PlatformApiClient, link: HateoasLink, body: UpdateZoneRequest, headers?: Record<string, string>) => Promise<ZoneResponse>;
};
