"use client";

import type { DashboardCopy } from "@/constants/i18n/dashboard";
import type { DashboardPatientRecord } from "@/lib/dashboard/dashboard-types";
import { formatDashboardDate } from "@/lib/dashboard/dashboard-utils";
import { useLanguage } from "@/lib/i18n/use-language";
import { DiagnosticBadge } from "./diagnostic-badge";
import { PatientRowActions } from "./patient-row-actions";

type PatientTableProps = {
  copy: DashboardCopy;
  records: DashboardPatientRecord[];
  onViewDetails: (record: DashboardPatientRecord) => void;
  onDownloadPdf: (record: DashboardPatientRecord) => void;
  onDelete: (record: DashboardPatientRecord) => void;
  deletingRecordId: string | null;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export function PatientTable({
  copy,
  records,
  onViewDetails,
  onDownloadPdf,
  onDelete,
  deletingRecordId,
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPreviousPage,
  onNextPage,
}: PatientTableProps) {
  const { language } = useLanguage();
  const formatSex = (value: DashboardPatientRecord["sexAssignedAtBirth"]) =>
    value === "male" ? copy.sexLabels.male : copy.sexLabels.female;
  const startIndex = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalRecords);

  return (
    <section
      className="rounded-[1.75rem] border border-purple-100 bg-white p-4 shadow-sm sm:p-6"
      aria-labelledby="patient-table-heading"
    >
      <h2
        id="patient-table-heading"
        className="text-xl font-bold text-slate-950 sm:text-2xl"
      >
        {copy.table.title}
      </h2>

      <div className="mt-5 hidden overflow-x-auto lg:block">
        <table className="w-full min-w-245 border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="py-3 pr-4">{copy.table.patientId}</th>
              <th className="py-3 pr-4">{copy.table.name}</th>
              <th className="py-3 pr-4">{copy.table.age}</th>
              <th className="py-3 pr-4">{copy.table.sex}</th>
              <th className="py-3 pr-4">{copy.table.assessmentDate}</th>
              <th className="py-3 pr-4">{copy.table.adjustedMoca}</th>
              <th className="py-3 pr-4">{copy.table.katz}</th>
              <th className="py-3 pr-4">{copy.table.diagnosticCategory}</th>
              <th className="py-3">{copy.table.actions}</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr
                key={record.assessmentId}
                className="border-b border-slate-100 align-top last:border-b-0"
              >
                <td className="py-4 pr-4 text-sm font-bold text-slate-950">
                  {record.patientId}
                </td>
                <td className="py-4 pr-4 text-sm text-slate-700">
                  {record.fullName || copy.table.notProvided}
                </td>
                <td className="py-4 pr-4 text-sm text-slate-700">
                  {record.age}
                </td>
                <td className="py-4 pr-4 text-sm text-slate-700">
                  {formatSex(record.sexAssignedAtBirth)}
                </td>
                <td className="py-4 pr-4 text-sm text-slate-700">
                  {formatDashboardDate(
                    record.assessmentDate,
                    language === "fil" ? "fil-PH" : "en",
                  )}
                </td>
                <td className="py-4 pr-4 text-sm font-bold text-purple-800">
                  {record.adjustedMocaScore}/30
                </td>
                <td className="py-4 pr-4 text-sm font-bold text-emerald-800">
                  {record.katzScore}/6
                </td>
                <td className="py-4 pr-4">
                  <DiagnosticBadge
                    category={record.diagnosticCategory}
                    label={copy.filters.categories[record.diagnosticCategory]}
                  />
                </td>
                <td className="py-4">
                  <PatientRowActions
                    copy={copy.actions}
                    record={record}
                    onViewDetails={onViewDetails}
                    onDownloadPdf={onDownloadPdf}
                    onDelete={onDelete}
                    isDeleteDisabled={deletingRecordId === record.assessmentId}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 lg:hidden">
        {records.map((record) => (
          <article
            key={record.assessmentId}
            className="rounded-3xl border border-slate-100 bg-slate-50 p-3.5 sm:p-4"
          >
            <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-950">
                  {record.patientId}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {record.fullName || copy.table.notProvided}
                </p>
              </div>
              <DiagnosticBadge
                category={record.diagnosticCategory}
                label={copy.filters.categories[record.diagnosticCategory]}
              />
            </div>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm min-[420px]:grid-cols-2">
              <div>
                <dt className="font-bold text-slate-500">{copy.table.age}</dt>
                <dd className="text-slate-950">{record.age}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">{copy.table.sex}</dt>
                <dd className="text-slate-950">
                  {formatSex(record.sexAssignedAtBirth)}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">
                  {copy.table.adjustedMoca}
                </dt>
                <dd className="font-bold text-purple-800">
                  {record.adjustedMocaScore}/30
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">{copy.table.katz}</dt>
                <dd className="font-bold text-emerald-800">
                  {record.katzScore}/6
                </dd>
              </div>
            </dl>
            <div className="mt-4">
              <PatientRowActions
                copy={copy.actions}
                record={record}
                onViewDetails={onViewDetails}
                onDownloadPdf={onDownloadPdf}
                onDelete={onDelete}
                isDeleteDisabled={deletingRecordId === record.assessmentId}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600 sm:whitespace-nowrap">
          {copy.table.showing} {startIndex}-{endIndex} {copy.table.of}{" "}
          {totalRecords}
        </p>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap sm:justify-end">
          <button
            type="button"
            onClick={onPreviousPage}
            disabled={currentPage <= 1}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
          >
            {copy.table.previous}
          </button>

          <p className="order-3 w-full px-1 text-center text-xs font-bold text-slate-700 min-[420px]:order-0 min-[420px]:w-auto sm:px-2 sm:text-sm">
            {copy.table.page} {currentPage} {copy.table.of} {totalPages}
          </p>

          <button
            type="button"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
          >
            {copy.table.next}
          </button>
        </div>
      </div>
    </section>
  );
}
