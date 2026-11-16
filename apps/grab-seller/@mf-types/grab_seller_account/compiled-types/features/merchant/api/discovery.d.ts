import { MerchantRoot } from "@/features/merchant/types";
import { HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
export declare function fetchMerchantRoot(api: PlatformApiClient, link: HateoasLink): Promise<MerchantRoot>;
