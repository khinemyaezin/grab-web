import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { CategoryLeavesResult } from "@/features/products/types";
export declare function useCategoryLeaveSearch(categoriesLink: HateoasLink | undefined, search: string): import("@tanstack/react-query").UseQueryResult<CategoryLeavesResult, Error>;
