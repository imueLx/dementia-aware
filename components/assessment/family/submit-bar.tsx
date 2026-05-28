"use client";

import type { CaregiverCopy } from "@/constants/i18n/caregiver";
import { useCopy } from "@/lib/i18n/use-copy";

type SubmitBarProps = {
  copy: CaregiverCopy["submit"];
  hasViewedResults: boolean;
  isSubmitting: boolean;
};

export function SubmitBar({
  copy,
  hasViewedResults,
  isSubmitting,
}: SubmitBarProps) {
  const common = useCopy("common");
  return (
    <section className="rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">{copy.title}</h2>
          <p className="mt-2 max-w-3xl text-base leading-7 text-slate-700">
            {copy.description}
          </p>
          {hasViewedResults ? (
            <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-900">
              {copy.viewed}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-14 items-center justify-center rounded-full bg-purple-700 px-7 text-base font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? common.calculating : copy.button}
        </button>
      </div>
    </section>
  );
}
