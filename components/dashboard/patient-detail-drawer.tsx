"use client";

import { useEffect, useRef } from "react";
import type { DashboardCopy } from "@/constants/i18n/dashboard";
import type { DashboardPatientRecord } from "@/lib/dashboard/dashboard-types";
import { formatDashboardDate } from "@/lib/dashboard/dashboard-utils";
import { formatEducationYears } from "@/lib/assessment/medical-report-utils";
import { DiagnosticBadge } from "./diagnostic-badge";
import { KatzSummary } from "./katz-summary";
import { MocaDomainList } from "./moca-domain-list";
import { useCopy } from "@/lib/i18n/use-copy";
import { useLanguage } from "@/lib/i18n/use-language";

type PatientDetailDrawerProps = {
  copy: DashboardCopy["drawer"];
  record: DashboardPatientRecord | null;
  onClose: () => void;
};

export function PatientDetailDrawer({
  copy,
  record,
  onClose,
}: PatientDetailDrawerProps) {
  const dashboardCopy = useCopy("dashboard");
  const medicalCopy = useCopy("medical");
  const { language } = useLanguage();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!record) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [record, onClose]);

  if (!record) {
    return null;
  }

  const formatSex = (value: DashboardPatientRecord["sexAssignedAtBirth"]) =>
    value === "male"
      ? dashboardCopy.sexLabels.male
      : dashboardCopy.sexLabels.female;

  const demographicRows = [
    { label: dashboardCopy.table.patientId, value: record.patientId },
    {
      label: dashboardCopy.table.name,
      value: record.fullName || dashboardCopy.table.notProvided,
    },
    { label: dashboardCopy.table.age, value: String(record.age) },
    {
      label: dashboardCopy.table.sex,
      value: formatSex(record.sexAssignedAtBirth),
    },
    {
      label: medicalCopy.demographics.educationYears,
      value: formatEducationYears(
        record.yearsOfFormalEducation,
        medicalCopy.demographics.educationOptions,
      ),
    },
    { label: copy.clinician, value: record.clinicianNameOrId },
    {
      label: copy.assessmentDate,
      value: formatDashboardDate(
        record.assessmentDate,
        language === "fil" ? "fil-PH" : "en",
      ),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] bg-slate-950/45 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-detail-title"
        className="ml-auto flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 border-b border-purple-100 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-purple-700">
                {record.patientId}
              </p>
              <h2
                id="patient-detail-title"
                className="mt-1 text-2xl font-bold text-slate-950"
              >
                {copy.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`/api/medical/report/${record.assessmentId}`}
                className="inline-flex items-center justify-center rounded-full border border-purple-200 bg-white px-3 py-2 text-sm font-bold text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
              >
                {dashboardCopy.actions?.downloadPdf ?? "Download PDF"}
              </a>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label={copy.close}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-purple-200 text-xl font-bold text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
              >
                x
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5">
          <section>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-slate-950">
                {copy.demographics}
              </h3>
              <DiagnosticBadge
                category={record.diagnosticCategory}
                label={dashboardCopy.categories?.[record.diagnosticCategory]}
              />
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {demographicRows.map((row) => (
                <div key={row.label} className="rounded-2xl bg-slate-50 p-3">
                  <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-slate-950">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-950">{copy.scores}</h3>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-purple-50 p-4">
                <dt className="text-xs font-bold uppercase tracking-wide text-purple-700">
                  {copy.adjustedMoca}
                </dt>
                <dd className="mt-1 text-2xl font-bold text-purple-950">
                  {record.adjustedMocaScore}/30
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {copy.rawMoca}
                </dt>
                <dd className="mt-1 text-2xl font-bold text-slate-950">
                  {record.rawMocaScore}/30
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {copy.educationAdjustment}
                </dt>
                <dd className="mt-1 text-2xl font-bold text-slate-950">
                  +{record.educationAdjustment}
                </dd>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4">
                <dt className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                  {copy.katzScore}
                </dt>
                <dd className="mt-1 text-2xl font-bold text-emerald-950">
                  {record.katzScore}/6
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-950">
              {copy.mocaBreakdown}
            </h3>
            <div className="mt-4">
              <MocaDomainList domains={record.mocaDomainBreakdown} />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-950">
              {copy.katzBreakdown}
            </h3>
            <div className="mt-4">
              <KatzSummary items={record.katzItemBreakdown} />
            </div>
          </section>

          <section className="rounded-3xl bg-purple-50 p-5">
            <h3 className="text-lg font-bold text-slate-950">
              {copy.recommendation}
            </h3>
            <p className="mt-3 text-base leading-7 text-slate-800">
              {record.recommendation}
            </p>
            <p className="mt-3 text-base leading-7 text-slate-800">
              {record.referralAction}
            </p>
          </section>
        </div>
      </aside>
    </div>
  );
}
