import { createRemoteConfig } from "../../tools/vite/create-remote-config.js";
import { DEFAULT_PORTS, REMOTE_DEFINITIONS } from "../../tools/vite/shared.js";

export default createRemoteConfig({
  name: REMOTE_DEFINITIONS.grab_seller_pricing.name,
  port: DEFAULT_PORTS.pricing,
  portEnvKey: REMOTE_DEFINITIONS.grab_seller_pricing.portEnvKey,
  basePath: REMOTE_DEFINITIONS.grab_seller_pricing.basePath,
  importMetaUrl: import.meta.url,
  exposes: {
    "./Routes": "./src/app/Routes.tsx",
    "./PricingCreateWidget": "./src/features/pricing/widgets/pricing-create-widget.tsx",
    "./PricingEditWidget": "./src/features/pricing/widgets/pricing-edit-widget.tsx",
  },
});
