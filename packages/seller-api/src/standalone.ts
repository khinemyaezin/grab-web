import type { SellerPlatform, SessionApi } from "@khinemyaezin/seller-contracts";
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

  const session: SessionApi = {
    getSnapshot: () => ({
      status: "authenticated",
      user: {
        id: "standalone-dev",
        email: "dev@grab.com",
        name: "Dev User",
        accessContexts: [],
      },
      roles: ["SELLER", "ADMIN"],
      permissions: ["*"],
    }),
    subscribe: () => () => {},
    refresh: async () => {},
    logout: async () => {},
  };

  const api = createApiClient({
    baseUrl,
    getToken: options.getToken,
    platform: { session },
  });

  return Object.freeze({
    version: "1.0.0",
    session,
    events: createHostEventBus(),
    navigation: {
      navigate: options.onNavigate ?? ((path, opts) => console.log("[Standalone Navigate]", path, opts)),
    },
    config: {
      appName: options.appName ?? "Standalone App",
      apiBaseUrl: baseUrl,
    } as any,
    api,
  });
}
