// @ts-nocheck
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv, type PluginOption, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import tailwindcss from "@tailwindcss/vite";
import { SHARED_DEPENDENCIES } from "./shared.js";

export interface CreateRemoteConfigOptions {
  name: string;
  port: number;
  portEnvKey?: string;
  basePath: string;
  exposes: Record<string, string>;
  extraShared?: Record<string, unknown>;
  importMetaUrl: string;
  plugins?: PluginOption[];
  build?: UserConfig["build"];
  server?: UserConfig["server"];
  strictPort?: boolean;
}

export function createRemoteConfig(options: CreateRemoteConfigOptions) {
  return defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const portEnv = options.portEnvKey ? process.env[options.portEnvKey] : undefined;
    const port = portEnv ? Number(portEnv) : options.port;
    const isDev = mode === "development";

    return {
      base: isDev ? `http://localhost:${port}/` : options.basePath,
      resolve: {
        alias: {
          "@": fileURLToPath(new URL("./src", options.importMetaUrl)),
        },
      },
      plugins: [
        react(),
        tailwindcss(),
        federation({
          name: options.name,
          filename: "remoteEntry.js",
          manifest: true,
          bundleAllCSS: true,
          dts:
            process.env.MF_DTS === "0"
              ? false
              : {
                  generateTypes: {
                    tsConfigPath: "./tsconfig.app.json",
                    abortOnError: true,
                  },
                },
          exposes: options.exposes,
          shared: {
            ...SHARED_DEPENDENCIES,
            ...options.extraShared,
          },
        }),
        ...(options.plugins ?? []),
      ],
      server: {
        port,
        origin: env.VITE_ORIGIN,
        cors: { origin: env.VITE_CORS_ORIGIN },
        proxy: {
          "/api": {
            target: env.VITE_API_URL,
            changeOrigin: true,
            xfwd: true,
            timeout: 0,
            proxyTimeout: 0,
            headers: { "X-Platform": "SELLER_PORTAL" },
          },
          ...(options.server?.proxy ?? {}),
        },
        ...options.server,
      },
      preview: { port },
      strictPort: options.strictPort ?? true,
      build: {
        target: "chrome111",
        cssCodeSplit: false,
        ...options.build,
      },
    };
  });
}
