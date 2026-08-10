import { Link } from "react-router-dom";
import { schools } from "../lib/schools";
import { SchoolCard } from "../components/school/SchoolCard";

const stats = [
  { label: "Schools listed", value: schools.length.toString() },
  { label: "Curricula covered", value: "IB, British, American & more" },
  { label: "Coverage", value: "Hong Kong Island, Kowloon, New Territories" },
];

export function Home() {
  const featured = schools.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
              Hong Kong's international school directory
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
              An encyclopaedia, not a sales pitch.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-neutral-600">
              Edpdia compiles curricula, admissions details, and official sources for
              Hong Kong's international schools in one neutral, easy-to-scan place — so
              you can make an informed decision, not a marketed one.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/schools"
                className="rounded-md bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800"
              >
                Browse schools
              </Link>
              <Link
                to="/contact"
                className="rounded-md border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 hover:bg-white"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / value prop */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-neutral-200 p-5">
              <p className="text-2xl font-semibold text-neutral-900">{stat.value}</p>
              <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Directory teaser */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Featured schools
            </h2>
            <p className="mt-1 text-neutral-600">
              A sample of what's in the directory.
            </p>
          </div>
          <Link
            to="/schools"
            className="hidden shrink-0 text-sm font-semibold text-brand-700 hover:underline sm:block"
          >
            View all schools →
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>

        <Link
          to="/schools"
          className="mt-6 block text-center text-sm font-semibold text-brand-700 hover:underline sm:hidden"
        >
          View all schools →
        </Link>
      </section>

      {/* Neutrality commitment */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-base font-semibold text-neutral-900">No rankings</h3>
              <p className="mt-2 text-sm text-neutral-600">
                We don't score or rank schools. Every family's priorities are different —
                we present facts and let you decide.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-900">Sourced, not guessed</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Every fee, deadline, and result links to where it came from. Unpublished
                data is shown as "Not published," never invented.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-900">Always verify</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Details change. Treat Edpdia as a starting point, and confirm directly
                with the school before you apply.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
