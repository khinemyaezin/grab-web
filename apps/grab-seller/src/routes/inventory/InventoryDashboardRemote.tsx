import { useAuth } from "../../app/AuthContext";
import { useEntryLink } from "../../app/EntryLinkContext";
import { RemoteBoundary } from "../../components/RemoteBoundary";

const loadInventoryDashboard = () => import("grab_seller_inventory/DashboardRoutes");

export function InventoryDashboardRemote() {
  const { platform } = useAuth();
  const inventoryLink = useEntryLink("inventory");

  if (!inventoryLink) {
    return null;
  }

  return (
    <RemoteBoundary
      loader={loadInventoryDashboard}
      label="Inventory"
      key="seller-inventory-dashboard"
      remoteProps={{
        platform,
        link: inventoryLink,
      }}
    />
  );
}
