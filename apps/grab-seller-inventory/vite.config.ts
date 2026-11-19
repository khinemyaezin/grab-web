import { createRemoteConfig } from "../../tools/vite/create-remote-config.js";
import { DEFAULT_PORTS, REMOTE_DEFINITIONS } from "../../tools/vite/shared.js";

export default createRemoteConfig({
  name: REMOTE_DEFINITIONS.grab_seller_inventory.name,
  port: DEFAULT_PORTS.inventory,
  portEnvKey: REMOTE_DEFINITIONS.grab_seller_inventory.portEnvKey,
  basePath: REMOTE_DEFINITIONS.grab_seller_inventory.basePath,
  importMetaUrl: import.meta.url,
  extraShared: {
    recharts: { singleton: true },
  },
  exposes: {
    "./DashboardRoutes": "./src/app/DashboardRoutes.tsx",
    "./LocationRoutes": "./src/app/LocationRoutes.tsx",
    "./StockRoutes": "./src/app/StockRoutes.tsx",
    "./ProductInventoryWidget": "./src/features/inventory/widgets/inventory-create-widget.tsx",
    "./InventoryItemEditWidget": "./src/features/inventory/widgets/inventory-edit-widget.tsx",
  },
});
