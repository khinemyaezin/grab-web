import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { StorefrontLifecycleEvent } from "@/features/storefront/types";
export type StorefrontTableProps = {
    link?: HateoasLink;
    onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};
export declare function StorefrontTable({ link, onLifecycleEvent }: StorefrontTableProps): import("react").JSX.Element;
