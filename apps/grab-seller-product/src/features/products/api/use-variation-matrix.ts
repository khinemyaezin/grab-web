
import { catalogService } from ".";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { VariationMatrixRequest, VariationMatrixResponse } from "@/features/products/types";
import { useMutation } from "@tanstack/react-query";
import { useApi } from "@khinemyaezin/seller-ui";

export function useVariationMatrixMutation(variationMatrixLink: HateoasLink | undefined) {
  const api = useApi();
  return useMutation<VariationMatrixResponse, Error, VariationMatrixRequest>({
    mutationFn: (request) =>
      catalogService.createVariationMatrix(api, variationMatrixLink!, request),
  });
}
