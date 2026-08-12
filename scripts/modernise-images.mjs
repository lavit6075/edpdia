#!/usr/bin/env node
/**
 * Generate AVIF (and, where it actually helps, WebP) siblings for every raster image in
 * public/img, leaving the original JPEG/PNG in place as the <picture> fallback.
 *
 * Phase 1 downscaled these images but never changed format, so the whole library was still
 * JPEG/PNG. This closes that gap.
 *
 * Three rules, all of which exist because measuring beat guessing:
 *
 *  1. QUALITY IS CHOSEN PER IMAGE, by binary-searching for the smallest encode that still clears
 *     an SSIM floor against the current file (see lib/encode.mjs). A fixed quality number means
 *     something different on a flat sky than on a tree canopy.
 *
 *  2. WEBP IS ONLY KEPT WHEN IT BEATS THE ORIGINAL. At high fidelity, WebP frequently encodes
 *     these leads LARGER than the source JPEG — up to 112%. Shipping that would make Safari 14-15
 *     (WebP yes, AVIF no) download more than it does today. Where WebP doesn't win, the <source>
 *     is simply omitted and those browsers fall through to the JPEG.
 *
 *  3. FLAT-COLOUR GRAPHICS GO LOSSLESS. Logos are hard-edged artwork; lossy codecs ring around the
 *     edges and no lossy quality clears the SSIM floor at all. They get lossless AVIF/WebP, which
 *     still beats PNG, or keep the PNG if it doesn't.
 *
 * SVG logos are untouched — already vector, already tiny.
 *
 * Idempotent: an existing sibling newer than its source is left alone. Pass --force to redo.
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { encodeToFloor, encodeLossless } from "./lib/encode.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMG = path.join(ROOT, "public", "img");
const FORCE = process.argv.includes("--force");

/** Fidelity floor against the currently-shipped file. 0.97 mean SSIM is visually indistinguishable. */
const PHOTO_SSIM_FLOOR = 0.97;
const CONCURRENCY = 6;

const isLogo = (f) => f.startsWith("logo-");
const kb = (n) => (n / 1024).toFixed(1) + "K";

const sources = readdirSync(IMG).filter((f) => /\.(jpe?g|png)$/i.test(f));
if (!sources.length) {
  console.error("no raster sources in public/img");
  process.exit(1);
}

const results = [];
let done = 0;

async function process_(file) {
  const src = path.join(IMG, file);
  const base = file.replace(/\.(jpe?g|png)$/i, "");
  const input = readFileSync(src);
  const origSize = input.length;
  const row = { file, origSize, avif: null, webp: null, kept: [] };

  for (const fmt of ["avif", "webp"]) {
    const out = path.join(IMG, `${base}.${fmt}`);
    if (!FORCE && existsSync(out) && statSync(out).mtimeMs > statSync(src).mtimeMs) {
      row[fmt] = { size: statSync(out).size, quality: "cached", reused: true };
      row.kept.push(fmt);
      continue;
    }
    const r = isLogo(file)
      ? await encodeLossless(input, fmt)
      : await encodeToFloor(input, fmt, PHOTO_SSIM_FLOOR);

    // Rule 2: only ship a sibling that is genuinely smaller than what it replaces.
    if (r && r.buf.length < origSize) {
      writeFileSync(out, r.buf);
      row[fmt] = { size: r.buf.length, quality: r.quality, ssim: r.ssim };
      row.kept.push(fmt);
    } else {
      if (existsSync(out)) unlinkSync(out); // a previous run may have written a losing file
      row[fmt] = r ? { size: r.buf.length, quality: r.quality, rejected: true } : { rejected: true, unreachable: true };
    }
  }

  results.push(row);
  done++;
  const best = row.kept.length ? Math.min(...row.kept.map((f) => row[f].size)) : origSize;
  console.log(
    `  ${String(done).padStart(3)}/${sources.length}  ${file.slice(0, 52).padEnd(52)} ` +
      `${kb(origSize).padStart(7)} -> ${kb(best).padStart(7)}  ${row.kept.join("+") || "(no win, keeping original)"}`,
  );
}

// Simple pool — sharp does its work off-thread, so a few in flight keeps all cores busy.
const queue = [...sources];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) await process_(queue.shift());
  }),
);

// ---------- summary ----------
const sum = (f) => results.reduce((n, r) => n + f(r), 0);
const bestOf = (r) => (r.kept.length ? Math.min(...r.kept.map((k) => r[k].size)) : r.origSize);

const origTotal = sum((r) => r.origSize);
const bestTotal = sum(bestOf);
const avifKept = results.filter((r) => r.kept.includes("avif")).length;
const webpKept = results.filter((r) => r.kept.includes("webp")).length;

console.log(`\n${results.length} raster images`);
console.log(`  AVIF kept : ${avifKept}/${results.length}`);
console.log(`  WebP kept : ${webpKept}/${results.length}  (omitted where it lost to the original)`);
console.log(`  originals retained as <picture> fallback: ${results.length}`);
console.log(`\n  bytes served to a modern browser: ${kb(origTotal)} -> ${kb(bestTotal)}  ` +
  `(-${(100 * (1 - bestTotal / origTotal)).toFixed(1)}%)`);

writeFileSync(
  path.join(ROOT, "scripts", "image-report.generated.json"),
  JSON.stringify({ ssimFloor: PHOTO_SSIM_FLOOR, results }, null, 2) + "\n",
  "utf-8",
);
console.log("  detail written to scripts/image-report.generated.json");

// ---------- variant manifest ----------
// Which modern siblings actually exist, keyed by the public path of the fallback. The <Picture>
// component reads this so it only ever emits a <source> for a file that is really on disk —
// a missing AVIF <source> would otherwise be a broken image, not a graceful fallback.
const manifest = {};
for (const r of results.sort((a, b) => a.file.localeCompare(b.file))) {
  const base = r.file.replace(/\.(jpe?g|png)$/i, "");
  const entry = {};
  if (r.kept.includes("avif")) entry.avif = `/img/${base}.avif`;
  if (r.kept.includes("webp")) entry.webp = `/img/${base}.webp`;
  if (Object.keys(entry).length) manifest[`/img/${r.file}`] = entry;
}
writeFileSync(
  path.join(ROOT, "src", "data", "image-variants.json"),
  JSON.stringify(manifest, null, 2) + "\n",
  "utf-8",
);
console.log(`  variant manifest: ${Object.keys(manifest).length} entries -> src/data/image-variants.json`);
