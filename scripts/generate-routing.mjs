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
];

/**
 * Prerendered and served 200, but never listed in the sitemap and marked noindex in-page.
 * Both render whatever is in the URL query or the visitor's localStorage, so the prerendered
 * copy is an empty comparison and an empty shortlist. Advertising those in a sitemap invites
 * crawlers to index a permanently empty page under a useful-sounding title.
 */
const NOINDEX_ROUTES = [{ p: "/compare" }, { p: "/shortlist" }];

const schoolRoutes = schools.map((s) => ({
  p: `/schools/${s.slug}`,
  pr: "0.8",
  cf: "monthly",
  lastmod: s.lastVerified || null,
}));

/** Everything that gets a 200 and a prerendered file. */
const all = [...STATIC_ROUTES, ...schoolRoutes, ...NOINDEX_ROUTES];
/** Subset that also belongs in the sitemap. */
const indexable = [...STATIC_ROUTES, ...schoolRoutes];

// ---------- sitemap.xml ----------
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
${indexable
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
  JSON.stringify(
    {
      routes: all.map((r) => r.p),
      // Prerendered but deliberately kept OUT of the sitemap: this is the body served with a
      // 404 status. Without it the catch-all would serve the prerendered homepage, which both
      // shows the wrong content to crawlers and hydration-mismatches against <NotFound/>.
      prerenderOnly: ["/404"],
    },
    null,
    2,
  ) + "\n",
  "utf-8",
);

// ---------- vercel.json ----------
const spaPaths = all.map((r) => r.p);

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
    { src: "/.*", status: 404, dest: "/404/index.html" },
  ],
};
writeFileSync(path.join(ROOT, "vercel.json"), JSON.stringify(vercel, null, 2) + "\n", "utf-8");

console.log(`sitemap.xml: ${indexable.length} URLs (${NOINDEX_ROUTES.length} routes noindex, excluded)`);
console.log(`robots.txt written`);
console.log(`vercel.json: ${spaPaths.length} explicit routes + filesystem + 404 catch-all`);
