import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { StorefrontLifecycleEvent } from "@/features/storefront/types";
export type UseStorefrontCreateSubmitProps = {
    link: HateoasLink;
    onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};
export declare function useStorefrontCreateSubmit({ link, onLifecycleEvent, }: UseStorefrontCreateSubmitProps): {
    submit: () => Promise<void>;
    isPending: boolean;
    isSuccess: boolean;
};
