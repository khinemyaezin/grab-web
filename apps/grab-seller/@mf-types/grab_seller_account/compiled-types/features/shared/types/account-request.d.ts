export interface CreateAccountRequest {
    displayName: string;
}
export interface UpdateBasicMerchantProfileRequest {
    legalName: string;
    displayName: string;
    contactEmail: string;
    contactPhone: string;
}
export interface UpdateRetailerRegistrationRequest extends UpdateBasicMerchantProfileRequest {
    registrationNumber: string;
    registrationCountryCode: string;
}
