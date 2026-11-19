#!/usr/bin/env node
/**
 * Fast verification of generated Module Federation declarations.
 *
 * Verifies that every `grab_seller_*` module imported in `apps/grab-seller/src`
 * has a corresponding declaration in `apps/grab-seller/@mf-types/`.
 * Does not start servers or build artifacts. Run before shell typecheck.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const SHELL_DIR = path.join(ROOT, "apps", "grab-seller");
const SHELL_TYPES_DIR = path.join(SHELL_DIR, "@mf-types");

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

async function main() {
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

  try {
    await stat(path.join(SHELL_TYPES_DIR, "index.d.ts"));
  } catch {
    missing.push(
      `  - shell MF API index -> ${path.relative(ROOT, path.join(SHELL_TYPES_DIR, "index.d.ts"))}`,
    );
  }

  if (missing.length > 0) {
    console.error(
      "[check:mf-types] Error: Shell declarations are missing or incomplete:\n" +
        `${missing.join("\n")}\n\n` +
        "Run `pnpm mf:types` to generate them before typechecking or building the shell.",
    );
    process.exit(1);
  }

  console.log(
    `[check:mf-types] All ${specifiers.size} remote module declarations exist in @mf-types.`,
  );
}

main().catch((err) => {
  console.error(`[check:mf-types] Unexpected error: ${err.message}`);
  process.exit(1);
});
