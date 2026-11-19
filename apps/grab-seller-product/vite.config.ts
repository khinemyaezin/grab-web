import { createRemoteConfig } from "../../tools/vite/create-remote-config.js";
import { DEFAULT_PORTS, REMOTE_DEFINITIONS } from "../../tools/vite/shared.js";

export default createRemoteConfig({
  name: REMOTE_DEFINITIONS.grab_seller_product.name,
  port: DEFAULT_PORTS.product,
  portEnvKey: REMOTE_DEFINITIONS.grab_seller_product.portEnvKey,
  basePath: REMOTE_DEFINITIONS.grab_seller_product.basePath,
  importMetaUrl: import.meta.url,
  exposes: {
    "./Routes": "./src/app/AppRoutes.tsx",
  },
});
