"use client";

import type { MedicalResultsCopy } from "@/constants/i18n/medical-results";
import type { MedicalReportPayload } from "@/lib/assessment/medical-report-types";
import {
  formatAssessmentDateWithLocale,
  formatEducationYears,
  formatSexAtBirth,
  getInterpretationTone,
} from "@/lib/assessment/medical-report-utils";
import { useCopy } from "@/lib/i18n/use-copy";
import { useLanguage } from "@/lib/i18n/use-language";

type ResultsOverviewProps = {
  copy: MedicalResultsCopy["overview"];
  report: MedicalReportPayload;
};

function MetricCard({
  label,
  value,
  helper,
  tone = "slate",
}: {
  label: string;
  value: string;
  helper?: string;
  tone?: "purple" | "green" | "amber" | "slate";
}) {
  const toneClass = {
    purple: "bg-purple-700 text-white",
    green: "bg-emerald-50 text-emerald-950",
    amber: "bg-amber-50 text-amber-950",
    slate: "bg-white text-slate-950",
  }[tone];

  return (
    <div
      className={`rounded-[1.5rem] border border-purple-100 p-5 shadow-sm ${toneClass}`}
    >
      <p className="text-xs font-bold uppercase tracking-wide opacity-75">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {helper ? (
        <p className="mt-2 text-sm leading-6 opacity-80">{helper}</p>
      ) : null}
    </div>
  );
}

export function ResultsOverview({ copy, report }: ResultsOverviewProps) {
  const { language } = useLanguage();
  const medicalCopy = useCopy("medical");
  const interpretationTone = getInterpretationTone(report.interpretation.label);

  const demographicRows = [
    { label: copy.patientId, value: report.demographics.patientId },
    {
      label: copy.fullName,
      value: report.demographics.fullName || copy.notProvided,
    },
    { label: copy.age, value: String(report.demographics.age) },
    {
      label: copy.sexAtBirth,
      value: formatSexAtBirth(report.demographics.sexAtBirth, {
        male: medicalCopy.demographics.male,
        female: medicalCopy.demographics.female,
      }),
    },
    {
      label: copy.education,
      value: formatEducationYears(
        report.demographics.educationYears,
        medicalCopy.demographics.educationOptions,
      ),
    },
    { label: copy.clinician, value: report.clinicianIdentifier },
    {
      label: copy.assessmentDate,
      value: formatAssessmentDateWithLocale(
        report.assessmentDate,
        language === "fil" ? "fil-PH" : "en",
      ),
    },
  ];

  return (
    <section className="no-print grid gap-6" aria-labelledby="overview-heading">
      <div>
        <h2 id="overview-heading" className="text-2xl font-bold text-slate-950">
          {copy.title}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label={copy.adjustedMoca}
          value={`${report.moca.adjustedTotal}/30`}
          helper={copy.finalMocaHelper}
          tone="purple"
        />
        <MetricCard label={copy.rawMoca} value={`${report.moca.rawTotal}/30`} />
        <MetricCard
          label={copy.educationAdjustment}
          value={`+${report.moca.educationAdjustment}`}
        />
        <MetricCard
          label={copy.katz}
          value={`${report.katz.total}/6`}
          tone="green"
        />
        <MetricCard
          label={copy.interpretation}
          value={report.interpretation.label}
          tone={interpretationTone}
        />
      </div>

      <div className="rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-xl font-bold text-slate-950">
          {copy.demographicTitle}
        </h3>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {demographicRows.map((row) => (
            <div key={row.label} className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {row.label}
              </dt>
              <dd className="mt-1 text-sm font-bold text-slate-950">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
