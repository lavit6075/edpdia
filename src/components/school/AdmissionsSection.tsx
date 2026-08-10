import type { Admissions } from "../../types/school";
import { NotPublished, formatHKD } from "./NotPublished";
import { useLanguage } from "../../i18n/LanguageContext";

export function AdmissionsSection({ admissions }: { admissions: Admissions }) {
  const { t } = useLanguage();
  const hasTuition = admissions.tuitionByLevel.length > 0;
  const hasOtherFees = admissions.otherFees.length > 0;
  const hasDeadlines = admissions.applicationDeadlines.length > 0;

  return (
    <section aria-labelledby="admissions-heading" className="scroll-mt-24">
      <h2 id="admissions-heading" className="text-xl font-semibold text-neutral-900">
        {t("profile.admissionsHeading")}
      </h2>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-neutral-700">{t("profile.tuitionHeading")}</h3>
          {hasTuition ? (
            <table className="mt-2 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="py-2 pr-2 font-medium">{t("profile.tableLevel")}</th>
                  <th className="py-2 font-medium">{t("profile.tableAnnualFee")}</th>
                </tr>
              </thead>
              <tbody>
                {admissions.tuitionByLevel.map((entry) => (
                  <tr key={entry.level} className="border-b border-neutral-100">
                    <td className="py-2 pr-2 text-neutral-800">{entry.level}</td>
                    <td className="py-2 text-neutral-800">{formatHKD(entry.annualFeeHKD)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-2 text-sm">
              <NotPublished />
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-700">{t("profile.otherFeesHeading")}</h3>
          {hasOtherFees ? (
            <table className="mt-2 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="py-2 pr-2 font-medium">{t("profile.tableFee")}</th>
                  <th className="py-2 font-medium">{t("profile.tableAmount")}</th>
                </tr>
              </thead>
              <tbody>
                {admissions.otherFees.map((fee) => (
                  <tr key={fee.label} className="border-b border-neutral-100 align-top">
                    <td className="py-2 pr-2 text-neutral-800">
                      {fee.label}
                      {fee.note && (
                        <span className="block text-xs text-neutral-500">{fee.note}</span>
                      )}
                    </td>
                    <td className="py-2 text-neutral-800">{formatHKD(fee.amountHKD)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-2 text-sm">
              <NotPublished />
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-neutral-700">{t("profile.applicationFeeHeading")}</h3>
          <p className="mt-1 text-sm text-neutral-800">{formatHKD(admissions.applicationFee)}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-700">{t("profile.debentureHeading")}</h3>
          <p className="mt-1 text-sm text-neutral-800">
            {formatHKD(admissions.debentureOrCapitalLevy)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-neutral-700">{t("profile.entranceExamsHeading")}</h3>
        {admissions.entranceExams.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {admissions.entranceExams.map((exam) => (
              <span
                key={exam}
                className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700"
              >
                {exam}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm">
            <NotPublished />
          </p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-neutral-700">{t("profile.deadlinesHeading")}</h3>
        {hasDeadlines ? (
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="py-2 pr-2 font-medium">{t("profile.tableIntake")}</th>
                <th className="py-2 pr-2 font-medium">{t("profile.tableLevel")}</th>
                <th className="py-2 font-medium">{t("profile.tableDeadline")}</th>
              </tr>
            </thead>
            <tbody>
              {admissions.applicationDeadlines.map((d, i) => (
                <tr key={i} className="border-b border-neutral-100">
                  <td className="py-2 pr-2 text-neutral-800">{d.intakeYear}</td>
                  <td className="py-2 pr-2 text-neutral-800">{d.level}</td>
                  <td className="py-2 text-neutral-800">
                    {d.deadline ?? <NotPublished />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-2 text-sm">
            <NotPublished />
          </p>
        )}
      </div>

      {admissions.processSteps.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-neutral-700">{t("profile.processStepsHeading")}</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-neutral-800">
            {admissions.processSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
