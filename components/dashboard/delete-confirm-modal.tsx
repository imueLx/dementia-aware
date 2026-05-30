"use client";

import { useEffect } from "react";
import type { DashboardCopy } from "@/constants/i18n/dashboard";
import type { DashboardPatientRecord } from "@/lib/dashboard/dashboard-types";

type DeleteConfirmModalProps = {
  copy: DashboardCopy["actions"];
  record: DashboardPatientRecord | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmModal({
  copy,
  record,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    if (!record) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [record, isDeleting, onCancel]);

  if (!record) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <h2
          id="delete-modal-title"
          className="text-xl font-bold text-slate-950"
        >
          {copy.confirmDeleteTitle}
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          {copy.confirmDeleteDescription}
        </p>
        <p className="mt-2 text-sm font-bold text-slate-800">
          {record.patientId} - {record.fullName || record.caseNumber}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {copy.cancelDelete}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-rose-200 bg-rose-600 px-4 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isDeleting ? copy.deleting : copy.confirmDelete}
          </button>
        </div>
      </div>
    </div>
  );
}
