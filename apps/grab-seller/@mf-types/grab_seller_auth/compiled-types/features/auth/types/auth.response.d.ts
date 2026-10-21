export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresInMs: number;
    userId: string;
    email: string;
    roles: string[];
    status: string;
    _links: Record<string, {
        href: string;
    }>;
}
export interface RegisterUserReponse {
}
export interface ProfileResponse {
    id: string;
    email: string;
    roles: string[];
    status: string;
    createdAt: string;
    accessContexts: AccessContextResponse[];
    currentAccessContext: AccessContextResponse;
    _links: Record<string, {
        href: string;
    }>;
}
export interface AccessContextResponse {
    assignmentId: string;
    platformCode: string;
    roleCode: string;
    scopeKey: string;
    scopeId: string;
    status: string;
}
