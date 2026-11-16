import type { AccessContext, User } from "./auth.js";

export type AccessContextSummary = AccessContext;

export interface IdentityProfile extends User {
  roles?: string[];
  permissions?: string[];
  accessContexts: AccessContextSummary[];
  currentAccessContext?: AccessContextSummary;
}

export interface IdentityService {
  getProfile(): Promise<IdentityProfile>;
  logout(): Promise<void>;
  refreshToken(): Promise<void>;
}
