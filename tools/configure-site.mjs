import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function valueFor(flag) {
  const index = args.indexOf(flag);
  if (index === -1) return "";
  return args[index + 1] || "";
}

const siteUrl = valueFor("--url").replace(/\/$/, "");
const email = valueFor("--email");

if (!siteUrl && !email) {
  console.log("Usage: node tools/configure-site.mjs --url https://example.github.io/pet-bousai --email name@example.com");
  process.exit(0);
}

const replacements = [];
if (siteUrl) {
  replacements.push([
    /https:\/\/your-github-username\.github\.io\/pet-bousai-note/g,
    siteUrl
  ]);
  replacements.push([
    /https:\/\/noteweb58-ops\.github\.io\/pet-bousai-note(?:-note)?/g,
    siteUrl
  ]);
}
if (email) {
  replacements.push([/your-email@example\.com/g, email]);
}

const files = [
  "README.md",
  "robots.txt",
  "sitemap.xml",
  "contact.html",
  "index.html",
  "affiliate-disclosure.html",
  "privacy.html",
  "disclaimer.html"
];

for (const file of files) {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, "utf8");
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  fs.writeFileSync(fullPath, content);
}

console.log("Site settings updated.");
