import { createRemoteConfig } from "../../tools/vite/create-remote-config.js";
import { DEFAULT_PORTS, REMOTE_DEFINITIONS } from "../../tools/vite/shared.js";

export default createRemoteConfig({
  name: REMOTE_DEFINITIONS.grab_seller_account.name,
  port: DEFAULT_PORTS.account,
  portEnvKey: REMOTE_DEFINITIONS.grab_seller_account.portEnvKey,
  basePath: REMOTE_DEFINITIONS.grab_seller_account.basePath,
  importMetaUrl: import.meta.url,
  exposes: {
    "./Routes": "./src/app/AppRoutes.tsx",
    "./StorefrontRoutes": "./src/app/StorefrontRoutes.tsx",
    "./Service": "./src/features/merchant/api/seller-account-service.ts",
  },
});
