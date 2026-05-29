"use client";

import type { CaregiverCopy } from "@/constants/i18n/caregiver";
import type { CaregiverAssessmentTotals } from "@/lib/assessment/family-types";
import { useCopy } from "@/lib/i18n/use-copy";

type ScoreSummaryProps = {
  copy: CaregiverCopy["summary"];
  totals: CaregiverAssessmentTotals;
  isDemographicsComplete: boolean;
};

function MetricCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "purple" | "green" | "amber";
}) {
  const toneClass = {
    default: "bg-slate-50 text-slate-950",
    purple: "bg-purple-50 text-purple-900",
    green: "bg-emerald-50 text-emerald-900",
    amber: "bg-amber-50 text-amber-900",
  }[tone];

  return (
    <div className={`rounded-2xl p-4 ${toneClass}`}>
      <p className="text-xs font-bold uppercase tracking-wide opacity-75">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

export function ScoreSummary({
  copy,
  totals,
  isDemographicsComplete,
}: ScoreSummaryProps) {
  const caregiverCopy = useCopy("caregiver") as CaregiverCopy;
  const interpretationLabel =
    caregiverCopy.interpretationLabels?.[totals.interpretation.label] ??
    totals.interpretation.label;
  return (
    <aside
      className="lg:sticky lg:top-24"
      aria-labelledby="family-summary-heading"
    >
      <div className="rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-xl shadow-purple-100/60">
        <h2
          id="family-summary-heading"
          className="text-xl font-bold text-slate-950"
        >
          {copy.title}
        </h2>

        <div className="mt-5 grid gap-3">
          <MetricCard
            label={copy.demographicStatus}
            value={isDemographicsComplete ? copy.complete : copy.incomplete}
            tone={isDemographicsComplete ? "green" : "amber"}
          />
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label={copy.miniCogScore}
              value={`${totals.miniCogTotal}/5`}
              tone="purple"
            />
            <MetricCard
              label={copy.lawtonScore}
              value={`${totals.lawton.total}/${totals.lawton.maxScore}`}
              tone="green"
            />
          </div>
          <MetricCard
            label={copy.interpretationStatus}
            value={interpretationLabel}
            tone={
              totals.interpretation.label ===
              "Further medical evaluation recommended"
                ? "amber"
                : "green"
            }
          />
          <MetricCard
            label={copy.submissionReadiness}
            value={isDemographicsComplete ? copy.ready : copy.needsRequired}
          />
        </div>

        <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50 p-4 text-sm font-bold leading-6 text-purple-900">
          {copy.privacyReminder}
        </div>
      </div>
    </aside>
  );
}
