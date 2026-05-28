"use client";

import type { MedicalResultsCopy } from "@/constants/i18n/medical-results";
import type { MedicalReportPayload } from "@/lib/assessment/medical-report-types";
import {
  buildDomainRows,
  buildKatzRows,
  formatKatzResponse,
} from "@/lib/assessment/medical-report-utils";
import { useCopy } from "@/lib/i18n/use-copy";

type DomainBreakdownProps = {
  copy: MedicalResultsCopy["domains"];
  report: MedicalReportPayload;
};

function statusClass(status: string) {
  if (status === "withinExpected") {
    return "bg-emerald-50 text-emerald-800";
  }

  if (status === "monitor") {
    return "bg-amber-50 text-amber-800";
  }

  return "bg-purple-50 text-purple-800";
}

export function DomainBreakdown({ copy, report }: DomainBreakdownProps) {
  const medicalCopy = useCopy("medical");
  const medicalResultsCopy = useCopy("medicalResults");
  const domains = buildDomainRows(report);
  const katzRows = buildKatzRows(report);

  return (
    <section className="no-print grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div
        className="rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm sm:p-6"
        aria-labelledby="domain-heading"
      >
        <h2 id="domain-heading" className="text-2xl font-bold text-slate-950">
          {copy.title}
        </h2>
        <p className="mt-2 text-base leading-7 text-slate-700">
          {copy.description}
        </p>

        <div className="mt-6 grid gap-3">
          {domains.map((domain) => (
            <div
              key={domain.id}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-slate-950">
                    {medicalCopy.moca.domains?.[domain.id] ?? domain.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {copy.earned}: {domain.score}/{domain.maxScore}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusClass(domain.status)}`}
                >
                  {medicalResultsCopy.status?.[domain.status] ?? domain.status}
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white">
                <div
                  className="h-2 rounded-full bg-purple-700"
                  style={{ width: `${domain.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm sm:p-6"
        aria-labelledby="katz-heading"
      >
        <h2 id="katz-heading" className="text-2xl font-bold text-slate-950">
          {copy.katzTitle}
        </h2>
        <p className="mt-2 text-base leading-7 text-slate-700">
          {copy.katzDescription}
        </p>
        <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
            {copy.totalKatz}
          </p>
          <p className="mt-1 text-3xl font-bold text-emerald-950">
            {report.katz.total}/6
          </p>
        </div>
        <ul className="mt-5 grid gap-3">
          {katzRows.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3"
            >
              <span className="text-sm font-semibold text-slate-800">
                {medicalCopy.katz.items?.[row.id] ?? row.label}
              </span>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  row.response === "independent"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {formatKatzResponse(
                  row.response,
                  medicalResultsCopy.katzResponse,
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
