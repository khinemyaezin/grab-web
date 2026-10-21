import type { Pageable } from "@khinemyaezin/seller-api";
import type { LocationsFilterForm } from "@/features/inventory/types";
export type LocationFilterFormValue = LocationsFilterForm & Pageable;
export type LocationSearchCriteria = LocationsFilterForm & Pick<LocationFilterFormValue, "size">;
export declare function useLocationFilter(initial?: Partial<LocationFilterFormValue>): {
    readonly filter: LocationFilterFormValue;
    readonly updateCriteria: (criteria: LocationSearchCriteria) => void;
    readonly updatePage: (page: number) => void;
};
