import { HalLinks } from "@khinemyaezin/seller-api";
import { MerchantStatus, MerchantType } from "./account-model";
export interface SellerAccountResponse {
    merchantId: string;
    applicantUserId: string;
    type: string;
    legalName: string;
    displayName: string;
    registration: {
        countryCode: string;
        registrationNumber: string;
    };
    contact: {
        email: string;
        phone: string;
    };
    registeredAddress: {
        line1: string;
        line2: string;
        city: string;
        region: string;
        postalCode: string;
        countryCode: string;
    };
    status: string;
    lifecycleReason: string;
    reviewedBy: string;
    reviewedAt: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    _links: HalLinks;
}
export interface CreateSellerAccountResponse extends SellerAccountResponse {
}
export interface UpdateSellerAccountResponse extends SellerAccountResponse {
}
export interface SubmitSellerAccountResponse extends SellerAccountResponse {
}
export interface C2CApplicationStatusResponse {
    merchantId: string;
    applicantUserId: string;
    type: MerchantType;
    status: MerchantStatus;
    completedContactInfo: boolean;
    completedBasicInfo: boolean;
    _links: HalLinks;
}
export interface RetailerApplicationStatusResponse {
    merchantId: string;
    applicantUserId: string;
    type: MerchantType;
    status: MerchantStatus;
    completedContactInfo: boolean;
    completedBasicInfo: boolean;
    completedBusinessRegistration: boolean;
    _links: HalLinks;
}
