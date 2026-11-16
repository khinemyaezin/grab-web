import { useMemo } from "react";
import { useApi } from "@khinemyaezin/seller-ui";
import { useEntryLink } from "../app/EntryLinkContext";
import { useAuth } from "../app/AuthContext";
import { createSellerAccountService, SellerAccountServiceFacade } from "grab_seller_account/Service";

export function useSellerAccountService(): SellerAccountServiceFacade | null {
  const api = useApi();
  const merchantLink = useEntryLink("merchant");
  const { snapshot } = useAuth();
  const merchantId = snapshot.status === "authenticated"
    ? snapshot.user.currentAccessContext?.scopeId
    : undefined;

  const sellerAccountService = useMemo(() => {
    if (!merchantLink) return null;
    return createSellerAccountService(api, merchantLink, merchantId);
  }, [api, merchantId, merchantLink]);

  return sellerAccountService;
}
