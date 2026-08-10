import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { CHECKLIST_ITEMS, EXAM_TYPES, PROCESS_STEPS } from "../lib/admissionsGuideData";

export function Admissions() {
  const { t, language } = useLanguage();
  const zh = language === "zh-HK";

  return (
    <div>
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
            {t("admissionsPage.heroTitle")}
          </h1>
          <p className="mt-3 text-neutral-600">{t("admissionsPage.heroSubtitle")}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Process */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900">{t("admissionsPage.processTitle")}</h2>
          <p className="mt-2 text-sm text-neutral-600">{t("admissionsPage.processSubtitle")}</p>
          <ol className="mt-6 space-y-4 border-l-2 border-neutral-200 pl-6">
            {PROCESS_STEPS.map((step, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-neutral-800">{zh ? step.zh : step.en}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Exam types */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-neutral-900">{t("admissionsPage.examTypesTitle")}</h2>
          <p className="mt-2 text-sm text-neutral-600">{t("admissionsPage.examTypesSubtitle")}</p>
          <div className="mt-6 space-y-4">
            {EXAM_TYPES.map((exam) => (
              <div key={exam.code} className="rounded-lg border border-neutral-200 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    {zh ? exam.nameZh : exam.nameEn}
                  </h3>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                    {zh ? exam.levelZh : exam.levelEn}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {zh ? exam.descZh : exam.descEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-neutral-900">{t("admissionsPage.checklistTitle")}</h2>
          <p className="mt-2 text-sm text-neutral-600">{t("admissionsPage.checklistSubtitle")}</p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {CHECKLIST_ITEMS.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-accent-600">
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                    clipRule="evenodd"
                  />
                </svg>
                {zh ? item.zh : item.en}
              </li>
            ))}
          </ul>
        </section>

        {/* Timeline CTA */}
        <section className="mt-12 rounded-lg bg-brand-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-neutral-900">{t("admissionsPage.timelineCtaTitle")}</h2>
          <p className="mt-2 text-sm text-neutral-700">{t("admissionsPage.timelineCtaBody")}</p>
          <Link
            to="/admissions/timeline"
            className="mt-4 inline-block rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            {t("timeline.linkFromAdmissions")}
          </Link>
        </section>

        <p className="mt-10 rounded-md bg-warn-50 p-4 text-xs leading-relaxed text-warn-700">
          {t("admissionsPage.disclaimer")}
        </p>
      </div>
    </div>
  );
}
