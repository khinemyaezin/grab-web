import { CreateZoneRequest, ListZoneResponse, UpdateZoneRequest, ZonesFilterForm } from "@/features/inventory/types";
import { ZoneResponse } from "@/features/inventory/types/inventory.response";
import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
export declare const zoneService: {
    createZone: (link: HateoasLink, request: CreateZoneRequest, headers?: Record<string, string>) => Promise<ZoneResponse>;
    searchZones: (link: HateoasLink, filters?: ZonesFilterForm & Pageable, headers?: Record<string, string>) => Promise<ListZoneResponse>;
    getZone: (link: HateoasLink, headers?: Record<string, string>) => Promise<ZoneResponse>;
    removeZone: (link: HateoasLink, headers?: Record<string, string>) => Promise<ZoneResponse>;
    activate: (link: HateoasLink, headers?: Record<string, string>) => Promise<ZoneResponse>;
    deactivate: (link: HateoasLink, headers?: Record<string, string>) => Promise<ZoneResponse>;
    update: (link: HateoasLink, body: UpdateZoneRequest, headers?: Record<string, string>) => Promise<ZoneResponse>;
};
