import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { UpdateSellableProductRequest } from "@/features/products/types";
export type UseUpdateSellableProductCommandProps = {
    link?: HateoasLink;
};
export type UseUpdateSellableProductCommandResult = {
    execute: (payload: UpdateSellableProductRequest) => Promise<{
        productId: string;
    }>;
    reset: () => void;
    isPending: boolean;
    link: HateoasLink | undefined;
};
export declare function useUpdateSellableProductCommand({ link, }?: UseUpdateSellableProductCommandProps): UseUpdateSellableProductCommandResult;
