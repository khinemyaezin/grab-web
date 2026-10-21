import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { LocationResponse, LocationsResponse, CreateLocationRequest, UpdateLocationRequest, LocationsFilterForm } from "@/features/inventory/types";
import type { Pageable } from "@khinemyaezin/seller-api";
export declare function useLocations(locationsLink?: HateoasLink, filters?: LocationsFilterForm & Pageable): import("@tanstack/react-query").UseQueryResult<LocationsResponse, Error>;
export declare function useLocation(link?: HateoasLink, locationId?: string): import("@tanstack/react-query").UseQueryResult<LocationResponse, Error>;
export declare function useCreateLocationMutation(): import("@tanstack/react-query").UseMutationResult<LocationResponse, Error, {
    link: HateoasLink;
    request: CreateLocationRequest;
}, unknown>;
export declare function useUpdateLocationMutation(): import("@tanstack/react-query").UseMutationResult<LocationResponse, Error, {
    link: HateoasLink;
    request: UpdateLocationRequest;
}, unknown>;
export declare function useActivateLocationMutation(): import("@tanstack/react-query").UseMutationResult<LocationResponse, Error, HateoasLink, unknown>;
export declare function useDeactivateLocationMutation(): import("@tanstack/react-query").UseMutationResult<LocationResponse, Error, HateoasLink, unknown>;
export declare function useDeleteLocationMutation(): import("@tanstack/react-query").UseMutationResult<void, Error, HateoasLink, unknown>;
