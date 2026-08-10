import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export function About() {
  const { t } = useLanguage();

  const neutralityPoints = [
    { title: t("about.neutralPoint1Title"), body: t("about.neutralPoint1Body") },
    { title: t("about.neutralPoint2Title"), body: t("about.neutralPoint2Body") },
    { title: t("about.neutralPoint3Title"), body: t("about.neutralPoint3Body") },
    { title: t("about.neutralPoint4Title"), body: t("about.neutralPoint4Body") },
  ];

  return (
    <div>
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
            {t("about.heroTitle")}
          </h1>
          <p className="mt-3 text-lg text-neutral-600">{t("about.heroSubtitle")}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <section>
          <h2 className="text-xl font-semibold text-neutral-900">{t("about.missionTitle")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700">{t("about.missionBody")}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-neutral-900">{t("about.storyTitle")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700">{t("about.storyBody")}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-neutral-900">{t("about.audienceTitle")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700">{t("about.audienceBody")}</p>
        </section>

        <section className="mt-10 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-neutral-900">{t("about.neutralityTitle")}</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {neutralityPoints.map((point) => (
              <div key={point.title} className="rounded-lg border border-neutral-200 p-4">
                <h3 className="text-sm font-semibold text-neutral-900">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{point.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-lg bg-neutral-50 p-6 text-center">
          <p className="text-sm text-neutral-700">{t("about.correctionsCta")}</p>
          <Link
            to="/contact"
            className="mt-3 inline-block rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            {t("about.contactLink")}
          </Link>
        </section>
      </div>
    </div>
  );
}
