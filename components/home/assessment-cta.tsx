"use client";

import type { HomeCopy } from "@/constants/i18n/home";

type AssessmentCtaProps = {
  copy: HomeCopy;
  onOpen: () => void;
};

export function AssessmentCta({ copy, onOpen }: AssessmentCtaProps) {
  return (
    <section
      id="assessment"
      className="bg-slate-50 py-16 sm:py-20"
      aria-labelledby="assessment-heading"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-purple-700">
            {copy.assessment.eyebrow}
          </p>
          <h2
            id="assessment-heading"
            className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl"
          >
            {copy.assessment.title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            {copy.assessment.description}
          </p>
          <button
            type="button"
            onClick={onOpen}
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-purple-700 px-6 text-base font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
          >
            {copy.cta.chooseTrack}
          </button>
        </div>

        <div className="rounded-[1.75rem] border border-purple-100 bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-950">
            {copy.assessment.trustTitle}
          </h3>
          <ul className="mt-6 grid gap-4">
            {copy.assessment.trustItems.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-base leading-7 text-slate-700"
              >
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
