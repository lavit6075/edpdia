#!/usr/bin/env node
/**
 * Generate sitemap.xml, robots.txt and the Vercel routing config.
 *
 * The 404 problem: a blanket SPA rewrite (`/(.*)` -> /index.html) makes EVERY path return
 * HTTP 200 with the app shell, including /sitemap.xml and /robots.txt before they existed.
 * Search engines treat that as a soft 404 — thin duplicate pages indexed under junk URLs.
 *
 * The route set here is small and fully known at build time (10 static paths + 12 school
 * slugs), so instead of a catch-all we enumerate the real routes and let everything else fall
 * through to a genuine 404. Vercel's `routes` supports an explicit status, which `rewrites`
 * does not — hence routes rather than rewrites.
 *
 * Run as part of `npm run build` so the route list can never drift from the data.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const schools = JSON.parse(readFileSync(path.join(ROOT, "src/data/schools.json"), "utf-8"));
const SITE = "https://edpdia.vercel.app";

/** Static routes, with sitemap priority/changefreq. */
const STATIC_ROUTES = [
  { p: "/", pr: "1.0", cf: "weekly" },
  { p: "/schools", pr: "0.9", cf: "weekly" },
  { p: "/admissions", pr: "0.8", cf: "monthly" },
  { p: "/admissions/timeline", pr: "0.7", cf: "monthly" },
  { p: "/resources", pr: "0.6", cf: "monthly" },
  { p: "/about", pr: "0.6", cf: "monthly" },
  { p: "/faq", pr: "0.6", cf: "monthly" },
  { p: "/contact", pr: "0.5", cf: "yearly" },
  { p: "/compare", pr: "0.4", cf: "monthly" },
  { p: "/shortlist", pr: "0.3", cf: "yearly" },
];

const schoolRoutes = schools.map((s) => ({
  p: `/schools/${s.slug}`,
  pr: "0.8",
  cf: "monthly",
  lastmod: s.lastVerified || null,
}));

const all = [...STATIC_ROUTES, ...schoolRoutes];

// ---------- sitemap.xml ----------
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
${all
  .map(
    (r) => `  <url>
    <loc>${SITE}${r.p}</loc>
    <lastmod>${r.lastmod || today}</lastmod>
    <changefreq>${r.cf}</changefreq>
    <priority>${r.pr}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`.replace("http://www.sitemap.org", "http://www.sitemaps.org");

writeFileSync(path.join(ROOT, "public/sitemap.xml"), sitemap, "utf-8");

// ---------- robots.txt ----------
// /compare and /shortlist are per-visitor UI state, not content worth indexing.
writeFileSync(
  path.join(ROOT, "public/robots.txt"),
  `User-agent: *
Allow: /
Disallow: /compare
Disallow: /shortlist

Sitemap: ${SITE}/sitemap.xml
`,
  "utf-8",
);

// ---------- routes.generated.json ----------
// Single source of truth shared by the prerenderer and the 404 route config, so the set of
// pages we prerender can never drift from the set we serve 200s for.
writeFileSync(
  path.join(ROOT, "scripts/routes.generated.json"),
  JSON.stringify({ routes: all.map((r) => r.p) }, null, 2) + "\n",
  "utf-8",
);

// ---------- vercel.json ----------
const appRoutes = all.filter((r) => r.p !== "/compare" && r.p !== "/shortlist").map((r) => r.p);
const spaPaths = [...appRoutes, "/compare", "/shortlist"];

const vercel = {
  $schema: "https://openapi.vercel.sh/vercel.json",
  routes: [
    // Real files (assets, images, sitemap, robots, favicon) win first.
    { handle: "filesystem" },
    // Known application routes -> their prerendered HTML, HTTP 200.
    // Explicit dest rather than relying on filesystem directory-index resolution, so the
    // mapping is deterministic. Falls back to the shell if a page wasn't prerendered.
    ...spaPaths.map((p) => ({
      src: `^${p.replace(/\//g, "\\/")}\\/?$`,
      dest: p === "/" ? "/index.html" : `${p}/index.html`,
    })),
    // Anything else is genuinely not a page: serve the shell but with a real 404 status,
    // so crawlers and monitoring see 404 rather than a soft 200.
    { src: "/.*", status: 404, dest: "/index.html" },
  ],
};
writeFileSync(path.join(ROOT, "vercel.json"), JSON.stringify(vercel, null, 2) + "\n", "utf-8");

console.log(`sitemap.xml: ${all.length} URLs`);
console.log(`robots.txt written`);
console.log(`vercel.json: ${spaPaths.length} explicit routes + filesystem + 404 catch-all`);
