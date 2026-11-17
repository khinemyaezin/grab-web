import { createRemoteConfig } from "../../tools/vite/create-remote-config.js";
import { DEFAULT_PORTS, REMOTE_DEFINITIONS } from "../../tools/vite/shared.js";

export default createRemoteConfig({
  name: REMOTE_DEFINITIONS.grab_seller_auth.name,
  port: DEFAULT_PORTS.auth,
  portEnvKey: REMOTE_DEFINITIONS.grab_seller_auth.portEnvKey,
  basePath: REMOTE_DEFINITIONS.grab_seller_auth.basePath,
  importMetaUrl: import.meta.url,
  exposes: {
    "./Routes": "./src/app/AuthRoutes.tsx",
    "./AuthService": "./src/features/auth/api/auth-service.facade.ts",
    "./UserMenuWidget": "./src/features/auth/components/user-menu-widget-exposed.tsx",
  },
});
