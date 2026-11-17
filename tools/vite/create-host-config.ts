// @ts-nocheck
import { defineConfig, loadEnv, type PluginOption, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import tailwindcss from "@tailwindcss/vite";
import {
  DEFAULT_PORTS,
  REMOTE_DEFINITIONS,
  resolveRemoteTypeUrls,
  SHARED_DEPENDENCIES,
} from "./shared.js";

export interface CreateHostConfigOptions {
  port?: number;
  portEnvKey?: string;
  extraShared?: Record<string, unknown>;
  plugins?: PluginOption[];
  build?: UserConfig["build"];
  server?: UserConfig["server"];
  strictPort?: boolean;
}

export function createHostConfig(options: CreateHostConfigOptions = {}) {
  return defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const portEnv = options.portEnvKey ? process.env[options.portEnvKey] : process.env.SELLER_PORT;
    const port = portEnv ? Number(portEnv) : (options.port ?? DEFAULT_PORTS.seller);
    const dtsEnabled = process.env.MF_DTS !== "0";

    const remotes = Object.fromEntries(
      Object.entries(REMOTE_DEFINITIONS).map(([key, def]) => [
        key,
        {
          type: "module" as const,
          name: def.name,
          entry: def.manifestPath,
        },
      ]),
    );

    const remoteProxies = Object.fromEntries(
      Object.entries(REMOTE_DEFINITIONS).map(([, def]) => {
        const remotePort = process.env[def.portEnvKey] || def.port;
        const prefix = def.basePath.replace(/\/$/, "");
        return [
          def.basePath,
          {
            target: `http://localhost:${remotePort}`,
            changeOrigin: true,
            rewrite: (path: string) => path.replace(new RegExp(`^${prefix}`), ""),
          },
        ];
      }),
    );

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
          remotes,
          shared: {
            ...SHARED_DEPENDENCIES,
            recharts: { singleton: true },
            ...options.extraShared,
          },
        }),
        ...(options.plugins ?? []),
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
        port,
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
          ...remoteProxies,
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
