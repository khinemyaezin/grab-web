import { useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import {
  type IdentityService,
  type PlatformEvents,
  type SessionExpiredReason,
  SessionSnapshot,
  routes,
} from "@khinemyaezin/seller-contracts";
import { RefreshCoordinator } from "../app/RefreshCoordinator";
import { profileToSnapshot } from "./use-session-state";

type AuthService = IdentityService | null;

export function useSessionOperations({
  authService,
  publishSnapshot,
  snapshotRef,
  onSessionCleared,
  events,
  retryDelayMs = typeof globalThis !== "undefined" &&
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
    ?.NODE_ENV === "test"
    ? 10
    : 1000,
}: {
  authService: AuthService;
  publishSnapshot: (next: SessionSnapshot) => void;
  snapshotRef: React.RefObject<SessionSnapshot>;
  onSessionCleared?: () => void;
  events: PlatformEvents;
  retryDelayMs?: number;
}) {
  const navigate = useNavigate();
  const refreshCoordinatorRef = useRef(new RefreshCoordinator());
  const inFlightLoadRef = useRef<Promise<SessionSnapshot> | null>(null);

  const expireSession = useCallback(
    (reason?: SessionExpiredReason) => {
      if (snapshotRef.current?.status === "anonymous") {
        return;
      }
      const next: SessionSnapshot = { status: "anonymous" };
      publishSnapshot(next);
      onSessionCleared?.();
      events.emit("auth:session-expired:v1", { reason: reason ?? "unauthorized" });
    },
    [events, onSessionCleared, publishSnapshot, snapshotRef],
  );

  const loadSession = useCallback(
    async (signal?: AbortSignal) => {
      if (!authService) return snapshotRef.current;

      if (!inFlightLoadRef.current) {
        inFlightLoadRef.current = (async () => {
          let attempt = 0;
          const maxRetries = 2;
          while (attempt <= maxRetries) {
            try {
              const profile = await authService.getProfile();
              return profileToSnapshot(profile);
            } catch (err: unknown) {
              const status = (err as { status?: number })?.status;
              if (status === 401 || status === 403) {
                return { status: "anonymous" as const };
              }
              attempt++;
              if (attempt > maxRetries) {
                console.warn(
                  "[Session] Transient error during session load; keeping current state",
                  err,
                );
                return snapshotRef.current;
              }
              await new Promise<void>((resolve) => setTimeout(resolve, retryDelayMs * attempt));
            }
          }
          return snapshotRef.current;
        })().finally(() => {
          inFlightLoadRef.current = null;
        });
      }

      try {
        const next = await inFlightLoadRef.current;
        if (signal?.aborted) return snapshotRef.current;
        publishSnapshot(next);
        return next;
      } catch {
        if (signal?.aborted) return snapshotRef.current;
        return snapshotRef.current;
      }
    },
    [authService, publishSnapshot, retryDelayMs, snapshotRef],
  );

  const refresh = useCallback(
    () =>
      refreshCoordinatorRef.current.run(async () => {
        if (!authService) {
          throw new Error("Identity module link is not available");
        }

        try {
          await authService.refreshToken();
          const profile = await authService.getProfile();
          const next = profileToSnapshot(profile);
          publishSnapshot(next);
          if (next.status === "authenticated") {
            events.emit("auth:session-refreshed:v1", {});
          } else {
            expireSession("refresh-failed");
            throw new Error("Session refresh completed without an authenticated profile");
          }
        } catch (err: unknown) {
          const status = (err as { status?: number })?.status;
          if (status === 401 || status === 403) {
            expireSession("refresh-failed");
          }
          throw err;
        }
      }),
    [events, expireSession, authService, publishSnapshot],
  );

  const logout = useCallback(async () => {
    try {
      await authService?.logout();
    } catch (e) {
      console.warn("Logout request failed", e);
    } finally {
      publishSnapshot({ status: "anonymous" });
      onSessionCleared?.();
      events.emit("auth:logout:v1", {});
      navigate(`/${routes.login}`, { replace: true });
    }
  }, [events, navigate, onSessionCleared, publishSnapshot, authService]);

  return {
    loadSession,
    expireSession,
    refresh,
    logout,
  };
}
