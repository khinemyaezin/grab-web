import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
import { CreateZoneRequest, ListZoneResponse, UpdateZoneRequest, ZonesFilterForm } from "@/features/inventory/types";
import { ZoneResponse } from "@/features/inventory/types/inventory.response";
export declare function useZones(link?: HateoasLink, locationId?: string, filter?: ZonesFilterForm & Pageable): import("@tanstack/react-query").UseQueryResult<ListZoneResponse, Error>;
export declare function useZone(link?: HateoasLink, id?: string): import("@tanstack/react-query").UseQueryResult<ZoneResponse, Error>;
export declare function useAddZoneMutation(): import("@tanstack/react-query").UseMutationResult<ZoneResponse, Error, {
    link: HateoasLink;
    request: CreateZoneRequest;
}, unknown>;
export declare function useUpdateZoneMutation(): import("@tanstack/react-query").UseMutationResult<ZoneResponse, Error, {
    link: HateoasLink;
    request: UpdateZoneRequest;
}, unknown>;
export declare function useRemoveZoneMutation(): import("@tanstack/react-query").UseMutationResult<ZoneResponse, Error, HateoasLink, unknown>;
export declare function useActivateZoneMutation(): import("@tanstack/react-query").UseMutationResult<ZoneResponse, Error, HateoasLink, unknown>;
export declare function useDeactivateZoneMutation(): import("@tanstack/react-query").UseMutationResult<ZoneResponse, Error, HateoasLink, unknown>;
