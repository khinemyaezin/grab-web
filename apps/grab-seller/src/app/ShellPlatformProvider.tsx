import { ReactNode, useMemo, useRef, createContext, useContext } from "react";
import { useNavigate } from "react-router";
import { createApiClient, createHostEventBus } from "@khinemyaezin/seller-api";
import { PlatformProvider } from "@khinemyaezin/seller-ui";
import type {
  PlatformEvents,
  SellerRuntimeConfig,
  SessionApi,
  SessionSnapshot,
  SellerPlatform,
} from "@khinemyaezin/seller-contracts";

export type ShellSessionBridge = React.MutableRefObject<SessionApi | null>;

export interface ShellPlatformContextValue {
  sessionBridge: ShellSessionBridge;
  events: PlatformEvents;
}

const SHELL_PLATFORM_CONTEXT_KEY = Symbol.for("@khinemyaezin/grab-seller/ShellPlatformContext");

const INITIAL_SESSION_SNAPSHOT: SessionSnapshot = { status: "loading" };

export const ShellPlatformContext: React.Context<ShellPlatformContextValue | null> =
  (globalThis as any)[SHELL_PLATFORM_CONTEXT_KEY] ??
  ((globalThis as any)[SHELL_PLATFORM_CONTEXT_KEY] =
    createContext<ShellPlatformContextValue | null>(null));

export function useShellPlatform(): ShellPlatformContextValue {
  const ctx = useContext(ShellPlatformContext);
  if (!ctx) {
    throw new Error("useShellPlatform must be used within ShellPlatformProvider");
  }
  return ctx;
}

export function ShellPlatformProvider({
  runtimeConfig,
  children,
}: {
  runtimeConfig: Readonly<SellerRuntimeConfig>;
  children: ReactNode;
}) {
  const navigate = useNavigate();

  const sessionBridge = useRef<SessionApi | null>(null);

  const session = useMemo<SessionApi>(
    () => ({
      getSnapshot: () => sessionBridge.current?.getSnapshot() ?? INITIAL_SESSION_SNAPSHOT,
      subscribe: (listener) => sessionBridge.current?.subscribe(listener) ?? (() => {}),
      refresh: () => (sessionBridge.current ? sessionBridge.current.refresh() : Promise.resolve()),
      expire: (reason) => sessionBridge.current?.expire(reason),
      logout: () => (sessionBridge.current ? sessionBridge.current.logout() : Promise.resolve()),
    }),
    [],
  );

  const api = useMemo(
    () =>
      createApiClient({
        baseUrl: runtimeConfig.apiBaseUrl,
        platform: {
          session: {
            refresh: () => session.refresh(),
            expire: (reason) => session.expire(reason),
          },
        },
      }),
    [runtimeConfig.apiBaseUrl, session],
  );

  const events = useMemo<PlatformEvents>(() => createHostEventBus(), []);

  const platform = useMemo<SellerPlatform>(
    () =>
      Object.freeze({
        version: "1.0.0",
        session,
        events,
        navigation: {
          navigate(path: string, options?: { replace?: boolean }) {
            navigate(path, { replace: options?.replace });
          },
        },
        config: runtimeConfig,
        api,
      }),
    [api, events, navigate, runtimeConfig, session],
  );

  const value = useMemo<ShellPlatformContextValue>(
    () => ({
      sessionBridge,
      events,
    }),
    [events],
  );

  return (
    <PlatformProvider platform={platform}>
      <ShellPlatformContext.Provider value={value}>{children}</ShellPlatformContext.Provider>
    </PlatformProvider>
  );
}
