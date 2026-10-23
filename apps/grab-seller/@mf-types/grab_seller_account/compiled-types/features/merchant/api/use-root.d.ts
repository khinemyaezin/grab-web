import { MerchantRoot } from "@/features/merchant/types";
export declare function useRoot(): import("@tanstack/react-query").UseQueryResult<MerchantRoot, Error>;
export declare function useMerchantLink(rel: keyof MerchantRoot): import("@khinemyaezin/seller-api").HateoasLink | undefined;
