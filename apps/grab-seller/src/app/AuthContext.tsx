import { createContext, useContext } from "react";
import {
  type SellerPlatform,
  type SessionSnapshot,
  type SessionUser,
} from "@khinemyaezin/seller-contracts";

/**
 * AuthContext is a derived convenience view for shell components.
 * Note: `platform.session` via `useSessionSnapshot()` is the authoritative source of truth.
 */
export type AuthContextValue = {
  snapshot: SessionSnapshot;
  user: SessionUser | null;
  roles: readonly string[];
  permissions: readonly string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  platform: SellerPlatform;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AUTH_CONTEXT_KEY = Symbol.for("@khinemyaezin/grab-seller/AuthContext");

export const AuthContext: React.Context<AuthContextValue | null> =
  (globalThis as any)[AUTH_CONTEXT_KEY] ??
  ((globalThis as any)[AUTH_CONTEXT_KEY] = createContext<AuthContextValue | null>(null));

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
