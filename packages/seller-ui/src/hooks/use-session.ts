import { useSyncExternalStore } from "react";
import type { SessionSnapshot, SessionUser } from "@khinemyaezin/seller-contracts";
import { useRequiredPlatform } from "../context/platform-provider.js";

export function useSessionSnapshot(): SessionSnapshot {
  const platform = useRequiredPlatform();
  return useSyncExternalStore(
    platform.session.subscribe,
    platform.session.getSnapshot,
    platform.session.getSnapshot,
  );
}

export interface AuthState {
  snapshot: SessionSnapshot;
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuthState(): AuthState {
  const snapshot = useSessionSnapshot();
  return {
    snapshot,
    user: snapshot.status === "authenticated" ? snapshot.user : null,
    isAuthenticated: snapshot.status === "authenticated",
    isLoading: snapshot.status === "loading",
  };
}
