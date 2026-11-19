import type {
  PlatformApiClient,
  PlatformEvents,
  PlatformNavigation,
  SellerPlatform,
  SellerRuntimeConfig,
  SessionApi,
  SessionSnapshot,
} from "@khinemyaezin/seller-contracts";

export interface MockPlatformOptions {
  session?: Partial<SessionApi>;
  events?: Partial<PlatformEvents>;
  navigation?: Partial<PlatformNavigation>;
  config?: Partial<SellerRuntimeConfig>;
  api?: PlatformApiClient;
  initialSnapshot?: SessionSnapshot;
}

export function createMockPlatform(options: MockPlatformOptions = {}): SellerPlatform {
  let snapshot: SessionSnapshot = options.initialSnapshot ?? {
    status: "authenticated",
    user: {
      id: "test-user-1",
      email: "seller@test.com",
      name: "Test Seller",
      accessContexts: [],
    },
    roles: ["SELLER"],
    permissions: ["*"],
  };

  const listeners = new Set<(snap: SessionSnapshot) => void>();

  const session: SessionApi = {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    refresh: async () => {},
    expire: () => {
      snapshot = { status: "anonymous" };
      listeners.forEach((l) => l(snapshot));
    },
    logout: async () => {
      snapshot = { status: "anonymous" };
      listeners.forEach((l) => l(snapshot));
    },
    ...options.session,
  };

  const events: PlatformEvents = {
    emit: () => {},
    setState: () => {},
    subscribe: () => () => {},
    getSnapshot: () => undefined,
    clear: () => {},
    ...options.events,
  };

  const navigation: PlatformNavigation = {
    navigate: () => {},
    ...options.navigation,
  };

  const config: Readonly<SellerRuntimeConfig> = {
    appName: "Test App",
    apiBaseUrl: "/api",
    ...options.config,
  };

  const defaultApi: PlatformApiClient = {
    get: async () => ({}) as any,
    post: async () => ({}) as any,
    put: async () => ({}) as any,
    patch: async () => ({}) as any,
    delete: async () => ({}) as any,
    followLink: async () => ({}) as any,
  };

  const api: PlatformApiClient =
    "api" in options && options.api !== undefined
      ? options.api
      : "api" in options
        ? (options.api as unknown as PlatformApiClient)
        : defaultApi;

  return Object.freeze({
    version: "1.0.0",
    session,
    events,
    navigation,
    config,
    api,
  });
}
