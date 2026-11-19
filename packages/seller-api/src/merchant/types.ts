import type { HateoasLink } from "../hateoas.js";

export interface SellerAccount {
  merchantId: string;
  applicantUserId: string;
  type: string;
  legalName: string;
  displayName: string;
  status: string;
}

export type SellerAccountResponse = SellerAccount;

export interface MerchantRoot {
  listMerchants?: HateoasLink;
  createC2cApplication?: HateoasLink;
  getC2cApplication?: HateoasLink;
  createRetailerApplication?: HateoasLink;
  getRetailerApplication?: HateoasLink;
  listRegionCountries?: HateoasLink;
  getMerchant?: HateoasLink;
  listStorefronts?: HateoasLink;
  createStorefront?: HateoasLink;
  getStorefront?: HateoasLink;
}

export interface SellerAccountService {
  getAccount: () => Promise<SellerAccount>;
}

export type SellerAccountServiceFacade = SellerAccountService;
