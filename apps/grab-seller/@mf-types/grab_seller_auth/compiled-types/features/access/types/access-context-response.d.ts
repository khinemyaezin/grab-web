import { HalLinks } from "@khinemyaezin/seller-api";
export interface AccessContextListResponse {
    _embedded: {
        accessContextResponseList?: AccessContextResponse[];
    };
    _links: HalLinks;
}
export interface AccessContextResponse {
    assignmentId: string;
    scopeKey: string;
    scopeId: string;
    roleCodes: string[];
    display: {
        title: string;
        subtitle: string;
        status: string;
    };
    _links: HalLinks;
}
export interface AccessContextSelectionResponse {
    accessToken: string;
    refreshToken: string;
    expiresInMs: 0;
    userId: string;
    email: string;
    roles: string[];
    status: string;
}
