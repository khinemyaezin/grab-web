import type { StorefrontLifecycleEvent } from "@/features/storefront/types";
export type StorefrontEditViewProps = {
    storefrontId: string;
    onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};
export declare function StorefrontEditView({ storefrontId, onLifecycleEvent, }: StorefrontEditViewProps): import("react").JSX.Element;
