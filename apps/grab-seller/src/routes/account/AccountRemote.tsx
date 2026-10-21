import { useAuth } from "../../app/AuthContext";
import { useEntryLink } from "../../app/EntryLinkContext";
import { RemoteBoundary } from "../../components/RemoteBoundary";
import { useMerchantOnboardingEffect } from "../../hooks";

const loadSellerAccount = () => import("grab_seller_account/Routes");

export function AccountRemote() {
  const { platform } = useAuth();
  const merchantLink = useEntryLink("merchant");

  useMerchantOnboardingEffect();

  if (!merchantLink) {
    return null;
  }

  return (
    <RemoteBoundary
      loader={loadSellerAccount}
      label="Onboarding"
      remoteProps={{
        platform,
        link: merchantLink,
      }}
    />
  );
}
