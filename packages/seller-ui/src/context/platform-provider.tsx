import { createContext, ReactNode, useContext } from "react";
import type { SellerPlatform } from "@khinemyaezin/seller-contracts";

const PlatformContext = createContext<SellerPlatform | null>(null);

function PlatformProvider({ platform, children }: { platform?: SellerPlatform, children: ReactNode }) {
  return (
    <PlatformContext.Provider value={platform ?? null}>
      {children}
    </PlatformContext.Provider>
  );
}

function usePlatform() {
  return useContext(PlatformContext);
}

export { PlatformProvider, usePlatform };
