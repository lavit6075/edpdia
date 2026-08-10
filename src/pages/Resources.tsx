import { useLanguage } from "../i18n/LanguageContext";
import { RESOURCE_ARTICLES } from "../lib/resourcesData";
import { DecorativeBanner } from "../components/DecorativeBanner";
import { DECORATIVE_IMAGES } from "../lib/decorativeImages";

export function Resources() {
  const { t, language } = useLanguage();
  const zh = language === "zh-HK";

  return (
    <div>
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
            {t("resourcesPage.heroTitle")}
          </h1>
          <p className="mt-3 text-neutral-600">{t("resourcesPage.heroSubtitle")}</p>
        </div>
      </section>

      <DecorativeBanner image={DECORATIVE_IMAGES.resources} heightClass="h-32 sm:h-40" />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {RESOURCE_ARTICLES.map((article) => (
            <article
              key={article.id}
              className="flex flex-col rounded-lg border border-neutral-200 p-5"
            >
              <span className="w-fit rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                {zh ? article.tagZh : article.tagEn}
              </span>
              <h2 className="mt-3 text-base font-semibold text-neutral-900">
                {zh ? article.titleZh : article.titleEn}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                {zh ? article.excerptZh : article.excerptEn}
              </p>
              <span className="mt-4 text-sm font-semibold text-neutral-300" aria-disabled="true">
                {t("resourcesPage.readMore")}
              </span>
            </article>
          ))}
        </div>

        <p className="mt-10 rounded-md bg-neutral-50 p-4 text-xs leading-relaxed text-neutral-500">
          {t("resourcesPage.disclaimer")}
        </p>
      </div>
    </div>
  );
}
