import { useRef, useCallback } from "react";
import type { IdentityProfile, SessionSnapshot, SessionUser } from "@khinemyaezin/seller-contracts";

export const profileToSnapshot = (profile: IdentityProfile): SessionSnapshot => {
  const user: SessionUser = {
    id: profile.id,
    email: profile.email,
    name: profile.name || "",
    avatar: profile.avatar,
    accessContexts: profile.accessContexts,
    currentAccessContext: profile.currentAccessContext,
  };
  return {
    status: "authenticated",
    user,
    roles: profile.roles || [],
    permissions: profile.permissions || [],
  };
};

export function useSessionState() {
  const listenersRef = useRef(new Set<(snapshot: SessionSnapshot) => void>());
  const snapshotRef = useRef<SessionSnapshot>({ status: "loading" });

  const publishSnapshot = useCallback((next: SessionSnapshot) => {
    snapshotRef.current = next;
    for (const listener of listenersRef.current) {
      try {
        listener(next);
      } catch (error) {
        console.error("[SellerPlatform] Session subscriber failed", error);
      }
    }
  }, []);

  const subscribe = useCallback((listener: (snapshot: SessionSnapshot) => void) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  return {
    snapshotRef,
    publishSnapshot,
    subscribe,
  };
}
