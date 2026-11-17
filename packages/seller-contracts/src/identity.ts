import type { AccessContext, User } from "./auth.js";
import type { PlatformLink } from "./api.js";

export type AccessContextSummary = AccessContext;
export type AccessContextResponse = AccessContext;

export interface IdentityProfile extends User {
  roles?: string[];
  permissions?: string[];
  accessContexts: AccessContextSummary[];
  currentAccessContext?: AccessContextSummary;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresInMs: number;
  userId: string;
  email: string;
  roles: string[];
  status: string;
  _links?: Record<string, PlatformLink>;
}

export interface RegisterUserResponse {
  userId?: string;
  email?: string;
  status?: string;
  _links?: Record<string, PlatformLink>;
}

// Deprecated alias for backwards-compatibility with old typo
export type RegisterUserReponse = RegisterUserResponse;

export interface ProfileResponse {
  id: string;
  email: string;
  roles: string[];
  status: string;
  createdAt: string;
  accessContexts: AccessContextResponse[];
  currentAccessContext?: AccessContextResponse;
  _links?: Record<string, PlatformLink>;
}

export type EntryRootResponse = {
  _links?: Record<string, PlatformLink>;
};

export interface UserProfile extends User {
  accessContexts: AccessContext[];
  currentAccessContext?: AccessContext;
}

export interface IdentityService {
  getProfile(): Promise<IdentityProfile>;
  logout(): Promise<void>;
  refreshToken(): Promise<void>;
}
