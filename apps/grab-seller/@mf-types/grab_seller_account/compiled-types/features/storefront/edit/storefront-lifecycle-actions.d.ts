import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { StorefrontLifecycleEvent } from "@/features/storefront/types";
export type StorefrontLifecycleActionsProps = {
    links?: Record<string, HateoasLink>;
    onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};
export declare function StorefrontLifecycleActions({ links, onLifecycleEvent, }: StorefrontLifecycleActionsProps): import("react").JSX.Element | null;
