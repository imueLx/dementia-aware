"use client";

import type { MedicalResultsCopy } from "@/constants/i18n/medical-results";
import type {
  MedicalReportPayload,
  MedicalReportSource,
} from "@/lib/assessment/medical-report-types";
import { formatAssessmentDateWithLocale } from "@/lib/assessment/medical-report-utils";
import { ExportActions } from "./export-actions";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { useLanguage } from "@/lib/i18n/use-language";

type ResultsHeaderProps = {
  copy: MedicalResultsCopy;
  report: MedicalReportPayload;
  source: MedicalReportSource;
  recordId?: string;
};

export function ResultsHeader({
  copy,
  report,
  source,
  recordId,
}: ResultsHeaderProps) {
  const { language } = useLanguage();

  return (
    <header className="no-print rounded-[2rem] border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-purple-700">
            {copy.page.trackLabel}
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            {copy.page.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
            {copy.page.subtitle}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <LanguageToggle />
          <ExportActions copy={copy.actions} recordId={recordId} />
        </div>
      </div>

      <dl className="mt-7 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-purple-50 p-4">
          <dt className="text-xs font-bold uppercase tracking-wide text-purple-700">
            {copy.header.assessmentDate}
          </dt>
          <dd className="mt-1 text-sm font-bold text-slate-950">
            {formatAssessmentDateWithLocale(
              report.assessmentDate,
              language === "fil" ? "fil-PH" : "en",
            )}
          </dd>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {copy.header.patientId}
          </dt>
          <dd className="mt-1 text-sm font-bold text-slate-950">
            {report.demographics.patientId}
          </dd>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {copy.header.clinicianId}
          </dt>
          <dd className="mt-1 text-sm font-bold text-slate-950">
            {report.clinicianIdentifier}
          </dd>
        </div>
      </dl>

      <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50 p-4 text-sm font-semibold leading-6 text-purple-900">
        {copy.page.dashboardNote}
      </div>
      {source === "mock-fallback" ? (
        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
          {copy.page.mockNotice}
        </div>
      ) : null}
    </header>
  );
}
