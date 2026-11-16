import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { LocationResponse, LocationsResponse, CreateLocationRequest, UpdateLocationRequest, LocationsFilterForm } from "@/features/inventory/types";
import type { Pageable } from "@khinemyaezin/seller-api";
export declare const locationService: {
    createLocation: (api: PlatformApiClient, link: HateoasLink, request: CreateLocationRequest, headers?: Record<string, string>) => Promise<LocationResponse>;
    getLocation: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<LocationResponse>;
    getLocationByCode: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<LocationResponse>;
    searchLocations: (api: PlatformApiClient, link: HateoasLink, filters?: LocationsFilterForm & Pageable) => Promise<LocationsResponse>;
    removeLocation: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<void>;
    activate: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<LocationResponse>;
    deactivate: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<LocationResponse>;
    update: (api: PlatformApiClient, link: HateoasLink, body: UpdateLocationRequest, headers?: Record<string, string>) => Promise<LocationResponse>;
    linkToChannel: (api: PlatformApiClient, link: HateoasLink, request: {
        salesChannelId: string;
    }, headers?: Record<string, string>) => Promise<LocationResponse>;
    unlinkFromChannel: (api: PlatformApiClient, link: HateoasLink, request: {
        salesChannelId: string;
    }, headers?: Record<string, string>) => Promise<LocationResponse>;
};
