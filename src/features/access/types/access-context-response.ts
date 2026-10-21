import { HalLinks } from "@khinemyaezin/seller-api"

export interface AccessContextListResponse {
    _embedded: {
        accessContextResponseList?: AccessContextResponse[]
    },
    _links: HalLinks
}

export interface AccessContextResponse {
    assignmentId: string,
    scopeKey: string,
    scopeId: string,
    title?: string | null,
    subtitle?: string | null,
    roleCodes: string[]
    expiresAt?: string | null,
    _links: HalLinks
}

export interface AccessContextSelectionResponse {
    accessToken: string,
    refreshToken: string,
    expiresInMs: 0,
    userId: string,
    email: string,
    roles: string[],
    status: string,
}
