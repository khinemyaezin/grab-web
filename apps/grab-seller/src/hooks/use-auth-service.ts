import { useMemo } from "react";
import type { IdentityService, PlatformApiClient } from "@khinemyaezin/seller-contracts";
import { createIdentityService } from "@khinemyaezin/seller-api";
import { useEntryLink } from "../app/EntryLinkContext";

export function useAuthService(api: PlatformApiClient): IdentityService | null {
  const identityLink = useEntryLink("identity");

  const authService = useMemo(() => {
    if (!identityLink) return null;
    return createIdentityService(api, identityLink);
  }, [api, identityLink]);

  return authService;
}
