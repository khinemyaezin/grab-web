import { useAuth } from "../../app/AuthContext";
import { useEntryLink } from "../../app/EntryLinkContext";
import { RemoteBoundary } from "../../components/RemoteBoundary";

const loadAuth = () => import("grab_seller_auth/Routes");

export function AuthRemote() {
  const { platform } = useAuth();
  const identityLink = useEntryLink("identity");

  if (!identityLink) {
    return null;
  }

  return (
    <RemoteBoundary
      key="seller-auth"
      loader={loadAuth}
      label="Auth"
      remoteProps={{
        platform,
        link: identityLink,
      }}
    />
  );
}
