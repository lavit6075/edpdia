import type { Achievements } from "../../types/school";
import { NotPublished } from "./NotPublished";
import { useLanguage } from "../../i18n/LanguageContext";

export function AchievementsSection({ achievements }: { achievements: Achievements }) {
  const { t } = useLanguage();
  const hasAny =
    achievements.examResults.length > 0 ||
    achievements.universityDestinations.length > 0 ||
    achievements.awards.length > 0;

  return (
    <section aria-labelledby="achievements-heading" className="scroll-mt-24">
      <h2 id="achievements-heading" className="text-xl font-semibold text-neutral-900">
        {t("profile.achievementsHeading")}
      </h2>

      {!hasAny && (
        <p className="mt-3 text-sm">
          <NotPublished label={t("profile.noAchievements")} />
        </p>
      )}

      {achievements.examResults.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-neutral-700">{t("profile.examResultsHeading")}</h3>
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="py-2 pr-2 font-medium">{t("profile.tableQualification")}</th>
                <th className="py-2 pr-2 font-medium">{t("profile.tableYear")}</th>
                <th className="py-2 pr-2 font-medium">{t("profile.tableMetric")}</th>
                <th className="py-2 font-medium">{t("profile.source")}</th>
              </tr>
            </thead>
            <tbody>
              {achievements.examResults.map((r, i) => (
                <tr key={i} className="border-b border-neutral-100">
                  <td className="py-2 pr-2 text-neutral-800">{r.qualification}</td>
                  <td className="py-2 pr-2 text-neutral-800">{r.year}</td>
                  <td className="py-2 pr-2 text-neutral-800">
                    {`${r.metric}: ${r.value}`}
                  </td>
                  <td className="py-2">
                    <a
                      href={r.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-700 hover:underline"
                    >
                      {t("profile.source")}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {achievements.universityDestinations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-neutral-700">
            {t("profile.universityDestinationsHeading")}
          </h3>
          <ul className="mt-2 space-y-3">
            {achievements.universityDestinations.map((d, i) => (
              <li key={i} className="text-sm text-neutral-800">
                <span className="font-medium">{`${d.year}:`}</span>
                {` ${d.institutions.join(", ")} `}
                <a
                  href={d.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 hover:underline"
                >
                  {t("profile.sourceParen")}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {achievements.awards.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-neutral-700">{t("profile.awardsHeading")}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-800">
            {achievements.awards.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
