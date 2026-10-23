import type { StorefrontLifecycleEvent } from "@/features/storefront/types";
export declare function useStorefrontEditEvents(): {
    title: string | undefined;
    handleEvent: (event: StorefrontLifecycleEvent) => void;
};
