import { HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import { SellerAccount } from "@/features/merchant/types";
export interface SellerAccountServiceFacade {
    getAccount: () => Promise<SellerAccount>;
}
export declare function createSellerAccountService(api: PlatformApiClient, entryLink: HateoasLink, merchantId?: string): SellerAccountServiceFacade;
