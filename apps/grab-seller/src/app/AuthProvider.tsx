import { ReactNode, useLayoutEffect, useMemo } from "react";
import type { SessionApi } from "@khinemyaezin/seller-contracts";
import { useRequiredPlatform, useSessionSnapshot } from "@khinemyaezin/seller-ui";

import { AuthContextValue, AuthContext } from "./AuthContext";
import { useAuthService, useSessionEffects, useSessionOperations, useSessionState } from "../hooks";
import { useShellPlatform } from "./ShellPlatformProvider";

export function AuthProvider({
  children,
  onSessionCleared,
}: {
  children: ReactNode;
  onSessionCleared?: () => void;
}) {
  const platform = useRequiredPlatform();
  const { sessionBridge, events } = useShellPlatform();

  if (!platform.api) {
    throw new Error("AuthProvider requires platform.api to be defined");
  }

  const authService = useAuthService(platform.api);
  const { snapshotRef, publishSnapshot, subscribe } = useSessionState();

  const { loadSession, expireSession, refresh, logout } = useSessionOperations({
    authService,
    publishSnapshot,
    snapshotRef,
    onSessionCleared,
    events,
  });

  const session = useMemo<SessionApi>(
    () => ({
      getSnapshot: () => snapshotRef.current,
      subscribe,
      refresh,
      expire: expireSession,
      logout,
    }),
    [expireSession, logout, refresh, snapshotRef, subscribe],
  );

  useLayoutEffect(() => {
    sessionBridge.current = session;
  }, [session, sessionBridge]);

  const snapshot = useSessionSnapshot();

  useSessionEffects({
    snapshot,
    loadSession,
    refresh,
    onSessionCleared,
    events,
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      snapshot,
      user: snapshot.status === "authenticated" ? snapshot.user : null,
      roles: snapshot.status === "authenticated" ? snapshot.roles : [],
      permissions: snapshot.status === "authenticated" ? snapshot.permissions : [],
      isAuthenticated: snapshot.status === "authenticated",
      isLoading: snapshot.status === "loading",
      platform,
      refresh,
      logout,
    }),
    [logout, platform, refresh, snapshot],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
