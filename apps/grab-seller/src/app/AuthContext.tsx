import {
  createContext,
  useContext,
} from "react";
import {
  type SellerPlatform,
  type SessionSnapshot,
  type SessionUser,
} from "@khinemyaezin/seller-contracts";

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

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
