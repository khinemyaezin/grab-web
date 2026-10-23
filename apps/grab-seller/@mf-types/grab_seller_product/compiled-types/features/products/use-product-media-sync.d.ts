import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { ProductMediaFormItem } from "@/features/products/types";
export type ProductMediaSyncResult = {
    status: "skipped";
} | {
    status: "synced";
} | {
    status: "failed";
    error: Error;
};
export type UseProductMediaSyncOptions = {
    seed?: ProductMediaFormItem[];
    actions?: Record<string, HateoasLink>;
};
export type UseProductMediaSyncResult = {
    stage: () => Promise<ProductMediaSyncResult>;
    attach: (productId: string) => Promise<ProductMediaSyncResult>;
};
export declare function useProductMediaSync({ seed, actions, }?: UseProductMediaSyncOptions): UseProductMediaSyncResult;
