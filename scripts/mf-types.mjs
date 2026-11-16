#!/usr/bin/env node
/**
 * Deterministic Module Federation type generation.
 *
 * 1. Build shared packages so remotes resolve their `dist` output.
 * 2. Build every remote with `MF_DTS=1` so it emits `@mf-types.d.ts`,
 *    `@mf-types.zip`, and `@mf-types/` next to its source.
 * 3. Serve those artifacts over HTTP (documented remote ports by default).
 * 4. Consume them into `apps/grab-seller/@mf-types` with the host dts consumer.
 * 5. Verify that every `grab_seller_*` import in the shell has a declaration.
 *
 * The generated tree is a build artifact (gitignored). Run this before a shell
 * typecheck/build that uses `MF_DTS=0`.
 */
import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { readdir, readFile, rm, stat, cp, mkdir, writeFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const SHELL_DIR = path.join(ROOT, "apps", "grab-seller");
const SHELL_TYPES_DIR = path.join(SHELL_DIR, "@mf-types");

/**
 * Keep this list in sync with the `consumeTypes.remoteTypeUrls` defaults in
 * `apps/grab-seller/vite.config.ts`.
 */
const REMOTES = [
  {
    name: "grab_seller_product",
    packageName: "grab-seller-product",
    dir: path.join(ROOT, "apps", "grab-seller-product"),
    port: 3001,
  },
  {
    name: "grab_seller_inventory",
    packageName: "grab-seller-inventory",
    dir: path.join(ROOT, "apps", "grab-seller-inventory"),
    port: 3002,
  },
  {
    name: "grab_seller_auth",
    packageName: "seller-auth",
    dir: path.join(ROOT, "apps", "grab-seller-auth"),
    port: 3003,
  },
  {
    name: "grab_seller_account",
    packageName: "seller-account",
    dir: path.join(ROOT, "apps", "grab-seller-account"),
    port: 3004,
  },
  {
    name: "grab_seller_pricing",
    packageName: "grab-seller-pricing",
    dir: path.join(ROOT, "apps", "grab-seller-pricing"),
    port: 3005,
  },
];

function log(message) {
  console.log(`[mf:types] ${message}`);
}

function warn(message) {
  console.warn(`[mf:types] ${message}`);
}

function run(command, args, { env } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      env: { ...process.env, ...env },
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} exited with ${signal ?? code}`));
    });
  });
}

async function assertArtifact(filePath, description) {
  try {
    const info = await stat(filePath);
    if (info.isFile() || info.isDirectory()) return;
  } catch {
    // fall through to the readable error below
  }
  throw new Error(
    `Missing ${description}: ${path.relative(ROOT, filePath)}. ` +
      "The remote build did not emit its Module Federation declarations.",
  );
}

async function buildPackages() {
  log("building shared packages");
  await run("pnpm", ["exec", "turbo", "build", "--filter=./packages/*"]);
}

async function buildRemote(remote) {
  log(`building ${remote.name} with MF_DTS=1`);
  await run("pnpm", ["--filter", remote.packageName, "exec", "vite", "build"], {
    env: { MF_DTS: "1" },
  });

  const artifactDir = path.join(remote.dir, "dist");
  await assertArtifact(path.join(artifactDir, "@mf-types.d.ts"), `${remote.name} API declarations`);
  await assertArtifact(path.join(artifactDir, "@mf-types.zip"), `${remote.name} type archive`);
  await assertArtifact(path.join(artifactDir, "@mf-types"), `${remote.name} type directory`);
}

function serveArtifacts(remote) {
  const artifactDir = path.join(remote.dir, "dist");
  const apiPath = path.join(artifactDir, "@mf-types.d.ts");
  const zipPath = path.join(artifactDir, "@mf-types.zip");

  const server = http.createServer((request, response) => {
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
    const filePath =
      pathname === "/@mf-types.d.ts" ? apiPath : pathname === "/@mf-types.zip" ? zipPath : null;

    if (!filePath) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "content-type":
        pathname === "/@mf-types.zip" ? "application/zip" : "text/plain; charset=utf-8",
      "cache-control": "no-store",
    });
    createReadStream(filePath).pipe(response);
  });

  return new Promise((resolve, reject) => {
    const onError = (error) => {
      server.off("listening", onListening);
      reject(error);
    };
    const onListening = () => {
      server.off("error", onError);
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : remote.port;
      resolve({ server, port });
    };

    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(remote.port, "127.0.0.1");
  });
}

async function startArtifactServers() {
  const servers = [];

  try {
    for (const remote of REMOTES) {
      let listening;
      try {
        listening = await serveArtifacts(remote);
      } catch (error) {
        if (error.code !== "EADDRINUSE") throw error;
        warn(
          `port ${remote.port} is already in use; serving ${remote.name} types on an ephemeral port`,
        );
        listening = await serveArtifacts({ ...remote, port: 0 });
      }
      servers.push({ ...listening, remote });
      log(`serving ${remote.name} types on http://127.0.0.1:${listening.port}`);
    }
    return servers;
  } catch (error) {
    await stopArtifactServers(servers);
    throw error;
  }
}

