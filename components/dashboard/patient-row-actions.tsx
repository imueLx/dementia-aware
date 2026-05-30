"use client";

import type { DashboardCopy } from "@/constants/i18n/dashboard";
import type { DashboardPatientRecord } from "@/lib/dashboard/dashboard-types";

type PatientRowActionsProps = {
  copy: DashboardCopy["actions"];
  record: DashboardPatientRecord;
  onViewDetails: (record: DashboardPatientRecord) => void;
  onDownloadPdf: (record: DashboardPatientRecord) => void;
  onDelete: (record: DashboardPatientRecord) => void;
  isDeleteDisabled?: boolean;
};

export function PatientRowActions({
  copy,
  record,
  onViewDetails,
  onDownloadPdf,
  onDelete,
  isDeleteDisabled = false,
}: PatientRowActionsProps) {
  void onDownloadPdf;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onViewDetails(record)}
        className="inline-flex min-h-9 items-center justify-center rounded-full border border-purple-200 bg-white px-3 text-xs font-bold text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 sm:min-h-10 sm:px-4"
      >
        {copy.viewDetails}
      </button>
      <button
        type="button"
        onClick={() => onDelete(record)}
        disabled={isDeleteDisabled}
        aria-label={copy.delete}
        title={copy.delete}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:h-10 sm:w-10"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
        <span className="sr-only">{copy.delete}</span>
      </button>
    </div>
  );
}
