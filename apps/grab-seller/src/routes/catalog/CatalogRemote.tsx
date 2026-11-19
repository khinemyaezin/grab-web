import { useAuth } from "../../app/AuthContext";
import { useEntryLink } from "../../app/EntryLinkContext";
import { RemoteBoundary } from "../../components/RemoteBoundary";
import { useProductExtensions } from "./use-product-extensions";

const loadSellerProduct = () => import("grab_seller_product/Routes");

export function CatalogRemote() {
  const { platform } = useAuth();
  const catalogLink = useEntryLink("catalog");
  const pricingLink = useEntryLink("pricing");
  const inventoryLink = useEntryLink("inventory");
  const salesChannelLink = useEntryLink("salesChannel");

  const extensions = useProductExtensions({
    platform,
    pricingLink,
    inventoryLink,
  });

  if (!catalogLink) {
    return null;
  }

  return (
    <RemoteBoundary
      loader={loadSellerProduct}
      label="Products"
      key="seller-product"
      remoteProps={{
        platform,
        link: catalogLink,
        extensions,
        salesChannelLink,
      }}
    />
  );
}