async function stopArtifactServers(servers) {
  await Promise.all(
    servers.map(
      ({ server }) =>
        new Promise((resolve) => {
          server.closeAllConnections?.();
          server.close(() => resolve());
        }),
    ),
  );
}

async function consumeShellTypes(servers) {
  const remoteTypeUrls = Object.fromEntries(
    servers.map(({ remote, port }) => [
      remote.name,
      {
        api: `http://127.0.0.1:${port}/@mf-types.d.ts`,
        zip: `http://127.0.0.1:${port}/@mf-types.zip`,
        alias: remote.name,
      },
    ]),
  );

  log("removing previous shell declarations");
  await rm(SHELL_TYPES_DIR, { recursive: true, force: true });

  log("consuming remote declarations into apps/grab-seller/@mf-types");
  const { consumeTypesAPI } = await import("@module-federation/dts-plugin");

  // consumeTypesAPI reports completion through its callback. It also swallows
  // consumption errors, so the artifact verification below is the real guard.
  try {
    await new Promise((resolve, reject) => {
      consumeTypesAPI(
        {
          host: {
            context: SHELL_DIR,
            implementation: "",
            moduleFederationConfig: { name: "seller_shell", remotes: {} },
            typesFolder: "@mf-types",
            remoteTypeUrls,
            abortOnError: false,
            deleteTypesFolder: true,
            consumeAPITypes: true,
            maxRetries: 1,
            timeout: 5_000,
          },
        },
        () => resolve(),
      ).catch(reject);
    });
  } catch {
    // consumeTypesAPI failed (e.g. loopback HTTP network restricted)
  }

  // If consumeTypesAPI failed or was incomplete (e.g. sandboxed or offline environment),
  // unpack declarations directly from local workspace builds.
  try {
    await stat(path.join(SHELL_TYPES_DIR, "index.d.ts"));
  } catch {
    await consumeShellTypesFromDisk();
  }
}

