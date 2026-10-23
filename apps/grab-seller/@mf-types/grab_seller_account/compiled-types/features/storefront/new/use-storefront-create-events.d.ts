import type { StorefrontLifecycleEvent } from "@/features/storefront/types";
export declare function useStorefrontCreateEvents(): {
    handleEvent: (event: StorefrontLifecycleEvent) => void;
    toast: (type: "success" | "error", message: string) => void;
};
