import type { ProductLifecycleEvent } from "@/features/products/types";
export type ProductEditEventMessages = {
    updated?: string;
    updateFailed?: string;
    updateTimedOut?: string;
};
export declare function useProductEditEvents(messages?: ProductEditEventMessages): {
    title: string | undefined;
    handleEvent: (event: ProductLifecycleEvent) => void;
    toast: (type: "success" | "error" | "warning", message: string, description?: string) => void;
};