async function consumeShellTypesFromDisk() {
  log("extracting remote declarations directly from local builds");
  await mkdir(SHELL_TYPES_DIR, { recursive: true });

  const apisImports = [];
  const remoteKeyTypes = [];
  const packageTypeClauses = [];

  for (let i = 0; i < REMOTES.length; i++) {
    const remote = REMOTES[i];
    const srcDir = path.join(remote.dir, "dist", "@mf-types");
    const targetDir = path.join(SHELL_TYPES_DIR, remote.name);
    try {
      await cp(srcDir, targetDir, { recursive: true });
    } catch (err) {
      warn(`could not copy declarations for ${remote.name}: ${err.message}`);
    }

    const apisPath = path.join(targetDir, "apis.d.ts");
    const rawApiDtsPath = path.join(remote.dir, "dist", "@mf-types.d.ts");
    try {
      const rawApiContent = await readFile(rawApiDtsPath, "utf8");
      const rewritten = rawApiContent.replaceAll("REMOTE_ALIAS_IDENTIFIER", remote.name);
      await writeFile(apisPath, rewritten, "utf8");
    } catch {
      // ignore
    }

    apisImports.push(
      `import type { PackageType as PackageType_${i}, RemoteKeys as RemoteKeys_${i} } from './${remote.name}/apis.d.ts';`,
    );
    remoteKeyTypes.push(`RemoteKeys_${i}`);
    packageTypeClauses.push(`T extends RemoteKeys_${i} ? PackageType_${i}<T> :`);
  }

  const indexContent = `${apisImports.join("\n")}
declare module "@module-federation/runtime" {
  type RemoteKeys = ${remoteKeyTypes.join(" | ")};
  type PackageType<T, Y = any> = ${packageTypeClauses.join("\n")} Y;
  export function loadRemote<T extends RemoteKeys, Y>(packageName: T): Promise<PackageType<T, Y>>;
  export function loadRemote<T extends string, Y>(packageName: T): Promise<PackageType<T, Y>>;
}
declare module "@module-federation/enhanced/runtime" {
  type RemoteKeys = ${remoteKeyTypes.join(" | ")};
  type PackageType<T, Y = any> = ${packageTypeClauses.join("\n")} Y;
  export function loadRemote<T extends RemoteKeys, Y>(packageName: T): Promise<PackageType<T, Y>>;
  export function loadRemote<T extends string, Y>(packageName: T): Promise<PackageType<T, Y>>;
}
declare module "@module-federation/runtime-tools" {
  type RemoteKeys = ${remoteKeyTypes.join(" | ")};
  type PackageType<T, Y = any> = ${packageTypeClauses.join("\n")} Y;
  export function loadRemote<T extends RemoteKeys, Y>(packageName: T): Promise<PackageType<T, Y>>;
  export function loadRemote<T extends string, Y>(packageName: T): Promise<PackageType<T, Y>>;
}
`;
  await writeFile(path.join(SHELL_TYPES_DIR, "index.d.ts"), indexContent, "utf8");
}

async function listSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return listSourceFiles(entryPath);
      return /\.(ts|tsx)$/.test(entry.name) ? [entryPath] : [];
    }),
  );
  return files.flat();
}

async function verifyShellDeclarations() {
  const importPattern = /(?:from\s*|import\s*\(\s*)["'](grab_seller_[^"']+)["']/g;
  const sourceFiles = await listSourceFiles(path.join(SHELL_DIR, "src"));
  const specifiers = new Set();

  for (const file of sourceFiles) {
    const source = await readFile(file, "utf8");
    for (const match of source.matchAll(importPattern)) {
      specifiers.add(match[1]);
    }
  }

  const missing = [];
  for (const specifier of specifiers) {
    const declarationPath = path.join(SHELL_TYPES_DIR, `${specifier}.d.ts`);
    const indexPath = path.join(SHELL_TYPES_DIR, specifier, "index.d.ts");
    try {
      await stat(declarationPath);
    } catch {
      try {
        await stat(indexPath);
      } catch {
        missing.push(`  - ${specifier} -> ${path.relative(ROOT, declarationPath)}`);
      }
    }
  }

  if (missing.length > 0) {
    throw new Error(
      "Shell declarations are incomplete. Missing generated files:\n" +
        `${missing.join("\n")}\n` +
        "Check that every remote expose is listed in its vite.config.ts and rerun `pnpm mf:types`.",
    );
  }

  await assertArtifact(path.join(SHELL_TYPES_DIR, "index.d.ts"), "shell MF API index");
  log(`verified ${specifiers.size} shell import(s) against generated declarations`);
}

async function main() {
  const startedAt = Date.now();
  await buildPackages();
  for (const remote of REMOTES) {
    await buildRemote(remote);
  }

  const servers = await startArtifactServers();
  try {
    await consumeShellTypes(servers);
  } finally {
    await stopArtifactServers(servers);
  }

  await verifyShellDeclarations();
  log(`done in ${((Date.now() - startedAt) / 1000).toFixed(1)}s`);
}

main().catch((error) => {
  console.error(`[mf:types] ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
});
