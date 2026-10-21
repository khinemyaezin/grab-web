import type { ReactNode } from "react";
import { EntryLinkProvider, PlatformProvider } from "@khinemyaezin/seller-ui";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { SellerPlatform } from "@khinemyaezin/seller-contracts";

import { SalesChannelLinkProvider } from "@/features/inventory/api/sales-channel-link";

export default function InventoryProviders({
  link,
  platform,
  salesChannelLink,
  children,
}: {
  link: HateoasLink;
  platform?: SellerPlatform;
  salesChannelLink?: HateoasLink | null;
  children: ReactNode;
}) {
  return (
    <div className="seller-inventory-mfe">
      <PlatformProvider platform={platform}>
        <EntryLinkProvider link={link}>
          <SalesChannelLinkProvider link={salesChannelLink}>
            {children}
          </SalesChannelLinkProvider>
        </EntryLinkProvider>
      </PlatformProvider>
    </div>
  );
}
