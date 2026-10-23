import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { SalesChannelResponse } from "@/features/products/types/sales-channel.response";
export declare function useSalesChannels(entryLink?: HateoasLink | null): import("@tanstack/react-query").UseQueryResult<SalesChannelResponse[], Error>;
