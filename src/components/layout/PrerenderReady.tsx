import { useEffect } from "react";

declare global {
  interface Window {
    __PRERENDER_READY__?: boolean;
  }
}

/**
 * Signals to the prerenderer that the current route has finished rendering.
 *
 * Why an app-level signal rather than a fixed timeout: a timeout is a guess that is either
 * wastefully long or flakily short, and it silently captures half-rendered HTML when it loses
 * the race. This flips only after React has committed and the browser has painted.
 *
 * Placement matters. This lives in Layout, which is the PARENT of the routed page (rendered
 * through <Outlet/>). React runs effects child-first, so the page's own useSeo effect — which
 * writes title/canonical/og/JSON-LD into <head> — has already run by the time this fires.
 * The prerenderer therefore never captures a page before its metadata exists.
 *
 * Double rAF: the first callback runs before paint, the second after it, so the flag means
 * "painted", not merely "committed".
 */
export function PrerenderReady() {
  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        window.__PRERENDER_READY__ = true;
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      if (inner) cancelAnimationFrame(inner);
    };
  });

  return null;
}
