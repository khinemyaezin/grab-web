import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { StorefrontLifecycleEvent, StorefrontResponse } from "@/features/storefront/types";
export type StorefrontEditFormProps = {
    seed: StorefrontResponse;
    updateLink?: HateoasLink;
    onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};
export declare function StorefrontEditForm(props: StorefrontEditFormProps): import("react").JSX.Element;
