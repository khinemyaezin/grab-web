import { createContext, ReactNode, useContext } from "react";
import type { PlatformApiClient, SellerPlatform } from "@khinemyaezin/seller-contracts";

const PLATFORM_CONTEXT_KEY = Symbol.for("@khinemyaezin/seller-ui/PlatformContext");

const PlatformContext: React.Context<SellerPlatform | null> =
  (globalThis as any)[PLATFORM_CONTEXT_KEY] ??
  ((globalThis as any)[PLATFORM_CONTEXT_KEY] = createContext<SellerPlatform | null>(null));

function PlatformProvider({
  platform,
  children,
}: {
  platform?: SellerPlatform;
  children: ReactNode;
}) {
  const parentPlatform = useContext(PlatformContext);
  const isDev =
    typeof globalThis !== "undefined" &&
    (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
      ?.NODE_ENV !== "production";

  if (parentPlatform && platform && parentPlatform !== platform && isDev) {
    console.warn(
      "[PlatformProvider] Overriding existing parent platform in nested PlatformProvider. " +
        "Ensure this override is intentional (e.g. isolated test or preview boundary).",
    );
  }
  const resolved = platform ?? parentPlatform ?? null;
  return <PlatformContext.Provider value={resolved}>{children}</PlatformContext.Provider>;
}

function usePlatform() {
  return useContext(PlatformContext);
}

function useRequiredPlatform(): SellerPlatform {
  const platform = useContext(PlatformContext);
  if (!platform) {
    throw new Error("useRequiredPlatform must be used within a PlatformProvider");
  }
  return platform;
}

function useApi(): PlatformApiClient {
  const platform = useContext(PlatformContext);
  if (!platform?.api) {
    throw new Error("useApi must be used within a PlatformProvider supplying platform.api");
  }
  return platform.api;
}

export { PlatformProvider, usePlatform, useRequiredPlatform, useApi };
