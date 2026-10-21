import { HateoasLink } from "@khinemyaezin/seller-api";

export type MerchantStatus = "ACTIVE" | "DRAFT" | "PENDING_REVIEW" | "CHANGES_REQUESTED" | "SUSPENDED" | "REJECTED" | "CLOSED";
export type MerchantType = "FIRST_PARTY_RETAILER" | "THIRD_PARTY" | "C2C_SELLER";
export type StorefrontStatus = "DRAFT" | "ACTIVE" | "SUSPENDED" | "CLOSED";

export type MerchantRoot = {
    listMerchants?: HateoasLink;
    createC2cApplication?: HateoasLink;
    getC2cApplication?: HateoasLink;
    createRetailerApplication?: HateoasLink;
    getRetailerApplication?: HateoasLink;
    getCurrentMerchant?: HateoasLink;
    listStorefronts?: HateoasLink;
    createStorefront?: HateoasLink;
    getStorefront?: HateoasLink;
};

export type StorefrontLifecycleEvent =
    | { type: "titleResolved"; title: string }
    | { type: "created"; storefrontId?: string; message?: string }
    | { type: "createFailed"; message?: string }
    | { type: "updated"; message?: string }
    | { type: "updateFailed"; message?: string }
    | { type: "activated"; message?: string }
    | { type: "activateFailed"; message?: string }
    | { type: "suspended"; message?: string }
    | { type: "suspendFailed"; message?: string }
    | { type: "reactivated"; message?: string }
    | { type: "reactivateFailed"; message?: string }
    | { type: "closed"; message?: string }
    | { type: "closeFailed"; message?: string };
