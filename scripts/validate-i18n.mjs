#!/usr/bin/env node
// Ensures en.json and zh-HK.json have exactly matching key structures, so t()
// never silently falls back to English for a key that should have been translated.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(readFileSync(path.join(__dirname, "..", "src", "i18n", "en.json"), "utf-8"));
const zh = JSON.parse(readFileSync(path.join(__dirname, "..", "src", "i18n", "zh-HK.json"), "utf-8"));

function collectPaths(obj, prefix = "") {
  const paths = [];
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      paths.push(...collectPaths(value, full));
    } else {
      paths.push(full);
    }
  }
  return paths;
}

const enPaths = new Set(collectPaths(en));
const zhPaths = new Set(collectPaths(zh));

const missingInZh = [...enPaths].filter((p) => !zhPaths.has(p));
const missingInEn = [...zhPaths].filter((p) => !enPaths.has(p));

console.log(`en.json: ${enPaths.size} keys, zh-HK.json: ${zhPaths.size} keys`);

if (missingInZh.length) {
  console.log(`\nMissing in zh-HK.json (${missingInZh.length}):`);
  missingInZh.forEach((p) => console.log(`  ✗ ${p}`));
}
if (missingInEn.length) {
  console.log(`\nMissing in en.json (${missingInEn.length}):`);
  missingInEn.forEach((p) => console.log(`  ✗ ${p}`));
}

if (missingInZh.length || missingInEn.length) {
  process.exit(1);
}

console.log("\nKey parity OK.");
