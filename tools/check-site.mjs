import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const htmlFiles = fs
  .readdirSync(root)
  .filter((file) => file.endsWith(".html"))
  .sort();

const localRefs = [];
const missing = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const refs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);

  for (const ref of refs) {
    if (
      ref.startsWith("http") ||
      ref.startsWith("#") ||
      ref.startsWith("mailto:") ||
      ref.startsWith("tel:")
    ) {
      continue;
    }

    const cleanRef = ref.split("#")[0].split("?")[0];
    if (!cleanRef) continue;
    localRefs.push([file, cleanRef]);

    const target = path.join(root, cleanRef);
    if (!fs.existsSync(target)) {
      missing.push(`${file} -> ${cleanRef}`);
    }
  }
}

if (missing.length) {
  console.error("Missing local references:");
  for (const item of missing) console.error(`- ${item}`);
  process.exitCode = 1;
} else {
  console.log(`OK: ${htmlFiles.length} HTML files checked`);
  console.log(`OK: ${localRefs.length} local references resolved`);
}
