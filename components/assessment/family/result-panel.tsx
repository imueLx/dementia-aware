"use client";

import type { CaregiverCopy } from "@/constants/i18n/caregiver";
import type { CaregiverResultPayload } from "@/lib/assessment/family-types";
import { useCopy } from "@/lib/i18n/use-copy";

type ResultPanelProps = {
  copy: CaregiverCopy["result"];
  result: CaregiverResultPayload | null;
};

export function ResultPanel({ copy, result }: ResultPanelProps) {
  const caregiverCopy = useCopy("caregiver") as CaregiverCopy;

  if (!result) {
    return null;
  }
  const interpretationLabel =
    caregiverCopy.interpretationLabels?.[result.interpretation.label];
  const referralGuidance =
    caregiverCopy.referral?.[result.interpretation.label];

  const hasDifficulties = result.difficultySummary.length > 0;

  return (
    <section
      className="rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="family-result-heading"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="family-result-heading"
            className="text-2xl font-bold text-slate-950"
          >
            {copy.title}
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-purple-800">
            {copy.screenshotNote}
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-purple-200 bg-white px-5 text-sm font-bold text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
        >
          {copy.print}
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-purple-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-purple-700">
            {copy.miniCogTotal}
          </p>
          <p className="mt-1 text-3xl font-bold text-purple-950">
            {result.miniCog.total}/5
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
            {copy.lawtonSummary}
          </p>
          <p className="mt-1 text-3xl font-bold text-emerald-950">
            {result.lawton.total}/{result.lawton.maxScore}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-slate-50 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-purple-700">
          {copy.interpretation}
        </p>
        <h3 className="mt-2 text-2xl font-bold text-slate-950">
          {interpretationLabel ?? result.interpretation.label}
        </h3>

        <p className="mt-5 text-sm font-bold uppercase tracking-wide text-purple-700">
          {copy.referralGuidance}
        </p>
        <p className="mt-2 text-base leading-7 text-slate-700">
          {referralGuidance ?? result.interpretation.referralGuidance}
        </p>

        <p className="mt-5 text-sm font-bold uppercase tracking-wide text-purple-700">
          {copy.caregiverSummary}
        </p>
        <p className="mt-2 text-base leading-7 text-slate-700">
          {result.interpretation.plainLanguageSummary}
        </p>
      </div>

      <div className="mt-5 rounded-3xl border border-purple-100 bg-white p-5">
        <h3 className="text-lg font-bold text-slate-950">
          {copy.difficultySummary}
        </h3>
        {hasDifficulties ? (
          <ul className="mt-4 grid gap-3">
            {result.difficultySummary.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700"
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-purple-700" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
            {copy.noDifficulties}
          </p>
        )}
      </div>
    </section>
  );
}
