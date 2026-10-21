import { useAuth } from "../../app/AuthContext";
import { useEntryLink } from "../../app/EntryLinkContext";
import { RemoteBoundary } from "../../components/RemoteBoundary";

const loadStorefronts = () => import("grab_seller_account/StorefrontRoutes");

export function StorefrontRemote() {
  const { platform } = useAuth();
  const merchantLink = useEntryLink("merchant");

  if (!merchantLink) {
    return null;
  }

  return (
    <RemoteBoundary
      loader={loadStorefronts}
      label="Storefronts"
      key="seller-account-storefronts"
      remoteProps={{
        platform,
        link: merchantLink,
      }}
    />
  );
}
