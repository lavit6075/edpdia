export const SITE_URL = "https://edpdia.vercel.app";
export const SITE_NAME = "Edpdia";

/**
 * Imperatively manage <head> tags for the current route.
 *
 * These tags are written by effects, i.e. after JS runs — but the build prerenders every route
 * (scripts/prerender.mjs snapshots the settled DOM), so the raw HTML response already carries
 * them. That matters because most social-card scrapers (Facebook, Twitter/X, LinkedIn, Slack,
 * WhatsApp) do not execute JS; before prerendering they saw the same empty index.html for every
 * route and no per-page link previews were possible.
 */

type MetaSpec = {
  title: string;
  description: string;
  /** Absolute or site-relative; relativised URLs are resolved against SITE_URL. */
  image?: string;
  /** Path only, e.g. "/schools/kellett-school". */
  path: string;
  type?: "website" | "article";
  locale?: string;
  /**
   * Keep the page out of search results. Set on views whose content comes from the URL query or
   * from localStorage (compare, shortlist): there is no stable document for a crawler to index,
   * and a canonical pointing at an empty version of the page would be worse than no listing.
   */
  noIndex?: boolean;
};

function upsert(selector: string, create: () => HTMLElement) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

function setMetaByName(name: string, content: string) {
  const el = upsert(`meta[name="${name}"]`, () => {
    const m = document.createElement("meta");
    m.setAttribute("name", name);
    return m;
  });
  el.setAttribute("content", content);
}

function setMetaByProperty(property: string, content: string) {
  const el = upsert(`meta[property="${property}"]`, () => {
    const m = document.createElement("meta");
    m.setAttribute("property", property);
    return m;
  });
  el.setAttribute("content", content);
}

function absolute(url: string) {
  return url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function applyMeta({
  title, description, image, path, type = "website", locale = "en_HK", noIndex = false,
}: MetaSpec) {
  const url = absolute(path);
  const img = image ? absolute(image) : `${SITE_URL}/favicon.svg`;

  document.title = title;
  setMetaByName("description", description);
  setMetaByName("robots", noIndex ? "noindex, follow" : "index, follow");

  const canonical = upsert('link[rel="canonical"]', () => {
    const l = document.createElement("link");
    l.setAttribute("rel", "canonical");
    return l;
  });
  canonical.setAttribute("href", url);

  setMetaByProperty("og:site_name", SITE_NAME);
  setMetaByProperty("og:title", title);
  setMetaByProperty("og:description", description);
  setMetaByProperty("og:type", type);
  setMetaByProperty("og:url", url);
  setMetaByProperty("og:image", img);
  setMetaByProperty("og:locale", locale);

  setMetaByName("twitter:card", image ? "summary_large_image" : "summary");
  setMetaByName("twitter:title", title);
  setMetaByName("twitter:description", description);
  setMetaByName("twitter:image", img);
}

const LD_ID = "edpdia-jsonld";

/** Replace the route's JSON-LD block. Passing null clears it. */
export function applyJsonLd(data: object | object[] | null) {
  document.getElementById(LD_ID)?.remove();
  if (!data) return;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = LD_ID;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "An independent, encyclopaedia-style directory of Hong Kong international schools — curricula, admissions information, and official sources in one place.",
};
