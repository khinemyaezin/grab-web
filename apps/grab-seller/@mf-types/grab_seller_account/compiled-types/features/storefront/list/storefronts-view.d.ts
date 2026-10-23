import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { StorefrontLifecycleEvent } from "@/features/storefront/types";
export type StorefrontsViewProps = {
    listLink?: HateoasLink;
    canCreate?: boolean;
    onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};
export declare function StorefrontsView({ listLink, canCreate, onLifecycleEvent }: StorefrontsViewProps): import("react").JSX.Element;
