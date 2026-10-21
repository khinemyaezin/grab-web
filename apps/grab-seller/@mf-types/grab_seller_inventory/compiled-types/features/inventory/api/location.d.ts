import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { LocationResponse, LocationsResponse, CreateLocationRequest, UpdateLocationRequest, LocationsFilterForm } from "@/features/inventory/types";
import type { Pageable } from "@khinemyaezin/seller-api";
export declare const locationService: {
    createLocation: (link: HateoasLink, request: CreateLocationRequest, headers?: Record<string, string>) => Promise<LocationResponse>;
    getLocation: (link: HateoasLink, headers?: Record<string, string>) => Promise<LocationResponse>;
    getLocationByCode: (link: HateoasLink, headers?: Record<string, string>) => Promise<LocationResponse>;
    searchLocations: (link: HateoasLink, filters?: LocationsFilterForm & Pageable) => Promise<LocationsResponse>;
    removeLocation: (link: HateoasLink, headers?: Record<string, string>) => Promise<void>;
    activate: (link: HateoasLink, headers?: Record<string, string>) => Promise<LocationResponse>;
    deactivate: (link: HateoasLink, headers?: Record<string, string>) => Promise<LocationResponse>;
    update: (link: HateoasLink, body: UpdateLocationRequest, headers?: Record<string, string>) => Promise<LocationResponse>;
};
