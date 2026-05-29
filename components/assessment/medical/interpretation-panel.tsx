"use client";

import type { MedicalResultsCopy } from "@/constants/i18n/medical-results";
import type { ClinicalInterpretationLabel } from "@/lib/assessment/medical-types";
import type { MedicalReportPayload } from "@/lib/assessment/medical-report-types";
import {
  buildClinicalRationale,
  buildMatrixInterpretationText,
  buildRecommendationText,
} from "@/lib/assessment/medical-report-utils";
import { useCopy } from "@/lib/i18n/use-copy";

type InterpretationPanelProps = {
  copy: MedicalResultsCopy["interpretation"];
  report: MedicalReportPayload;
};

const supportedLabels: ClinicalInterpretationLabel[] = [
  "Normal",
  "MCI",
  "Moderate Dementia",
  "Severe Dementia",
];

export function InterpretationPanel({
  copy,
  report,
}: InterpretationPanelProps) {
  const medicalCopy = useCopy("medical");
  const dashboardCopy = useCopy("dashboard");
  const medicalResultsCopy = useCopy("medicalResults");

  const rationale = buildClinicalRationale(report, {
    domainLabels: medicalCopy.moca.domains,
    rationale: medicalResultsCopy.rationale,
  });
  const matrixInterpretation = buildMatrixInterpretationText(report);
  const recommendation = buildRecommendationText(report);

  return (
    <section
      className="no-print rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="interpretation-heading"
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2
            id="interpretation-heading"
            className="text-2xl font-bold text-slate-950"
          >
            {copy.title}
          </h2>
          <div className="mt-5 rounded-3xl bg-purple-700 p-5 text-white">
            <p className="text-sm font-bold uppercase tracking-wide text-purple-100">
              {copy.currentClassification}
            </p>
            <p className="mt-2 text-2xl font-bold leading-snug">
              {matrixInterpretation}
            </p>
            <p className="mt-2 text-sm text-purple-100">
              {copy.currentClassification}: {report.interpretation.label}
            </p>
          </div>
          <div className="mt-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-purple-700">
              {copy.labelsTitle}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {supportedLabels.map((label) => (
                <span
                  key={label}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    label === report.interpretation.label
                      ? "bg-purple-700 text-white"
                      : "bg-purple-50 text-purple-800"
                  }`}
                >
                  {dashboardCopy.categories?.[label] ?? label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-purple-700">
              {copy.rationale}
            </h3>
            <p className="mt-2 text-base leading-7 text-slate-700">
              {rationale}
            </p>
          </div>
          <div className="rounded-2xl bg-purple-50 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-purple-700">
              {copy.recommendation}
            </h3>
            <p className="mt-2 text-base leading-7 text-slate-800">
              {recommendation}
            </p>
          </div>
          <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
            {copy.crossReference}
          </p>
        </div>
      </div>
    </section>
  );
}
