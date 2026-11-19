#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");

const ALLOWED_REMOTE_SPECIFIERS = new Set([
  // Route modules
  "grab_seller_account/Routes",
  "grab_seller_account/StorefrontRoutes",
  "grab_seller_product/Routes",
  "grab_seller_inventory/DashboardRoutes",
  "grab_seller_inventory/LocationRoutes",
  "grab_seller_inventory/StockRoutes",
  // Slot and UI Widgets
  "grab_seller_pricing/PricingCreateWidget",
  "grab_seller_pricing/PricingEditWidget",
  "grab_seller_inventory/ProductInventoryWidget",
  "grab_seller_inventory/InventoryItemEditWidget",
]);

function collectSourceFiles(dir, fileList = []) {
  if (!dir) return fileList;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        entry.name === "dist" ||
        entry.name === "@mf-types" ||
        entry.name === ".git" ||
        entry.name === ".mf"
      ) {
        continue;
      }
      collectSourceFiles(fullPath, fileList);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) &&
      !entry.name.endsWith(".d.ts")
    ) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const IMPORT_REGEX =
  /(?:import|export)\s+(?:[\s\S]*?from\s+)?['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

function checkBoundaries() {
  const violations = [];
  const appsDir = join(rootDir, "apps");
  const packagesDir = join(rootDir, "packages");

  const appFiles = collectSourceFiles(appsDir);
  const packageFiles = collectSourceFiles(packagesDir);

  // Rule 1: Shell Host boundary check
  // apps/grab-seller/src must not import implementation modules or compiled-types from remotes
  const shellFiles = appFiles.filter((f) => f.includes("/apps/grab-seller/src/"));
  for (const file of shellFiles) {
    const content = readFileSync(file, "utf8");
    const relFile = relative(rootDir, file);
    let match;
    IMPORT_REGEX.lastIndex = 0;
    while ((match = IMPORT_REGEX.exec(content)) !== null) {
      const specifier = match[1] || match[2];
      if (!specifier) continue;

      if (specifier.startsWith("grab_seller_")) {
        if (!ALLOWED_REMOTE_SPECIFIERS.has(specifier)) {
          violations.push({
            rule: "RULE_1_SHELL_REMOTE_BOUNDARY",
            file: relFile,
            specifier,
            message: `Shell host must not import '${specifier}'. Only declared dynamic route and widget modules are permitted.`,
          });
        }
      }

      if (specifier.includes("compiled-types")) {
        violations.push({
          rule: "RULE_1_NO_COMPILED_TYPES",
          file: relFile,
          specifier,
          message: `Direct import of '${specifier}' is forbidden. Consume contracts from @khinemyaezin/seller-contracts instead.`,
        });
      }
    }
  }

  // Rule 2: Shared packages must never import from apps or remotes
  for (const file of packageFiles) {
    const content = readFileSync(file, "utf8");
    const relFile = relative(rootDir, file);
    let match;
    IMPORT_REGEX.lastIndex = 0;
    while ((match = IMPORT_REGEX.exec(content)) !== null) {
      const specifier = match[1] || match[2];
      if (!specifier) continue;

      if (specifier.startsWith("grab_seller_")) {
        violations.push({
          rule: "RULE_2_PACKAGE_ISOLATION",
          file: relFile,
          specifier,
          message: `Package must not import remote '${specifier}'. Packages are independent libraries.`,
        });
      }

      if (specifier.includes("/apps/") || specifier.startsWith("../../apps/")) {
        violations.push({
          rule: "RULE_2_PACKAGE_ISOLATION",
          file: relFile,
          specifier,
          message: `Package must not import app module '${specifier}'.`,
        });
      }
    }
  }

  // Rule 3: MFEs must not import other MFEs via relative paths
  for (const file of appFiles) {
    const content = readFileSync(file, "utf8");
    const relFile = relative(rootDir, file);
    let match;
    IMPORT_REGEX.lastIndex = 0;
    while ((match = IMPORT_REGEX.exec(content)) !== null) {
      const specifier = match[1] || match[2];
      if (!specifier) continue;

      if (specifier.startsWith("../") || specifier.startsWith("./")) {
        try {
          const resolvedPath = resolve(dirname(file), specifier);
          const currentApp = file.split("/apps/")[1]?.split("/")[0];
          if (resolvedPath.includes("/apps/")) {
            const targetApp = resolvedPath.split("/apps/")[1]?.split("/")[0];
            if (currentApp && targetApp && currentApp !== targetApp) {
              violations.push({
                rule: "RULE_3_MFE_ISOLATION",
                file: relFile,
                specifier,
                message: `Cross-MFE relative import detected: '${specifier}' resolves to app '${targetApp}'.`,
              });
            }
          }
        } catch {
          // Ignore path resolution issues for non-existent files (caught by typecheck)
        }
      }
    }
  }

  // Rule 4: Single Shell SSE Connection Invariant (ADR-003)
  // Remotes must never import createBackendEventStream or instantiate EventSource.
  // Shell routes must never instantiate SSE or import legacy stream hooks.
  for (const file of appFiles) {
    const relFile = relative(rootDir, file);
    const content = readFileSync(file, "utf8");

    const isRemote = relFile.startsWith("apps/grab-seller-");
    const isShellRoute = relFile.startsWith("apps/grab-seller/src/routes/");
    const isShellProvider = relFile === "apps/grab-seller/src/app/EventStreamProvider.tsx";
    const isShellProviderTest = relFile === "apps/grab-seller/src/app/EventStreamProvider.test.tsx";

    if (
      isRemote &&
      (content.includes("createBackendEventStream") || content.includes("new EventSource"))
    ) {
      violations.push({
        rule: "RULE_4_SINGLE_SSE_CONNECTION_ADR003",
        file: relFile,
        specifier: "createBackendEventStream / EventSource",
        message: `Remote MFE must never instantiate an SSE connection directly (ADR-003). Consume domain events exclusively from platform.events.`,
      });
    }

    if (
      isShellRoute &&
      (content.includes("createBackendEventStream") || content.includes("useSseStream"))
    ) {
      violations.push({
        rule: "RULE_4_SHELL_ROUTE_SSE_ISOLATION",
        file: relFile,
        specifier: "createBackendEventStream / useSseStream",
        message: `Shell routes must not manage SSE connections. The host SSE connection is owned exclusively by EventStreamProvider.`,
      });
    }

    if (
      relFile.startsWith("apps/grab-seller/src/") &&
      !isShellProvider &&
      !isShellProviderTest &&
      content.includes("createBackendEventStream")
    ) {
      violations.push({
        rule: "RULE_4_SINGLE_SSE_CONNECTION_ADR003",
        file: relFile,
        specifier: "createBackendEventStream",
        message: `createBackendEventStream may only be used by EventStreamProvider in the shell host.`,
      });
    }
  }

  return violations;
}

const violations = checkBoundaries();

if (violations.length > 0) {
  console.error(
    `[check:boundaries] Found ${violations.length} architectural boundary violation(s):\n`,
  );
  for (const v of violations) {
    console.error(`  [${v.rule}] ${v.file}`);
    console.error(`    Import: "${v.specifier}"`);
    console.error(`    Reason: ${v.message}\n`);
  }
  process.exit(1);
} else {
  console.log(
    "[check:boundaries] All architectural module boundaries verified successfully (0 violations).",
  );
}
