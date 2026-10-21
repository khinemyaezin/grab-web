import type { ProductLifecycleEvent } from "@/features/products/types";
export declare function useProductCreateEvents(): {
    handleEvent: (event: ProductLifecycleEvent) => void;
    toast: (type: "success" | "error" | "info" | "warning", message: string, description?: string) => void;
};
