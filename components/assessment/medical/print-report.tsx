"use client";

import Image from "next/image";
import type { MedicalResultsCopy } from "@/constants/i18n/medical-results";
import type { MedicalReportPayload } from "@/lib/assessment/medical-report-types";
import {
  buildClinicalRationale,
  buildDomainRows,
  buildKatzRows,
  buildPrintSections,
  buildRecommendationText,
  formatKatzResponse,
} from "@/lib/assessment/medical-report-utils";
import { useCopy } from "@/lib/i18n/use-copy";
import { useLanguage } from "@/lib/i18n/use-language";

type PrintReportProps = {
  copy: MedicalResultsCopy["print"];
  report: MedicalReportPayload;
};

export function PrintReport({ copy, report }: PrintReportProps) {
  const { language } = useLanguage();
  const medicalCopy = useCopy("medical");
  const medicalResultsCopy = useCopy("medicalResults");
  const sections = buildPrintSections(report, {
    labels: {
      demographics: medicalResultsCopy.printSections.demographics,
      coreScores: medicalResultsCopy.printSections.coreScores,
      patientId: medicalResultsCopy.overview.patientId,
      fullName: medicalResultsCopy.overview.fullName,
      age: medicalResultsCopy.overview.age,
      sexAtBirth: medicalResultsCopy.overview.sexAtBirth,
      education: medicalResultsCopy.overview.education,
      clinician: medicalResultsCopy.overview.clinician,
      assessmentDate: medicalResultsCopy.overview.assessmentDate,
      finalAdjustedMoca: medicalResultsCopy.printSections.finalAdjustedMoca,
      rawMoca: medicalResultsCopy.printSections.rawMoca,
      educationAdjustment: medicalResultsCopy.printSections.educationAdjustment,
      katzScore: medicalResultsCopy.printSections.katzScore,
      clinicalInterpretation:
        medicalResultsCopy.printSections.clinicalInterpretation,
    },
    sexLabels: {
      male: medicalCopy.demographics.male,
      female: medicalCopy.demographics.female,
    },
    educationLabels: medicalCopy.demographics.educationOptions,
    notProvidedLabel: medicalResultsCopy.overview.notProvided,
    locale: language === "fil" ? "fil-PH" : "en",
  });
  const domains = buildDomainRows(report);
  const katzRows = buildKatzRows(report);
  const rationale = buildClinicalRationale(report, {
    domainLabels: medicalCopy.moca.domains,
    rationale: medicalResultsCopy.rationale,
  });
  const recommendation = buildRecommendationText(report);

  return (
    <article className="print-only medical-report-print bg-white text-slate-950">
      <header className="border-b-4 border-purple-700 pb-5">
        <div className="flex items-center gap-6">
          <div className="relative h-14 w-52 shrink-0">
            <Image
              src="/dementia-aware-logo.png"
              alt="DementiAware"
              fill
              sizes="208px"
              className="object-contain object-left"
              priority
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold leading-tight">{copy.title}</h1>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              {copy.subtitle}
            </p>
          </div>
        </div>
        <p className="mt-4 rounded-xl bg-purple-50 p-3 text-sm font-semibold text-purple-900">
          {copy.preparedFor}
        </p>
      </header>

      <div className="mt-6 grid gap-5">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold text-slate-950">
              {section.title}
            </h2>
            <dl className="mt-3 grid grid-cols-2 gap-2">
              {section.rows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-xl border border-slate-200 p-3"
                >
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-slate-950">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        <section>
          <h2 className="text-lg font-bold text-slate-950">
            {copy.mocaDomainBreakdown}
          </h2>
          <table className="mt-3 w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="py-2 pr-3">{copy.domainHeader}</th>
                <th className="py-2 pr-3">{copy.scoreHeader}</th>
                <th className="py-2 pr-3">{copy.statusHeader}</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((domain) => (
                <tr key={domain.id} className="border-b border-slate-200">
                  <td className="py-2 pr-3 font-semibold">
                    {medicalCopy.moca.domains?.[domain.id] ?? domain.title}
                  </td>
                  <td className="py-2 pr-3">
                    {domain.score}/{domain.maxScore}
                  </td>
                  <td className="py-2 pr-3">
                    {medicalResultsCopy.status?.[domain.status] ??
                      domain.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-950">
            {copy.katzBreakdown}
          </h2>
          <table className="mt-3 w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="py-2 pr-3">{copy.itemHeader}</th>
                <th className="py-2 pr-3">{copy.resultHeader}</th>
                <th className="py-2 pr-3">{copy.scoreValueHeader}</th>
              </tr>
            </thead>
            <tbody>
              {katzRows.map((row) => (
                <tr key={row.id} className="border-b border-slate-200">
                  <td className="py-2 pr-3 font-semibold">
                    {medicalCopy.katz.items?.[row.id] ?? row.label}
                  </td>
                  <td className="py-2 pr-3">
                    {formatKatzResponse(
                      row.response,
                      medicalResultsCopy.katzResponse,
                    )}
                  </td>
                  <td className="py-2 pr-3">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-xl border border-purple-200 p-4">
          <h2 className="text-lg font-bold text-slate-950">
            {copy.interpretation}
          </h2>
          <p className="mt-2 text-xl font-bold text-purple-800">
            {report.interpretation.matrixInterpretation}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Exact Classification: {report.interpretation.label}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Overall Clinical Interpretation:{" "}
            {report.interpretation.matrixInterpretation}
          </p>
          <p className="mt-3 text-sm leading-6">{rationale}</p>
          <p className="mt-3 text-sm leading-6">{recommendation}</p>
        </section>
      </div>

      <footer className="mt-8 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-600">
        {copy.generatedNote}
      </footer>
    </article>
  );
}
