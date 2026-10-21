import { useMemo } from "react";
import { useEntryLink } from "../app/EntryLinkContext";
import { createAuthService } from "grab_seller_auth/AuthService";

export function useAuthService() {
  const identityLink = useEntryLink("identity");

  const authService = useMemo(() => {
    if (!identityLink) return null;
    return createAuthService(identityLink);
  }, [identityLink]);

  return authService;
}
