import type { HateoasLink } from "@khinemyaezin/seller-api";
export declare function useVariantPriceLinkGet(link?: HateoasLink, variantId?: string): import("@tanstack/react-query").UseQueryResult<import("../types").VariantPriceSetLinkResponse | null, Error>;
export declare function usePriceSetLinkGet(getPriceSetLink?: HateoasLink): import("@tanstack/react-query").UseQueryResult<import("../types").PriceSetResponse, Error>;
