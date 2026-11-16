import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import tailwindcss from "@tailwindcss/vite";

/**
 * Development defaults. Keep these in sync with `scripts/mf-types.mjs`.
 * Set the corresponding `MF_*_TYPES_URL` variable to override them. The value
 * may point at either the `@mf-types.d.ts` file or the `@mf-types.zip` archive;
 * the other URL is derived from it.
 */
const REMOTE_TYPE_DEFAULTS = {
  grab_seller_auth: {
    envKey: "MF_AUTH_TYPES_URL",
    url: "http://localhost:3003/@mf-types.d.ts",
  },
  grab_seller_account: {
    envKey: "MF_ACCOUNT_TYPES_URL",
    url: "http://localhost:3004/@mf-types.d.ts",
  },
  grab_seller_product: {
    envKey: "MF_PRODUCT_TYPES_URL",
    url: "http://localhost:3001/@mf-types.d.ts",
  },
  grab_seller_inventory: {
    envKey: "MF_INVENTORY_TYPES_URL",
    url: "http://localhost:3002/@mf-types.d.ts",
  },
  grab_seller_pricing: {
    envKey: "MF_PRICING_TYPES_URL",
    url: "http://localhost:3005/@mf-types.d.ts",
  },
} as const;

const toTypeUrls = (value: string, envKey: string) => {
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

const resolveRemoteTypeUrls = (env: Record<string, string>, isDevelopment: boolean) =>
  Object.fromEntries(
    Object.entries(REMOTE_TYPE_DEFAULTS).map(([name, definition]) => {
      const value = env[definition.envKey];
      const urls = value
        ? toTypeUrls(value, definition.envKey)
        : isDevelopment
          ? toTypeUrls(definition.url, definition.envKey)
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const dtsEnabled = process.env.MF_DTS !== "0";
  return {
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: "seller_shell",
        dts: dtsEnabled
          ? {
              consumeTypes: {
                remoteTypeUrls: resolveRemoteTypeUrls(env, mode === "development"),
                abortOnError: true,
                typesOnBuild: true,
              },
            }
          : false,
        remotes: {
          grab_seller_auth: {
            type: "module",
            name: "grab_seller_auth",
            entry: "/mfe/seller-auth/mf-manifest.json",
          },
          grab_seller_account: {
            type: "module",
            name: "grab_seller_account",
            entry: "/mfe/seller-account/mf-manifest.json",
          },
          grab_seller_product: {
            type: "module",
            name: "grab_seller_product",
            entry: "/mfe/seller-product/mf-manifest.json",
          },
          grab_seller_inventory: {
            type: "module",
            name: "grab_seller_inventory",
            entry: "/mfe/seller-inventory/mf-manifest.json",
          },
          grab_seller_pricing: {
            type: "module",
            name: "grab_seller_pricing",
            entry: "/mfe/seller-pricing/mf-manifest.json",
          },
        },
        shared: {
          react: { singleton: true, requiredVersion: "19.2.4" },
          "react-dom": { singleton: true, requiredVersion: "19.2.4" },
          "react-router": { singleton: true, requiredVersion: "7.18.0" },
          "react-hook-form": { singleton: true, requiredVersion: "7.74.0" },
          recharts: { singleton: true },
          "@tanstack/react-query": { singleton: true, requiredVersion: "5.99.2" },
          "@khinemyaezin/seller-api": { singleton: true },
          "@khinemyaezin/seller-ui": { singleton: true },
          "@khinemyaezin/seller-contracts": { singleton: true },
        },
      }),
    ],
    resolve: {
      alias: {},
    },
    optimizeDeps: {
      exclude: [
        "@khinemyaezin/seller-contracts",
        "@khinemyaezin/seller-api",
        "@khinemyaezin/seller-ui",
      ],
    },
    server: {
      port: 3000,
      origin: env.VITE_ORIGIN,
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          xfwd: true,
          timeout: 0,
          proxyTimeout: 0,
          headers: {
            "X-Platform": "SELLER_PORTAL",
          },
        },
        "/mfe/seller-auth/": {
          target: "http://localhost:3003",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/mfe\/seller-auth/, ""),
        },
        "/mfe/seller-account/": {
          target: "http://localhost:3004",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/mfe\/seller-account/, ""),
        },
        "/mfe/seller-product/": {
          target: "http://localhost:3001",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/mfe\/seller-product/, ""),
        },
        "/mfe/seller-inventory/": {
          target: "http://localhost:3002",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/mfe\/seller-inventory/, ""),
        },
        "/mfe/seller-pricing/": {
          target: "http://localhost:3005",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/mfe\/seller-pricing/, ""),
        },
      },
    },
    preview: { port: 3000 },
    strictPort: true,
    build: { target: "chrome111", cssCodeSplit: false },
  };
});
