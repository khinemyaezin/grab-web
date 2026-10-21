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

export interface CreateStorefrontRequest {
    name: string;
    slug: string;
}

export interface UpdateStorefrontProfileRequest {
    name: string;
    slug?: string;
}

export interface StorefrontLifecycleRequest {
    reason: string;
}
