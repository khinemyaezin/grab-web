import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { CreateSellableProductRequest } from "@/features/products/types";
export type UseCreateSellableProductCommandResult = {
    execute: (payload: CreateSellableProductRequest) => Promise<{
        productId: string;
    }>;
    reset: () => void;
    isPending: boolean;
};
export declare function useCreateSellableProductCommand(link: HateoasLink): UseCreateSellableProductCommandResult;
