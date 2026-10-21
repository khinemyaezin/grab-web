import type { Pageable } from "@khinemyaezin/seller-api";
import type { ItemsFilterForm } from "@/features/inventory/types";
export type ItemFilterFormValue = ItemsFilterForm & Pageable;
export type ItemSearchCriteria = ItemsFilterForm & Pick<ItemFilterFormValue, "size">;
export declare function useItemFilter(initial?: Partial<ItemFilterFormValue>): {
    readonly filter: ItemFilterFormValue;
    readonly updateCriteria: (criteria: ItemSearchCriteria) => void;
    readonly updatePage: (page: number) => void;
};
