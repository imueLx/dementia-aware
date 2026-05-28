"use client";

import Link from "next/link";
import type { MedicalResultsCopy } from "@/constants/i18n/medical-results";

type ExportActionsProps = {
  copy: MedicalResultsCopy["actions"];
};

export function ExportActions({ copy }: ExportActionsProps) {
  const handlePrint = () => window.print();

  return (
    <div className="no-print flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-purple-700 px-5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
      >
        {copy.print}
      </button>
      <button
        type="button"
        onClick={handlePrint}
        title={copy.downloadPdfHint}
        className="inline-flex min-h-12 items-center justify-center rounded-full border border-purple-200 bg-white px-5 text-sm font-bold text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
      >
        {copy.downloadPdf}
      </button>
      <Link
        href="/assessment/medical"
        className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
      >
        {copy.backAssessment}
      </Link>
      <button
        type="button"
        disabled
        title={copy.dashboardHint}
        className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-5 text-sm font-bold text-slate-500"
      >
        {copy.dashboard}
      </button>
    </div>
  );
}
