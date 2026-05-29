"use client";

import type { MedicalCopy } from "@/constants/i18n/medical";
import type { MedicalAssessmentTotals } from "@/lib/assessment/medical-types";
import { useLanguage } from "@/lib/i18n/use-language";
import { useCopy } from "@/lib/i18n/use-copy";

type ScoreSummaryProps = {
  copy: MedicalCopy["summary"];
  totals: MedicalAssessmentTotals;
  assessmentDate: string;
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
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

export function ScoreSummary({
  copy,
  totals,
  assessmentDate,
  isDemographicsComplete,
}: ScoreSummaryProps) {
  const { language } = useLanguage();
  const medicalCopy = useCopy("medical");
  const formattedDate = new Intl.DateTimeFormat(
    language === "fil" ? "fil-PH" : "en",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(assessmentDate));

  const interpretationCopy = (
    copy.interpretation as unknown as Record<
      string,
      { recommendation?: string; referralAction?: string }
    >
  )?.[totals.interpretation.label];

  return (
    <aside className="lg:sticky lg:top-24" aria-labelledby="summary-heading">
      <div className="rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-xl shadow-purple-100/60">
        <h2 id="summary-heading" className="text-xl font-bold text-slate-950">
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
              label={copy.rawMoca}
              value={`${totals.rawMocaTotal}/30`}
              tone="purple"
            />
            <MetricCard
              label={copy.educationAdjustment}
              value={`+${totals.educationAdjustment}`}
            />
            <MetricCard
              label={copy.adjustedMoca}
              value={`${totals.adjustedMocaTotal}/30`}
              tone="purple"
            />
            <MetricCard
              label={copy.katzScore}
              value={`${totals.katzTotal}/6`}
              tone="green"
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-purple-700">
            {copy.domainBreakdown}
          </h3>
          <ul className="mt-3 grid gap-2">
            {totals.mocaDomainScores.map((domain) => (
              <li
                key={domain.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="font-semibold text-slate-700">
                  {medicalCopy.moca.domains?.[domain.id] ?? domain.title}
                </span>
                <span className="font-bold text-slate-950">
                  {domain.score}/{domain.maxScore}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-2xl bg-purple-700 p-4 text-white">
          <p className="text-xs font-bold uppercase tracking-wide text-purple-100">
            {copy.interpretation}
          </p>
          <p className="mt-1 text-2xl font-bold">
            {totals.interpretation.label}
          </p>
          <p className="mt-3 text-sm font-semibold text-purple-100">
            {copy.recommendation}
          </p>
          <p className="mt-1 text-sm leading-6 text-white/90">
            {interpretationCopy?.recommendation ??
              totals.interpretation.recommendation}
          </p>
          <p className="mt-3 text-sm font-semibold text-purple-100">
            {copy.referralAction}
          </p>
          <p className="mt-1 text-sm leading-6 text-white/90">
            {interpretationCopy?.referralAction ??
              totals.interpretation.referralAction}
          </p>
        </div>

        <div className="mt-5 grid gap-3 rounded-2xl border border-purple-100 bg-purple-50 p-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-purple-700">
              {copy.assessmentDate}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {formattedDate}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-purple-700">
              {copy.submissionReadiness}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {isDemographicsComplete ? copy.ready : copy.needsRequired}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
