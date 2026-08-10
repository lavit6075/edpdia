import type { Admissions } from "../../types/school";
import { NotPublished, formatHKD } from "./NotPublished";

export function AdmissionsSection({ admissions }: { admissions: Admissions }) {
  const hasTuition = admissions.tuitionByLevel.length > 0;
  const hasOtherFees = admissions.otherFees.length > 0;
  const hasDeadlines = admissions.applicationDeadlines.length > 0;

  return (
    <section aria-labelledby="admissions-heading" className="scroll-mt-24">
      <h2 id="admissions-heading" className="text-xl font-semibold text-neutral-900">
        Admissions &amp; Application
      </h2>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-neutral-700">Annual tuition</h3>
          {hasTuition ? (
            <table className="mt-2 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="py-2 pr-2 font-medium">Level</th>
                  <th className="py-2 font-medium">Annual fee</th>
                </tr>
              </thead>
              <tbody>
                {admissions.tuitionByLevel.map((t) => (
                  <tr key={t.level} className="border-b border-neutral-100">
                    <td className="py-2 pr-2 text-neutral-800">{t.level}</td>
                    <td className="py-2 text-neutral-800">{formatHKD(t.annualFeeHKD)}</td>
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
          <h3 className="text-sm font-semibold text-neutral-700">Other fees</h3>
          {hasOtherFees ? (
            <table className="mt-2 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="py-2 pr-2 font-medium">Fee</th>
                  <th className="py-2 font-medium">Amount</th>
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
          <h3 className="text-sm font-semibold text-neutral-700">Application fee</h3>
          <p className="mt-1 text-sm text-neutral-800">{formatHKD(admissions.applicationFee)}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-700">Debenture / capital levy</h3>
          <p className="mt-1 text-sm text-neutral-800">
            {formatHKD(admissions.debentureOrCapitalLevy)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-neutral-700">Entrance exams</h3>
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
        <h3 className="text-sm font-semibold text-neutral-700">Application deadlines</h3>
        {hasDeadlines ? (
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="py-2 pr-2 font-medium">Intake</th>
                <th className="py-2 pr-2 font-medium">Level</th>
                <th className="py-2 font-medium">Deadline</th>
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
          <h3 className="text-sm font-semibold text-neutral-700">Process steps</h3>
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
