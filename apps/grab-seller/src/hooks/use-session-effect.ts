import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { type PlatformEvents, SessionSnapshot, routes } from "@khinemyaezin/seller-contracts";

const GLOBAL_SCOPE_KEY = "*";

const isAuthPath = (pathname: string) => {
  const normalized = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  return (
    normalized === routes.login ||
    normalized.startsWith(`${routes.login}/`) ||
    normalized === routes.register ||
    normalized.startsWith(`${routes.register}/`)
  );
};

const currentPath = (location: ReturnType<typeof useLocation>) =>
  `${location.pathname}${location.search}${location.hash}`;

export function useSessionEffects({
  snapshot,
  loadSession,
  refresh,
  onSessionCleared,
  events,
}: {
  snapshot: SessionSnapshot;
  loadSession: (signal?: AbortSignal) => Promise<SessionSnapshot>;
  refresh: () => Promise<void>;
  onSessionCleared?: () => void;
  events: PlatformEvents;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const bootstrappedRef = useRef(false);

  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;
    const controller = new AbortController();
    void loadSession(controller.signal);
    return () => {
      bootstrappedRef.current = false;
      controller.abort();
    };
  }, [loadSession]);

  useEffect(() => {
    let lastVisibilityRefresh = 0;
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && snapshot.status === "authenticated") {
        const now = Date.now();
        if (now - lastVisibilityRefresh > 30_000) {
          lastVisibilityRefresh = now;
          void refresh().catch((err) => {
            console.warn("[Session] Tab revalidation failed", err);
          });
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [refresh, snapshot.status]);

  useEffect(() => {
    if (snapshot.status === "anonymous" && !isAuthPath(location.pathname)) {
      navigate(`/${routes.login}`, {
        replace: true,
        state: { from: currentPath(location) },
      });
      return;
    }

    if (snapshot.status === "authenticated") {
      const nonGlobalContexts = snapshot.user.accessContexts.filter(
        (ctx) => ctx.scopeId !== GLOBAL_SCOPE_KEY,
      );

      if (nonGlobalContexts.length === 0) {
        if (!location.pathname.startsWith("/onboarding")) {
          navigate("/onboarding", { replace: true });
        }
      } else if (isAuthPath(location.pathname)) {
        navigate("", { replace: true });
      }
    }
  }, [location, navigate, snapshot]);

  useEffect(() => {
    const handleAuthRedirect = (next: SessionSnapshot) => {
      if (next.status === "authenticated") {
        const nonGlobalContexts = next.user.accessContexts.filter(
          (ctx) => ctx.scopeId !== GLOBAL_SCOPE_KEY,
        );

        if (nonGlobalContexts.length === 0) {
          navigate("/onboarding", { replace: true });
        } else {
          navigate("", { replace: true });
        }
      }
    };

    const unsubAccessContextOnSelect = events.subscribe("auth:context-selected:v1", () => {
      onSessionCleared?.();
      events.clear();
      void loadSession().then(handleAuthRedirect);
    });

    return () => {
      unsubAccessContextOnSelect();
    };
  }, [events, loadSession, navigate, onSessionCleared]);
}
