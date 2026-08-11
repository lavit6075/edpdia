#!/usr/bin/env node
/**
 * Prerender every known route into dist/<route>/index.html.
 *
 * Serves the built dist/ over a local static server, visits each route in headless Chromium,
 * waits for the app to signal readiness, then snapshots the fully-rendered document — <head>
 * metadata and JSON-LD included, since those are written by effects.
 *
 * Route list comes from scripts/routes.generated.json, the SAME file that drives the 404
 * config, so the set of pages we prerender can never drift from the set we serve 200s for.
 *
 * Settle condition is deliberately NOT a fixed timeout:
 *   1. Playwright `networkidle`  — bundle, CSS and above-the-fold images have landed.
 *   2. `window.__PRERENDER_READY__` — React has committed AND painted the route, which means
 *      the page's useSeo effect has already written <head> (child effects run before the
 *      Layout-level signal).
 * Both must hold. A timeout only exists as a failure tripwire, never as the happy path.
 *
 * Any hydration or console error is reported and fails the build rather than being swallowed.
 */
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const ROUTES = JSON.parse(readFileSync(path.join(ROOT, "scripts/routes.generated.json"), "utf-8")).routes;

// Snapshot the pristine shell BEFORE any writes. Prerendering "/" overwrites
// dist/index.html, and if the fallback then served that rendered homepage, every later route
// would try to hydrate the homepage's markup against a different route — a self-inflicted
// hydration mismatch on 21 of 22 pages. Serving the in-memory shell keeps the fallback honest.
const SHELL_HTML = readFileSync(path.join(DIST, "index.html"), "utf-8");

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".ico": "image/x-icon", ".xml": "application/xml", ".txt": "text/plain",
  ".json": "application/json",
};

/** Static server that mirrors production: real files win, everything else gets the SPA shell. */
function serve(port) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = decodeURIComponent((req.url || "/").split("?")[0]);
      const file = path.join(DIST, url);
      // Real asset? Serve it. Anything else gets the pristine shell, never a rendered page.
      if (existsSync(file) && !statSync(file).isDirectory() && path.extname(file) !== ".html") {
        res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
        res.end(readFileSync(file));
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(SHELL_HTML);
    });
    server.listen(port, () => resolve(server));
  });
}

const PORT = 4178;
const server = await serve(PORT);
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

const problems = [];
const snapshots = [];
let written = 0;

for (const route of ROUTES) {
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error" && msg.type() !== "warning") return;
    const text = msg.text();
    // React reports hydration problems as errors/warnings mentioning hydrat*.
    if (/hydrat|did not match|Text content does not match/i.test(text)) {
      problems.push(`[HYDRATION] ${route}: ${text}`);
    } else if (msg.type() === "error") {
      consoleErrors.push(text);
    }
  });
  page.on("pageerror", (err) => problems.push(`[PAGEERROR] ${route}: ${err.message}`));

  try {
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle", timeout: 45000 });
    // App-level readiness, not a sleep.
    await page.waitForFunction(() => window.__PRERENDER_READY__ === true, null, { timeout: 30000 });

    const html = await page.content();

    // Guard against snapshotting an empty shell.
    const rootLen = await page.evaluate(() => document.getElementById("root")?.innerHTML.length ?? 0);
    if (rootLen < 500) throw new Error(`#root only ${rootLen} chars — looks unrendered`);
    if (!/<title>/i.test(html)) throw new Error("no <title> in snapshot");

    snapshots.push({ route, html });
    written++;

    const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
    console.log(`  ${String(written).padStart(2)}/${ROUTES.length}  ${route.padEnd(48)} ${kb}KB`);
    if (consoleErrors.length) problems.push(`[CONSOLE] ${route}: ${consoleErrors[0]}`);
  } catch (err) {
    problems.push(`[FAILED] ${route}: ${err.message}`);
  }
  await page.close();
}

await browser.close();
server.close();

// Flush every snapshot only once the crawl is finished.
for (const { route, html } of snapshots) {
  const outDir = route === "/" ? DIST : path.join(DIST, route);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
}

console.log(`\nprerendered ${written}/${ROUTES.length} routes`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s) — NOT suppressed:`);
  problems.forEach((p) => console.log("  ✗ " + p));
  process.exitCode = 1;
} else {
  console.log("no hydration mismatches, page errors or console errors");
}
