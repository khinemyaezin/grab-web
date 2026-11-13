import { useMemo } from "react";
import { useEntryLink } from "../app/EntryLinkContext";
import { useAuth } from "../app/AuthContext";
import { createSellerAccountService, SellerAccountServiceFacade } from "grab_seller_account/Service";

export function useSellerAccountService(): SellerAccountServiceFacade | null {
  const merchantLink = useEntryLink("merchant");
  const { snapshot } = useAuth();
  const merchantId = snapshot.status === "authenticated"
    ? snapshot.user.currentAccessContext?.scopeId
    : undefined;

  const sellerAccountService = useMemo(() => {
    if (!merchantLink) return null;
    return createSellerAccountService(merchantLink, merchantId);
  }, [merchantId, merchantLink]);

  return sellerAccountService;
}
