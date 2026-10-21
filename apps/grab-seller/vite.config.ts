import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: "seller_shell",
        dts: process.env.MF_DTS === "0" ? false : {
          consumeTypes: {
            remoteTypeUrls: {
              grab_seller_auth: {
                api: "http://localhost:3003/@mf-types.d.ts",
                zip: "http://localhost:3003/@mf-types.zip",
              },
              grab_seller_account: {
                api: "http://localhost:3004/@mf-types.d.ts",
                zip: "http://localhost:3004/@mf-types.zip",
              },
              grab_seller_product: {
                api: "http://localhost:3001/@mf-types.d.ts",
                zip: "http://localhost:3001/@mf-types.zip",
              },
              grab_seller_inventory: {
                api: "http://localhost:3002/@mf-types.d.ts",
                zip: "http://localhost:3002/@mf-types.zip",
              },
              grab_seller_pricing: {
                api: "http://localhost:3005/@mf-types.d.ts",
                zip: "http://localhost:3005/@mf-types.zip",
              },
            },
            abortOnError: false,
          },
        },
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
          "react": { singleton: true, requiredVersion: "19.2.4" },
          "react-dom": { singleton: true, requiredVersion: "19.2.4" },
          "react-router": { singleton: true, requiredVersion: "7.18.0" },
          "react-hook-form": { singleton: true, requiredVersion: "7.74.0" },
          "recharts": { singleton: true },
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
            "X-Platform": "SELLER_PORTAL"
          }
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
