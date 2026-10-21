import { useState, useRef, useCallback } from "react";
import { SessionSnapshot, User } from "@khinemyaezin/seller-contracts";
import { UserProfile } from "grab_seller_auth/compiled-types/features/auth/types";

export const profileToSnapshot = (profile: UserProfile): SessionSnapshot => {
  const { createdAt, ...user } = profile;
  return {
    status: "authenticated",
    user,
    roles: [],
    permissions: [],
  };
};

export function useSessionState() {
  const listenersRef = useRef(new Set<(snapshot: SessionSnapshot) => void>());
  const [snapshot, setSnapshot] = useState<SessionSnapshot>({ status: "loading" });
  const snapshotRef = useRef<SessionSnapshot>(snapshot);

  const publishSnapshot = useCallback((next: SessionSnapshot) => {
    snapshotRef.current = next;
    setSnapshot(next);
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
    snapshot,
    snapshotRef,
    publishSnapshot,
    subscribe,
  };
}
