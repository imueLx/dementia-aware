"use client";

import Link from "next/link";
import { useCopy } from "@/lib/i18n/use-copy";
import type {
  MedicalReportPayload,
  MedicalReportSource,
} from "@/lib/assessment/medical-report-types";
import { DomainBreakdown } from "@/components/assessment/medical/domain-breakdown";
import { InterpretationPanel } from "@/components/assessment/medical/interpretation-panel";
import { PrintReport } from "@/components/assessment/medical/print-report";
import { ResultsHeader } from "@/components/assessment/medical/results-header";
import { ResultsOverview } from "@/components/assessment/medical/results-overview";

type ResultsViewProps = {
  report: MedicalReportPayload | null;
  source: MedicalReportSource;
};

export function MedicalResultsView({ report, source }: ResultsViewProps) {
  const copy = useCopy("medicalResults");

  if (!report) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl rounded-[2rem] border border-purple-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-purple-700">
            {copy.notFound.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            {copy.notFound.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-700">
            {copy.notFound.description}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/assessment/medical"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-purple-700 px-5 text-sm font-bold text-white hover:bg-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
            >
              {copy.notFound.backAssessment}
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-purple-200 bg-white px-5 text-sm font-bold text-purple-800 hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
            >
              {copy.notFound.openDashboard}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ResultsHeader copy={copy} report={report} source={source} />

        <div className="mt-8 grid gap-8">
          <ResultsOverview copy={copy.overview} report={report} />
          <DomainBreakdown copy={copy.domains} report={report} />
          <InterpretationPanel copy={copy.interpretation} report={report} />
        </div>
      </div>

      <PrintReport copy={copy.print} report={report} />
    </main>
  );
}
