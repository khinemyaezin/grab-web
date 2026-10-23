import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { VariationMatrixRequest, VariationMatrixResponse } from "@/features/products/types";
export declare function useVariationMatrixMutation(variationMatrixLink: HateoasLink | undefined): import("@tanstack/react-query").UseMutationResult<VariationMatrixResponse, Error, VariationMatrixRequest, unknown>;
