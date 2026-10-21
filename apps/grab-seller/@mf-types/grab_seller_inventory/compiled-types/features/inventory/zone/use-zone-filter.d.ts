import type { Pageable } from "@khinemyaezin/seller-api";
import type { ZonesFilterForm } from "@/features/inventory/types";
export type ZoneFilterFormValue = ZonesFilterForm & Pageable;
export type ZoneSearchCriteria = ZonesFilterForm & Pick<ZoneFilterFormValue, "size">;
export declare function useZoneFilter(initial?: Partial<ZoneFilterFormValue>): {
    readonly filter: ZoneFilterFormValue;
    readonly updateCriteria: (criteria: ZoneSearchCriteria) => void;
    readonly updatePage: (page: number) => void;
};
