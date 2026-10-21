import type { ProductLifecycleEvent } from "@/features/products/types";
export type ProductVariantEditEventMessages = {
    updated?: string;
    updateFailed?: string;
    updateTimedOut?: string;
    deleted?: string;
    deleteFailed?: string;
    restored?: string;
    restoreFailed?: string;
};
export declare function useProductVariantEditEvents(messages?: ProductVariantEditEventMessages): {
    title: string | undefined;
    handleEvent: (event: ProductLifecycleEvent) => void;
    toast: (type: "success" | "error" | "info" | "warning", message: string, description?: string) => void;
};
