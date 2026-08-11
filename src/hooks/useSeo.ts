import { useEffect } from "react";
import { applyMeta, applyJsonLd } from "../lib/seo";
import { useLanguage } from "../i18n/LanguageContext";

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: object | object[] | null;
  /** See applyMeta — for views whose content comes from the query string or localStorage. */
  noIndex?: boolean;
}

/**
 * Sets per-route <head> metadata and JSON-LD, and clears the JSON-LD on unmount so structured
 * data never leaks from one route into the next.
 *
 * Locale tracks the active language so og:locale is honest about which content is rendered,
 * even though both languages currently share one URL (see README — real /zh-HK/ routes are a
 * separate, larger piece of work).
 */
export function useSeo({ title, description, path, image, type, jsonLd = null, noIndex = false }: SeoOptions) {
  const { language } = useLanguage();

  useEffect(() => {
    applyMeta({
      title,
      description,
      path,
      image,
      type,
      noIndex,
      locale: language === "zh-HK" ? "zh_HK" : "en_HK",
    });
    applyJsonLd(jsonLd);
    return () => applyJsonLd(null);
    // jsonLd is an object literal at most call sites; serialise so we don't loop on identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, type, noIndex, language, JSON.stringify(jsonLd)]);
}
