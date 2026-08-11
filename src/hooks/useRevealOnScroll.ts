import { useEffect, useRef } from "react";

/**
 * Fades/slides an element up the first time it scrolls into view.
 *
 * Inverted on purpose: `.reveal` is VISIBLE by default and this hook *hides* off-screen elements
 * by setting `data-reveal-pending`, rather than starting them hidden and revealing them. Two
 * reasons, both from prerendering:
 *
 *  - The prerendered HTML must paint content immediately. If the hidden state were the CSS
 *    default, every prerendered page would arrive at opacity 0 and stay blank until JS ran.
 *  - Anything this hook writes before the snapshot is taken lands in dist/<route>/index.html, and
 *    React's hydration diffs *every* attribute on a node it owns — including ones it never
 *    rendered. So prerender.mjs strips `data-reveal-pending` from the snapshot, and the hook
 *    re-applies it on the client only where it is invisible to do so.
 *
 * Elements already inside the viewport at mount are left alone entirely — arming them would blink
 * content the prerendered HTML has already painted. Reduced motion and missing IntersectionObserver
 * take the same path: do nothing, stay visible.
 */
export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") return;

    // Already on screen: leave it visible. Hiding it now would flash after hydration.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    el.setAttribute("data-reveal-pending", "");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.removeAttribute("data-reveal-pending");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
