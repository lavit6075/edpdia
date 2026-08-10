import { useEffect, useRef } from "react";

/**
 * Adds `.is-visible` to the element the first time it scrolls into view, which triggers the
 * `.reveal` fade/slide-up defined in index.css.
 *
 * Reveals once and then stops observing — content shouldn't re-animate on every scroll pass.
 * If the browser lacks IntersectionObserver, or the user prefers reduced motion, the element
 * is marked visible immediately so nothing is ever left hidden.
 */
export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
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
