#!/usr/bin/env node
/**
 * Download every remote image referenced by schools.json into public/img/, then rewrite the
 * data to point at the local copies.
 *
 * Why: logos were hotlinked from each school's own servers and photos from
 * upload.wikimedia.org. Both can break silently — a school redesigns and the logo 404s, or a
 * privacy extension / restrictive network blocks the third-party host and the image vanishes
 * for that visitor with no error anywhere we'd see. Serving from our own origin removes the
 * whole class of failure.
 *
 * Attribution is unaffected: author, licence, licence URL and the Commons file page all stay
 * in the data and keep rendering. Hosting a copy is exactly what CC BY / BY-SA permit.
 *
 * Idempotent — files already present are skipped, so re-running is cheap.
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "src", "data", "schools.json");
const OUT_DIR = path.join(ROOT, "public", "img");

const UA = "EdpdiaBuild/1.0 (https://edpdia.vercel.app; contact hello@edpdia.hk)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const EXT_BY_TYPE = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/svg+xml": ".svg",
  "image/webp": ".webp",
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico",
  "image/gif": ".gif",
};

async function download(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = (res.headers.get("content-type") || "").split(";")[0].trim();
      const ext = EXT_BY_TYPE[type];
      if (!ext) throw new Error(`unexpected content-type: ${type || "(none)"}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 100) throw new Error(`suspiciously small: ${buf.length}B`);
      return { buf, ext };
    } catch (err) {
      if (attempt === 3) throw err;
      await sleep(1500 * (attempt + 1));
    }
  }
}

/** Stable, collision-proof filename derived from the source URL. */
function nameFor(prefix, url) {
  return `${prefix}-${createHash("sha1").update(url).digest("hex").slice(0, 12)}`;
}

const schools = JSON.parse(await import("node:fs").then((m) => m.promises.readFile(DATA, "utf-8")));
mkdirSync(OUT_DIR, { recursive: true });

const jobs = [];
for (const school of schools) {
  if (school.logoUrl && !school.logoUrl.startsWith("/")) {
    jobs.push({ url: school.logoUrl, base: nameFor(`logo-${school.slug}`, school.logoUrl),
      apply: (p) => { school.logoUrl = p; } });
  }
  for (const [i, photo] of school.photos.entries()) {
    if (!photo.url.startsWith("/")) {
      jobs.push({ url: photo.url, base: nameFor(`${school.slug}-${i}`, photo.url),
        apply: (p) => { photo.url = p; } });
    }
    if (!photo.thumbUrl.startsWith("/")) {
      jobs.push({ url: photo.thumbUrl, base: nameFor(`${school.slug}-${i}-t`, photo.thumbUrl),
        apply: (p) => { photo.thumbUrl = p; } });
    }
  }
}

console.log(`${jobs.length} remote images to localise\n`);
let downloaded = 0, skipped = 0, bytes = 0;
const failures = [];

for (const job of jobs) {
  const existing = [".jpg", ".png", ".svg", ".webp", ".ico", ".gif"]
    .map((e) => job.base + e)
    .find((f) => existsSync(path.join(OUT_DIR, f)));
  if (existing) {
    job.apply(`/img/${existing}`);
    bytes += statSync(path.join(OUT_DIR, existing)).size;
    skipped++;
    continue;
  }
  try {
    const { buf, ext } = await download(job.url);
    const file = job.base + ext;
    writeFileSync(path.join(OUT_DIR, file), buf);
    job.apply(`/img/${file}`);
    bytes += buf.length;
    downloaded++;
    process.stdout.write(`  ${String(downloaded + skipped).padStart(3)}/${jobs.length}  ${file}  ${(buf.length / 1024).toFixed(0)}KB\n`);
    await sleep(250);
  } catch (err) {
    failures.push(`${job.url} -> ${err.message}`);
  }
}

writeFileSync(DATA, JSON.stringify(schools, null, 2) + "\n", "utf-8");

console.log(`\ndownloaded: ${downloaded}   already present: ${skipped}   failed: ${failures.length}`);
console.log(`public/img total: ${(bytes / 1024 / 1024).toFixed(1)} MB`);
if (failures.length) {
  console.log("\nFAILURES (these keep their remote URL):");
  failures.forEach((f) => console.log("  ✗ " + f));
  process.exitCode = 1;
}
