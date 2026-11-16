import { ReactNode, useMemo } from "react";
import {
  SellerRuntimeConfig,
  SessionApi,
} from "@khinemyaezin/seller-contracts";

import { AuthContextValue, AuthContext } from "./AuthContext";
import { useAuthService, useSessionEffects, useSessionOperations, useSessionState } from "../hooks";
import { useShellPlatform } from "./ShellPlatformProvider";

export function AuthProvider({
  children,
  onSessionCleared,
}: {
  children: ReactNode;
  runtimeConfig?: Readonly<SellerRuntimeConfig>;
  onSessionCleared?: () => void;
}) {
  const { platform, sessionRef, events } = useShellPlatform();

  const authService = useAuthService(platform.api!);
  const { snapshot, snapshotRef, publishSnapshot, subscribe } = useSessionState();

  const { loadSession, expireSession, refresh, logout } = useSessionOperations({
    authService,
    publishSnapshot,
    snapshotRef,
    onSessionCleared,
    events,
  });

  const session = useMemo<SessionApi>(() => ({
    getSnapshot: () => snapshotRef.current,
    subscribe,
    refresh,
    logout,
  }), [logout, refresh, snapshotRef, subscribe]);

  sessionRef.current = session;

  useSessionEffects({
    snapshot,
    loadSession,
    onSessionCleared,
    events,
  });

  const value = useMemo<AuthContextValue>(() => ({
    snapshot,
    user: snapshot.status === "authenticated" ? snapshot.user : null,
    roles: snapshot.status === "authenticated" ? snapshot.roles : [],
    permissions: snapshot.status === "authenticated" ? snapshot.permissions : [],
    isAuthenticated: snapshot.status === "authenticated",
    isLoading: snapshot.status === "loading",
    platform,
    refresh,
    logout,
  }), [logout, platform, refresh, snapshot]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
