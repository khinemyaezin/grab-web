import type { Pageable } from "@khinemyaezin/seller-api";
import type { BinsFilterForm } from "@/features/inventory/types";
export type BinFilterFormValue = BinsFilterForm & Pageable;
export type BinSearchCriteria = BinsFilterForm & Pick<BinFilterFormValue, "size">;
export declare function useBinFilter(initial?: Partial<BinFilterFormValue>): {
    readonly filter: BinFilterFormValue;
    readonly updateCriteria: (criteria: BinSearchCriteria) => void;
    readonly updatePage: (page: number) => void;
};
