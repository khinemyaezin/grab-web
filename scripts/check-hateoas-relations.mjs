import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const sourceRoots = [join(root, "apps"), join(root, "packages")];
const ignoredDirectories = new Set(["node_modules", "dist", "build", "@mf-types"]);
const lookupPattern = /\b(?:resolveLink|hasLink)\(\s*[^,\n]+,\s*["'][^"']+["']\s*\)/g;
const violations = [];

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) await visit(join(directory, entry.name));
      continue;
    }

    if (!/\.(?:ts|tsx)$/.test(entry.name) || /\.(?:test|spec)\.(?:ts|tsx)$/.test(entry.name)) continue;

    const file = join(directory, entry.name);
    const contents = await readFile(file, "utf8");
    for (const match of contents.matchAll(lookupPattern)) {
      violations.push(`${relative(root, file)}: ${match[0]}`);
    }
  }
}

await Promise.all(sourceRoots.map(visit));

if (violations.length > 0) {
  console.error("Raw HATEOAS relation literals found outside the ApiLinks contract:");
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log("HATEOAS relation lookup literals are centralized.");
}
