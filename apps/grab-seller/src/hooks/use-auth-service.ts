import { useMemo } from "react";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import { useEntryLink } from "../app/EntryLinkContext";
import { createAuthService } from "grab_seller_auth/AuthService";

export function useAuthService(api: PlatformApiClient) {
  const identityLink = useEntryLink("identity");

  const authService = useMemo(() => {
    if (!identityLink) return null;
    return createAuthService(api, identityLink);
  }, [api, identityLink]);

  return authService;
}
