import { HateoasLink } from "@khinemyaezin/seller-api";
import { SellerAccount } from "../types";
export interface SellerAccountServiceFacade {
    getAccount: () => Promise<SellerAccount>;
}
export declare function createSellerAccountService(entryLink: HateoasLink): SellerAccountServiceFacade;
