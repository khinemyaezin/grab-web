import { HateoasLink } from "@khinemyaezin/seller-api";
export type MerchantStatus = "ACTIVE" | "DRAFT" | "PENDING_REVIEW" | "CHANGES_REQUESTED" | "SUSPENDED" | "REJECTED" | "CLOSED";
export type MerchantType = "FIRST_PARTY_RETAILER" | "THIRD_PARTY" | "C2C_SELLER";
export type MerchantRoot = {
    listMerchants?: HateoasLink;
    createC2cApplication?: HateoasLink;
    getC2cApplication?: HateoasLink;
    createRetailerApplication?: HateoasLink;
    getRetailerApplication?: HateoasLink;
    getCurrentMerchant?: HateoasLink;
};
