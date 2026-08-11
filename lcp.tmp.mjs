// Measures LCP for a URL over N runs, on a cold cache, under a fixed throttle profile so
// before/after numbers are comparable.
import { chromium } from "playwright";

const URL_ = process.argv[2];
const RUNS = Number(process.argv[3] || 5);
const LABEL = process.argv[4] || "";

// Slow 4G-ish. Unthrottled localhost/CDN numbers hide load-order effects entirely.
const THROTTLE = { downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 150, offline: false };

const browser = await chromium.launch();
const runs = [];
for (let i = 0; i < RUNS; i++) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", THROTTLE);
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });

  await page.addInitScript(() => {
    window.__lcp = 0;
    window.__lcpEl = "";
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        window.__lcp = e.startTime;
        window.__lcpEl = e.element ? `${e.element.tagName}${e.element.currentSrc ? " " + e.element.currentSrc.split("/").pop() : ""}` : e.url || "(no element)";
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });

  await page.goto(URL_, { waitUntil: "load", timeout: 90000 });
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));
  const { lcp, el, fcp } = await page.evaluate(() => ({
    lcp: window.__lcp,
    el: window.__lcpEl,
    fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0,
  }));
  runs.push({ lcp, fcp, el });
  await ctx.close();
}
await browser.close();

const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const lcps = runs.map((r) => r.lcp);
console.log(`${LABEL}${URL_}`);
console.log(`  LCP element : ${runs[0].el}`);
console.log(`  FCP  median : ${med(runs.map((r) => r.fcp)).toFixed(0)} ms`);
console.log(`  LCP  median : ${med(lcps).toFixed(0)} ms   (min ${Math.min(...lcps).toFixed(0)}, max ${Math.max(...lcps).toFixed(0)}, n=${RUNS})`);
console.log(`  all runs    : ${lcps.map((v) => v.toFixed(0)).join(", ")} ms`);
