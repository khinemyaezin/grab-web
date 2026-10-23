import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { StorefrontFormValues, StorefrontLifecycleEvent } from "@/features/storefront/types";
export type StorefrontNewFormProps = {
    link: HateoasLink;
    onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};
export declare const DEFAULT_STOREFRONT_FORM_VALUES: StorefrontFormValues;
export declare function StorefrontNewForm(props: StorefrontNewFormProps): import("react").JSX.Element;
