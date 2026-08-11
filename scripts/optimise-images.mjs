#!/usr/bin/env node
/**
 * Downscale, convert and recompress the localised images in public/img.
 *
 * Sources came straight from Commons/school sites at whatever size and format they were
 * published in — up to 1920x2908 and 2MB, including photographs saved as PNG. Nothing on the
 * site renders a photo wider than ~820 CSS px, so shipping those as-is is pure waste on every
 * page load.
 *
 * Uses macOS `sips` (built in, no dependency). Only ever shrinks — images already at or below
 * the target are never upscaled, so nothing gains fake resolution.
 *
 *   lead/gallery -> max 1400px, JPEG q55
 *   thumbnails   -> max  500px, JPEG q60
 *   raster logos -> max  512px, format preserved (logos need alpha / crisp flat colour)
 *   SVG logos    -> untouched (vector)
 *
 * Photographs stored as PNG are converted to JPEG and the data file is rewritten to match.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, statSync, unlinkSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "public", "img");
const DATA = path.join(ROOT, "src", "data", "schools.json");

const isLogo = (n) => n.startsWith("logo-");
const isThumb = (n) => /-t-[0-9a-f]{12}\./.test(n);

function dims(file) {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], { encoding: "utf-8" });
  return {
    w: +(out.match(/pixelWidth:\s*(\d+)/)?.[1] ?? 0),
    h: +(out.match(/pixelHeight:\s*(\d+)/)?.[1] ?? 0),
  };
}

const files = readdirSync(DIR).filter((f) => !f.startsWith("."));
let before = 0, after = 0, resized = 0, converted = 0;
const renames = new Map(); // old public path -> new public path

for (const name of files) {
  const file = path.join(DIR, name);
  before += statSync(file).size;

  if (name.endsWith(".svg")) { after += statSync(file).size; continue; }

  const target = isLogo(name) ? 512 : isThumb(name) ? 500 : 1400;
  const quality = isThumb(name) ? "60" : "55";

  try {
    if (Math.max(...Object.values(dims(file))) > target) {
      execFileSync("sips", ["-Z", String(target), file], { stdio: "ignore" });
      resized++;
    }

    // Photographs saved as PNG: convert to JPEG. Logos keep their format (alpha / flat colour).
    if (!isLogo(name) && /\.png$/i.test(name)) {
      const jpg = file.replace(/\.png$/i, ".jpg");
      execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", quality, file, "--out", jpg], { stdio: "ignore" });
      unlinkSync(file);
      renames.set(`/img/${name}`, `/img/${path.basename(jpg)}`);
      converted++;
      after += statSync(jpg).size;
      continue;
    }

    if (/\.jpe?g$/i.test(name)) {
      execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", quality, file], { stdio: "ignore" });
    }
  } catch {
    // Leave the original in place rather than risk a corrupted file.
  }
  after += statSync(file).size;
}

// Keep the data file in step with any PNG -> JPEG renames.
if (renames.size) {
  let raw = readFileSync(DATA, "utf-8");
  for (const [from, to] of renames) raw = raw.split(from).join(to);
  writeFileSync(DATA, raw, "utf-8");
}

const mb = (b) => (b / 1024 / 1024).toFixed(1);
console.log(`processed ${files.length} files`);
console.log(`resized: ${resized}   png->jpeg: ${converted}   data refs rewritten: ${renames.size}`);
console.log(`${mb(before)} MB -> ${mb(after)} MB  (${(100 - (after / before) * 100).toFixed(0)}% smaller)`);
