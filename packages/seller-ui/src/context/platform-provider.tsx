import { createContext, ReactNode, useContext } from "react";
import type { PlatformApiClient, SellerPlatform } from "@khinemyaezin/seller-contracts";

const PLATFORM_CONTEXT_KEY = Symbol.for("@khinemyaezin/seller-ui/PlatformContext");

const PlatformContext: React.Context<SellerPlatform | null> =
  (globalThis as any)[PLATFORM_CONTEXT_KEY] ??
  ((globalThis as any)[PLATFORM_CONTEXT_KEY] = createContext<SellerPlatform | null>(null));

function PlatformProvider({ platform, children }: { platform?: SellerPlatform; children: ReactNode }) {
  const parentPlatform = useContext(PlatformContext);
  const resolved = platform ?? parentPlatform ?? null;
  return (
    <PlatformContext.Provider value={resolved}>
      {children}
    </PlatformContext.Provider>
  );
}

function usePlatform() {
  return useContext(PlatformContext);
}

function useApi(): PlatformApiClient {
  const platform = useContext(PlatformContext);
  if (!platform?.api) {
    throw new Error("useApi must be used within a PlatformProvider supplying platform.api");
  }
  return platform.api;
}

export { PlatformProvider, usePlatform, useApi };
