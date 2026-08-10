import { useMemo, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { TIMELINE_STEPS, type AdmissionLevel } from "../lib/timelineSteps";

function getIntakeYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const firstIntakeYear = currentYear + 1;
  return [firstIntakeYear, firstIntakeYear + 1, firstIntakeYear + 2];
}

function formatIntakeYear(startYear: number): string {
  return `${startYear}/${String((startYear + 1) % 100).padStart(2, "0")}`;
}

function stepDate(startYear: number, monthsBefore: number): Date {
  const intake = new Date(startYear, 8, 1); // September 1
  intake.setMonth(intake.getMonth() - monthsBefore);
  return intake;
}

export function AdmissionsTimeline() {
  const { t, language } = useLanguage();
  const intakeYearOptions = useMemo(() => getIntakeYearOptions(), []);
  const [level, setLevel] = useState<AdmissionLevel>("primary");
  const [intakeYear, setIntakeYear] = useState<number>(intakeYearOptions[0]);

  const steps = useMemo(
    () =>
      TIMELINE_STEPS.filter((step) => !step.levels || step.levels.includes(level)).sort(
        (a, b) => b.monthsBefore - a.monthsBefore,
      ),
    [level],
  );

  const dateFormatter = new Intl.DateTimeFormat(language === "zh-HK" ? "zh-HK" : "en-HK", {
    year: "numeric",
    month: "long",
  });

  const levelOptions: { value: AdmissionLevel; label: string }[] = [
    { value: "kindergarten", label: t("timeline.levelKindergarten") },
    { value: "primary", label: t("timeline.levelPrimary") },
    { value: "secondary", label: t("timeline.levelSecondary") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
        {t("timeline.title")}
      </h1>
      <p className="mt-2 text-neutral-600">{t("timeline.subtitle")}</p>

      <div className="mt-8 grid gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-neutral-900">
          {t("timeline.levelLabel")}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as AdmissionLevel)}
            className="mt-2 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-normal focus:border-brand-500 focus:outline-none"
          >
            {levelOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-neutral-900">
          {t("timeline.intakeLabel")}
          <select
            value={intakeYear}
            onChange={(e) => setIntakeYear(Number(e.target.value))}
            className="mt-2 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-normal focus:border-brand-500 focus:outline-none"
          >
            {intakeYearOptions.map((year) => (
              <option key={year} value={year}>
                {formatIntakeYear(year)} {t("timeline.intakeSuffix")}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ol className="mt-8 space-y-6 border-l-2 border-neutral-200 pl-6">
        {steps.map((step, i) => {
          const date = stepDate(intakeYear, step.monthsBefore);
          const isIntakeMonth = step.monthsBefore === 0;
          return (
            <li key={i} className="relative">
              <span
                className={`absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 border-white ${
                  isIntakeMonth ? "bg-accent-500" : "bg-brand-500"
                }`}
              />
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                {dateFormatter.format(date)}
                {!isIntakeMonth && (
                  <span className="ml-1 font-normal normal-case text-neutral-400">
                    · {step.monthsBefore} {t("timeline.monthsBeforeIntake")}
                  </span>
                )}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-800">
                {language === "zh-HK" ? step.zh : step.en}
              </p>
            </li>
          );
        })}
      </ol>

      <p className="mt-10 rounded-md bg-warn-50 p-4 text-xs leading-relaxed text-warn-700">
        {t("timeline.disclaimer")}
      </p>
    </div>
  );
}
