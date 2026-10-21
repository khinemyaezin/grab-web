import type { HateoasLink } from "@khinemyaezin/seller-api";
import { GetVariationOptionResult } from "@/features/products/types";
export declare function useVariationOptionSearch(variantOptionsLink: HateoasLink | undefined, name: string, type: string): import("@tanstack/react-query").UseQueryResult<GetVariationOptionResult, Error>;
