export type AccountBasicFormValues = {
    displayName: string;
};
export type AccountProfileFormValues = {
    legalName: string;
    displayName: string;
    contactEmail: string;
    contactPhone: string;
};
export type AccountBusinessRegistrationFormValues = {
    countryCode: string;
    registrationNumber: string;
};
export interface RetailerProfileFormValues extends AccountProfileFormValues, AccountBusinessRegistrationFormValues {
}
