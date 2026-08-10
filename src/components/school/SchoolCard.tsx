import { Link } from "react-router-dom";
import type { School } from "../../types/school";
import { Tag } from "./Tag";

export function SchoolCard({ school }: { school: School }) {
  return (
    <Link
      to={`/schools/${school.slug}`}
      className="group flex flex-col rounded-lg border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md focus-visible:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 group-hover:text-brand-700">
            {school.nameEn}
          </h3>
          {school.nameZh && (
            <p className="mt-0.5 text-sm text-neutral-500">{school.nameZh}</p>
          )}
        </div>
        <Tag variant="neutral">{school.region}</Tag>
      </div>

      <p className="mt-2 text-sm text-neutral-500">{school.district}</p>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-600">
        {school.introEn}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {school.curriculum.map((c) => (
          <Tag key={c} variant="brand">
            {c}
          </Tag>
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-neutral-100 pt-3 text-xs text-neutral-500">
        <div>
          <dt className="font-medium text-neutral-400">Ages</dt>
          <dd>
            {school.ageRange.min}–{school.ageRange.max}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-neutral-400">Type</dt>
          <dd className="capitalize">
            {school.schoolType}
            {school.boarding ? " · boarding" : ""}
          </dd>
        </div>
      </dl>
    </Link>
  );
}
