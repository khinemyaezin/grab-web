import { ReactNode, useMemo, useRef, createContext, useContext } from "react";
import { useNavigate } from "react-router";
import { createApiClient, createHostEventBus } from "@khinemyaezin/seller-api";
import { PlatformProvider } from "@khinemyaezin/seller-ui";
import type {
  PlatformEvents,
  SellerRuntimeConfig,
  SessionApi,
  SellerPlatform,
} from "@khinemyaezin/seller-contracts";

export interface ShellPlatformContextValue {
  platform: SellerPlatform;
  sessionRef: React.RefObject<SessionApi>;
  events: PlatformEvents;
}

const SHELL_PLATFORM_CONTEXT_KEY = Symbol.for("@khinemyaezin/grab-seller/ShellPlatformContext");

export const ShellPlatformContext: React.Context<ShellPlatformContextValue | null> =
  (globalThis as any)[SHELL_PLATFORM_CONTEXT_KEY] ??
  ((globalThis as any)[SHELL_PLATFORM_CONTEXT_KEY] = createContext<ShellPlatformContextValue | null>(null));

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

  const sessionRef = useRef<SessionApi>({
    getSnapshot: () => ({ status: "anonymous" }),
    subscribe: () => () => {},
    refresh: async () => {},
    logout: async () => {},
  });

  const api = useMemo(() => createApiClient({
    baseUrl: runtimeConfig.apiBaseUrl,
    platform: { session: { refresh: () => sessionRef.current.refresh() } },
  }), [runtimeConfig.apiBaseUrl]);

  const events = useMemo<PlatformEvents>(() => createHostEventBus(), []);

  const session = useMemo<SessionApi>(() => ({
    getSnapshot: () => sessionRef.current.getSnapshot(),
    subscribe: (listener) => sessionRef.current.subscribe(listener),
    refresh: () => sessionRef.current.refresh(),
    logout: () => sessionRef.current.logout(),
  }), []);

  const platform = useMemo<SellerPlatform>(() => Object.freeze({
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
  }), [api, events, navigate, runtimeConfig, session]);

  const value = useMemo<ShellPlatformContextValue>(() => ({
    platform,
    sessionRef,
    events,
  }), [events, platform]);

  return (
    <PlatformProvider platform={platform}>
      <ShellPlatformContext.Provider value={value}>
        {children}
      </ShellPlatformContext.Provider>
    </PlatformProvider>
  );
}
