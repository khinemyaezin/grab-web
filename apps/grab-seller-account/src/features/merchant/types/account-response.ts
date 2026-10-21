import { HalLinks, HateoasLink } from "@khinemyaezin/seller-api"
import { MerchantStatus, MerchantType, StorefrontStatus } from "./account-model"

export interface SellerAccountResponse {
    merchantId: string,
    applicantUserId: string,
    type: string,
    legalName: string,
    displayName: string,
    registration: {
        countryCode: string,
        registrationNumber: string
    },
    contact: {
        email: string,
        phone: string
    },
    registeredAddress: {
        line1: string,
        line2: string,
        city: string,
        region: string,
        postalCode: string,
        countryCode: string
    },
    status: string,
    lifecycleReason: string,
    reviewedBy: string,
    reviewedAt: string,
    createdAt: string,
    updatedAt: string,
    version: number,
    _links: HalLinks
}

export interface CreateSellerAccountResponse extends SellerAccountResponse {
    //TODO
}

export interface UpdateSellerAccountResponse extends SellerAccountResponse {
    //TODO
}
export interface SubmitSellerAccountResponse extends SellerAccountResponse {
    //TODO
}

export interface C2CApplicationStatusResponse {
    merchantId: string,
    applicantUserId: string,
    type: MerchantType,
    status: MerchantStatus,
    completedContactInfo: boolean,
    completedBasicInfo: boolean,
    _links: HalLinks

}

export interface RetailerApplicationStatusResponse {
    merchantId: string,
    applicantUserId: string,
    type: MerchantType,
    status: MerchantStatus,
    completedContactInfo: boolean,
    completedBasicInfo: boolean,
    completedBusinessRegistration: boolean,
    _links: HalLinks

}

export interface StorefrontResponse {
    storefrontId: string;
    merchantId: string;
    name: string;
    slug: string;
    status: StorefrontStatus;
    lifecycleReason: string | null;
    createdAt: string;
    updatedAt: string;
    version: number;
    _links?: HalLinks;
}

export interface StorefrontsResponse {
    _embedded?: {
        storefrontResponseList?: StorefrontResponse[];
        storefrontResponses?: StorefrontResponse[];
    };
    _links?: Record<string, HateoasLink>;
}