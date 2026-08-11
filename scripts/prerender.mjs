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
 * Runs in two passes. Pass 1 crawls with the shell as the HTML fallback and writes the snapshots.
 * Pass 2 re-serves dist the way Vercel does — prerendered file first — and reloads every route so
 * hydrateRoot actually runs against the written markup; that is the only configuration in which a
 * hydration mismatch is observable. Any hydration or console error is reported and fails the build
 * rather than being swallowed.
 */
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const ROUTE_CONFIG = JSON.parse(readFileSync(path.join(ROOT, "scripts/routes.generated.json"), "utf-8"));
// prerenderOnly pages (currently just /404) get static HTML but stay out of the sitemap.
const ROUTES = [...ROUTE_CONFIG.routes, ...(ROUTE_CONFIG.prerenderOnly ?? [])];

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

/**
 * Static server used for both passes.
 *
 * `mode: "shell"` (crawl pass) — assets are served from disk but every HTML request gets the
 * pristine shell. Snapshots must be produced from a clean client render, never from a previously
 * written snapshot.
 *
 * `mode: "files"` (verify pass) — mirrors Vercel: dist/<route>/index.html wins, shell is only the
 * last-resort fallback. This is the ONLY configuration in which hydrateRoot actually runs against
 * prerendered markup, so it is the only one where a hydration mismatch can be observed at all.
 */
function serve(port, mode) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = decodeURIComponent((req.url || "/").split("?")[0]);
      const file = path.join(DIST, url);
      if (existsSync(file) && !statSync(file).isDirectory() && path.extname(file) !== ".html") {
        res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
        res.end(readFileSync(file));
        return;
      }
      if (mode === "files") {
        const page = path.join(DIST, url, "index.html");
        if (existsSync(page)) {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(readFileSync(page));
          return;
        }
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(SHELL_HTML);
    });
    server.listen(port, () => resolve(server));
  });
}

/** Loads a route and returns every console/page error it produced, split by kind. */
async function visit(context, port, route) {
  const page = await context.newPage();
  const hydration = [];
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error" && msg.type() !== "warning") return;
    const text = msg.text();
    // React reports hydration problems as errors/warnings mentioning hydrat*, or as the
    // minified-invariant codes #418/#423/#425 in a production build.
    if (/hydrat|#418|#423|#425|did not match|didn't match/i.test(text)) hydration.push(text);
    else if (msg.type() === "error") consoleErrors.push(text);
  });
  page.on("pageerror", (err) => {
    if (/hydrat|#418|#423|#425|did not match|didn't match/i.test(err.message)) hydration.push(err.message);
    else consoleErrors.push(err.message);
  });
  await page.goto(`http://localhost:${port}${route}`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForFunction(() => window.__PRERENDER_READY__ === true, null, { timeout: 30000 });
  return { page, hydration, consoleErrors };
}

const PORT = 4178;
let server = await serve(PORT, "shell");
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

const problems = [];
const snapshots = [];
let written = 0;

console.log("pass 1 — crawl (shell fallback, clean client render)");
for (const route of ROUTES) {
  let page;
  try {
    const visited = await visit(context, PORT, route);
    page = visited.page;
    const { consoleErrors } = visited;

    // Strip client-only decoration state before serialising. `data-reveal-pending` is written by
    // useRevealOnScroll on off-screen elements; React owns those nodes and diffs every attribute on
    // them during hydration, so leaving it in the snapshot warns on every card. The hook re-applies
    // it after hydration where it is invisible to do so.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll("[data-reveal-pending]")) {
        el.removeAttribute("data-reveal-pending");
      }
    });

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
  if (page) await page.close();
}

server.close();

// Flush every snapshot only once the crawl is finished.
for (const { route, html } of snapshots) {
  const outDir = route === "/" ? DIST : path.join(DIST, route);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
}
console.log(`\nprerendered ${written}/${ROUTES.length} routes`);

// ---------------------------------------------------------------------------
// Pass 2 — hydration verification.
//
// Pass 1 CANNOT detect hydration mismatches: it serves the empty shell, so #root has no children
// and main.tsx takes the createRoot branch. hydrateRoot never runs, so there is nothing to
// mismatch. An earlier version of this script reported "no hydration mismatches" from pass 1
// alone; that result was vacuous and hid a #418 on every route. This pass re-serves dist the way
// Vercel does — prerendered file first — so hydrateRoot runs against the real markup.
// ---------------------------------------------------------------------------
console.log("\npass 2 — verify hydration (prerendered files served first)");
server = await serve(PORT, "files");
let hydrated = 0;
for (const route of ROUTES) {
  try {
    const { page, hydration, consoleErrors } = await visit(context, PORT, route);
    const didHydrate = await page.evaluate(() => window.__HYDRATED__ === true);
    if (!didHydrate) problems.push(`[NOT-HYDRATED] ${route}: served markup had no #root children`);
    else hydrated++;
    for (const h of hydration) problems.push(`[HYDRATION] ${route}: ${h}`);
    for (const c of consoleErrors) problems.push(`[CONSOLE] ${route}: ${c}`);
    await page.close();
  } catch (err) {
    problems.push(`[VERIFY-FAILED] ${route}: ${err.message}`);
  }
}
console.log(`  hydrated ${hydrated}/${ROUTES.length} routes against prerendered markup`);

await browser.close();
server.close();

if (problems.length) {
  console.log(`\n${problems.length} problem(s) — NOT suppressed:`);
  problems.forEach((p) => console.log("  ✗ " + p));
  process.exitCode = 1;
} else {
  console.log("\nno hydration mismatches, page errors or console errors");
}
