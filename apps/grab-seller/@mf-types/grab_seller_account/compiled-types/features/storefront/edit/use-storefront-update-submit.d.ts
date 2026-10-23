import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { StorefrontLifecycleEvent } from "@/features/storefront/types";
export type UseStorefrontUpdateSubmitProps = {
    updateLink?: HateoasLink;
    onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};
export declare function useStorefrontUpdateSubmit({ updateLink, onLifecycleEvent, }: UseStorefrontUpdateSubmitProps): {
    submit: () => Promise<void>;
    isPending: boolean;
    isSuccess: boolean;
};
