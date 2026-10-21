import { useAuth } from "../../app/AuthContext";
import { useEntryLink } from "../../app/EntryLinkContext";
import { RemoteBoundary } from "../../components/RemoteBoundary";

const loadInventoryStock = () => import("grab_seller_inventory/StockRoutes");

export function InventoryStockRemote() {
  const { platform } = useAuth();
  const inventoryLink = useEntryLink("inventory");
  const catalogLink = useEntryLink("catalog");

  if (!inventoryLink) {
    return null;
  }

  return (
    <RemoteBoundary
      loader={loadInventoryStock}
      label="Stock"
      key="seller-inventory-stock"
      remoteProps={{
        platform,
        link: inventoryLink,
        catalogLink,
      }}
    />
  );
}
