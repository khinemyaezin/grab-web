import { useMemo } from "react";
import { useEntryLink } from "../app/EntryLinkContext";
import { createSellerAccountService, SellerAccountServiceFacade } from "grab_seller_account/Service";

export function useSellerAccountService(): SellerAccountServiceFacade | null {
  const merchantLink = useEntryLink("merchant");

  const sellerAccountService = useMemo(() => {
    if (!merchantLink) return null;
    return createSellerAccountService(merchantLink);
  }, [merchantLink]);

  return sellerAccountService;
}
