"use client";

import type { DashboardCopy } from "@/constants/i18n/dashboard";
import type { DashboardPatientRecord } from "@/lib/dashboard/dashboard-types";

type PatientRowActionsProps = {
  copy: DashboardCopy["actions"];
  record: DashboardPatientRecord;
  onViewDetails: (record: DashboardPatientRecord) => void;
  onDownloadPdf: (record: DashboardPatientRecord) => void;
};

export function PatientRowActions({
  copy,
  record,
  onViewDetails,
  onDownloadPdf,
}: PatientRowActionsProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
      <button
        type="button"
        onClick={() => onViewDetails(record)}
        className="inline-flex min-h-10 items-center justify-center rounded-full border border-purple-200 bg-white px-4 text-xs font-bold text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
      >
        {copy.viewDetails}
      </button>
      <button
        type="button"
        onClick={() => onDownloadPdf(record)}
        className="inline-flex min-h-10 items-center justify-center rounded-full bg-purple-700 px-4 text-xs font-bold text-white transition hover:bg-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
      >
        {copy.downloadPdf}
      </button>
    </div>
  );
}
