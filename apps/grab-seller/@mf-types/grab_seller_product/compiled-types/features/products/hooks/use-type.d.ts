import type { HateoasLink } from "@khinemyaezin/seller-api";
import { GetVariationTypeResult } from "@/features/products/types";
export declare function useVariationType(variantTypesLink: HateoasLink | undefined, name: string): import("@tanstack/react-query").UseQueryResult<GetVariationTypeResult, Error>;
