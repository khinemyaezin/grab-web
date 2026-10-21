import { useAuth } from "../../app/AuthContext";
import { useEntryLink } from "../../app/EntryLinkContext";
import { RemoteBoundary } from "../../components/RemoteBoundary";

const loadInventoryLocations = () => import("grab_seller_inventory/LocationRoutes");

export function InventoryLocationsRemote() {
  const { platform } = useAuth();
  const inventoryLink = useEntryLink("inventory");
  const salesChannelLink = useEntryLink("salesChannel");

  if (!inventoryLink) {
    return null;
  }

  return (
    <RemoteBoundary
      loader={loadInventoryLocations}
      label="Locations"
      key="seller-inventory-locations"
      remoteProps={{
        platform,
        link: inventoryLink,
        salesChannelLink,
      }}
    />
  );
}
