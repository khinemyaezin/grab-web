import type { PricingRoot } from "../types";
export declare function usePricingRoot(): import("@tanstack/react-query").UseQueryResult<PricingRoot, Error>;
export declare function usePricingLink(rel: keyof PricingRoot): import("@khinemyaezin/seller-api").HateoasLink | undefined;
