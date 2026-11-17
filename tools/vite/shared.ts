/**
 * Shared Module Federation and Vite configuration constants and helpers.
 * Kept in sync with scripts/mf-types.mjs and compose.yaml.
 */

export const DEFAULT_PORTS = {
  seller: 3000,
  product: 3001,
  inventory: 3002,
  auth: 3003,
  account: 3004,
  pricing: 3005,
} as const;

export const SHARED_DEPENDENCIES = {
  react: { singleton: true, requiredVersion: "19.2.4" },
  "react-dom": { singleton: true, requiredVersion: "19.2.4" },
  "react-router": { singleton: true, requiredVersion: "7.18.0" },
  "react-hook-form": { singleton: true, requiredVersion: "7.74.0" },
  "@tanstack/react-query": { singleton: true, requiredVersion: "5.99.2" },
  "@khinemyaezin/seller-api": { singleton: true },
  "@khinemyaezin/seller-ui": { singleton: true },
  "@khinemyaezin/seller-contracts": { singleton: true },
} as const;

export interface RemoteDefinition {
  readonly name: string;
  readonly envKey: string;
  readonly portEnvKey: string;
  readonly port: number;
  readonly basePath: string;
  readonly manifestPath: string;
  readonly defaultUrl: string;
}

export const REMOTE_DEFINITIONS = {
  grab_seller_auth: {
    name: "grab_seller_auth",
    envKey: "MF_AUTH_TYPES_URL",
    portEnvKey: "AUTH_PORT",
    port: DEFAULT_PORTS.auth,
    basePath: "/mfe/seller-auth/",
    manifestPath: "/mfe/seller-auth/mf-manifest.json",
    defaultUrl: `http://localhost:${DEFAULT_PORTS.auth}/@mf-types.d.ts`,
  },
  grab_seller_account: {
    name: "grab_seller_account",
    envKey: "MF_ACCOUNT_TYPES_URL",
    portEnvKey: "ACCOUNT_PORT",
    port: DEFAULT_PORTS.account,
    basePath: "/mfe/seller-account/",
    manifestPath: "/mfe/seller-account/mf-manifest.json",
    defaultUrl: `http://localhost:${DEFAULT_PORTS.account}/@mf-types.d.ts`,
  },
  grab_seller_product: {
    name: "grab_seller_product",
    envKey: "MF_PRODUCT_TYPES_URL",
    portEnvKey: "PRODUCT_PORT",
    port: DEFAULT_PORTS.product,
    basePath: "/mfe/seller-product/",
    manifestPath: "/mfe/seller-product/mf-manifest.json",
    defaultUrl: `http://localhost:${DEFAULT_PORTS.product}/@mf-types.d.ts`,
  },
  grab_seller_inventory: {
    name: "grab_seller_inventory",
    envKey: "MF_INVENTORY_TYPES_URL",
    portEnvKey: "INVENTORY_PORT",
    port: DEFAULT_PORTS.inventory,
    basePath: "/mfe/seller-inventory/",
    manifestPath: "/mfe/seller-inventory/mf-manifest.json",
    defaultUrl: `http://localhost:${DEFAULT_PORTS.inventory}/@mf-types.d.ts`,
  },
  grab_seller_pricing: {
    name: "grab_seller_pricing",
    envKey: "MF_PRICING_TYPES_URL",
    portEnvKey: "PRICING_PORT",
    port: DEFAULT_PORTS.pricing,
    basePath: "/mfe/seller-pricing/",
    manifestPath: "/mfe/seller-pricing/mf-manifest.json",
    defaultUrl: `http://localhost:${DEFAULT_PORTS.pricing}/@mf-types.d.ts`,
  },
} as const;

export type RemoteName = keyof typeof REMOTE_DEFINITIONS;

export const toTypeUrls = (value: string, envKey: string) => {
  if (value.endsWith(".zip")) {
    return { api: value.replace(/\.zip$/, ".d.ts"), zip: value };
  }
  if (value.endsWith(".d.ts")) {
    return { api: value, zip: value.replace(/\.d\.ts$/, ".zip") };
  }
  throw new Error(
    `${envKey} must point to an @mf-types.d.ts or @mf-types.zip artifact (received "${value}")`,
  );
};

export const resolveRemoteTypeUrls = (env: Record<string, string>, isDevelopment: boolean) =>
  Object.fromEntries(
    Object.entries(REMOTE_DEFINITIONS).map(([name, definition]) => {
      const value = env[definition.envKey];
      const urls = value
        ? toTypeUrls(value, definition.envKey)
        : isDevelopment
          ? toTypeUrls(definition.defaultUrl, definition.envKey)
          : undefined;
      if (!urls) {
        throw new Error(
          `${definition.envKey} is required when MF_DTS is enabled outside development. ` +
            "Run `pnpm mf:types` and set the MF_*_TYPES_URL variables.",
        );
      }
      return [name, { ...urls, alias: name }];
    }),
  );
