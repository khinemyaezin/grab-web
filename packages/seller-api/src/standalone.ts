import type {
  SellerPlatform,
  SellerRuntimeConfig,
  SessionApi,
  SessionSnapshot,
} from "@khinemyaezin/seller-contracts";
import { createApiClient } from "./client.js";
import { createHostEventBus } from "./events/index.js";

export type StandalonePlatformOptions = {
  baseUrl?: string;
  appName?: string;
  getToken?: () => string | undefined | Promise<string | undefined>;
  onNavigate?: (path: string, options?: { replace?: boolean }) => void;
};

export function createStandalonePlatform(options: StandalonePlatformOptions = {}): SellerPlatform {
  const baseUrl = options.baseUrl ?? "/api/v1";

  let currentSnapshot: SessionSnapshot = {
    status: "authenticated",
    user: {
      id: "standalone-dev",
      email: "dev@grab.com",
      name: "Dev User",
      accessContexts: [],
    },
    roles: ["SELLER", "ADMIN"],
    permissions: ["*"],
  };

  const listeners = new Set<(snapshot: SessionSnapshot) => void>();

  const publish = (next: SessionSnapshot) => {
    currentSnapshot = next;
    for (const listener of listeners) {
      try {
        listener(next);
      } catch (e) {
        console.error("[StandalonePlatform] Session subscriber error", e);
      }
    }
  };

  const session: SessionApi = {
    getSnapshot: () => currentSnapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    refresh: async () => {
      publish({
        status: "authenticated",
        user: {
          id: "standalone-dev",
          email: "dev@grab.com",
          name: "Dev User",
          accessContexts: [],
        },
        roles: ["SELLER", "ADMIN"],
        permissions: ["*"],
      });
    },
    expire: () => {
      publish({ status: "anonymous" });
    },
    logout: async () => {
      publish({ status: "anonymous" });
    },
  };

  const api = createApiClient({
    baseUrl,
    getToken: options.getToken,
    platform: { session },
  });

  const config: Readonly<SellerRuntimeConfig> = {
    appName: options.appName ?? "Standalone App",
    apiBaseUrl: baseUrl,
  };

  return Object.freeze({
    version: "1.0.0",
    session,
    events: createHostEventBus(),
    navigation: {
      navigate:
        options.onNavigate ??
        ((path, opts) => {
          console.warn("[Standalone Navigate]", path, opts);
        }),
    },
    config,
    api,
  });
}
