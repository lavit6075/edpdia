import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { FAQ_ENTRIES } from "../lib/faqData";

export function Faq() {
  const { t, language } = useLanguage();
  const zh = language === "zh-HK";
  const [openId, setOpenId] = useState<string | null>(FAQ_ENTRIES[0]?.id ?? null);

  return (
    <div>
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
            {t("faqPage.heroTitle")}
          </h1>
          <p className="mt-3 text-neutral-600">{t("faqPage.heroSubtitle")}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
          {FAQ_ENTRIES.map((entry) => {
            const isOpen = openId === entry.id;
            return (
              <div key={entry.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : entry.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-neutral-900">
                    {zh ? entry.questionZh : entry.questionEn}
                  </span>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-neutral-600">
                    {zh ? entry.answerZh : entry.answerEn}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
