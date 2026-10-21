import { useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import {
  type PlatformEvents,
  SessionSnapshot,
  routes,
} from "@khinemyaezin/seller-contracts";
import { RefreshCoordinator } from "../app/RefreshCoordinator";
import { profileToSnapshot } from "./use-session-state";
import { createAuthService } from "grab_seller_auth/AuthService";

type AuthService = ReturnType<typeof createAuthService> | null;

export function useSessionOperations({
  authService,
  publishSnapshot,
  snapshotRef,
  onSessionCleared,
  events,
}: {
  authService: AuthService;
  publishSnapshot: (next: SessionSnapshot) => void;
  snapshotRef: React.RefObject<SessionSnapshot>;
  onSessionCleared?: () => void;
  events: PlatformEvents;
}) {
  const navigate = useNavigate();
  const refreshCoordinatorRef = useRef(new RefreshCoordinator());

  const expireSession = useCallback(() => {
    const next: SessionSnapshot = { status: "anonymous" };
    publishSnapshot(next);
    onSessionCleared?.();
    events.emit("auth:session-expired:v1", {});
  }, [events, onSessionCleared, publishSnapshot]);

  const loadSession = useCallback(async () => {
    if (!authService) return snapshotRef.current;

    try {
      const profile = await authService.getProfile();
      const next = profileToSnapshot(profile);
      publishSnapshot(next);
      return next;
    } catch {
      const next: SessionSnapshot = { status: "anonymous" };
      publishSnapshot(next);
      return next;
    }
  }, [publishSnapshot, authService, snapshotRef]);

  const refresh = useCallback(() => refreshCoordinatorRef.current.run(async () => {
    if (!authService) {
      throw new Error("Identity module link is not available");
    }

    try {
      const profile = await authService.getProfile();
      const next = profileToSnapshot(profile);
      publishSnapshot(next);
      if (next.status === "authenticated") {
        events.emit("auth:session-refreshed:v1", {});
      } else {
        expireSession();
        throw new Error("Session refresh completed without an authenticated profile");
      }
    } catch (err) {
      expireSession();
      throw err;
    }
  }), [events, expireSession, authService, publishSnapshot]);

  const logout = useCallback(async () => {
    try {
      await authService?.logout();
    } catch (e) {
      console.warn("Logout request failed", e);
    } finally {
      publishSnapshot({ status: "anonymous" });
      onSessionCleared?.();
      events.emit("auth:logout:v1", {});
      navigate(routes.login, { replace: true });
    }
  }, [events, navigate, onSessionCleared, publishSnapshot, authService]);
  
  return {
    loadSession,
    expireSession,
    refresh,
    logout,
  };
}
