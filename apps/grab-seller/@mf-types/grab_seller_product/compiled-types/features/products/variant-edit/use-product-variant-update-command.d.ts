import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { UpdateProductVariantRequest } from "@/features/products/types";
export type UseUpdateProductVariantCommandResult = {
    execute: (payload: UpdateProductVariantRequest) => Promise<void>;
    reset: () => void;
    isPending: boolean;
    link: HateoasLink | undefined;
};
export declare function useUpdateProductVariantCommand(): UseUpdateProductVariantCommandResult;
