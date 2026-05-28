"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCopy } from "@/lib/i18n/use-copy";
import { useLanguage } from "@/lib/i18n/use-language";
import type {
  DashboardFilters,
  DashboardPatientRecord,
} from "@/lib/dashboard/dashboard-types";
import {
  computeDashboardKpis,
  emptyDashboardFilters,
  filterDashboardRecords,
  formatDashboardDate,
} from "@/lib/dashboard/dashboard-utils";
import { DashboardHeader } from "./dashboard-header";
import { EmptyState } from "./empty-state";
import { FilterBar } from "./filter-bar";
import { KpiCards } from "./kpi-cards";
import { PatientDetailDrawer } from "./patient-detail-drawer";
import { PatientTable } from "./patient-table";
import { LanguageToggle } from "@/components/layout/language-toggle";

type DashboardShellProps = {
  initialRecords: DashboardPatientRecord[];
};

export function DashboardShell({ initialRecords }: DashboardShellProps) {
  const copy = useCopy("dashboard");
  const { language } = useLanguage();
  const router = useRouter();
  const [filters, setFilters] = useState<DashboardFilters>(
    emptyDashboardFilters,
  );
  const [selectedRecord, setSelectedRecord] =
    useState<DashboardPatientRecord | null>(null);

  const filteredRecords = useMemo(
    () => filterDashboardRecords(initialRecords, filters),
    [initialRecords, filters],
  );
  const kpis = useMemo(
    () => computeDashboardKpis(initialRecords),
    [initialRecords],
  );
  const hasAnyRecords = initialRecords.length > 0;
  const lastUpdated =
    initialRecords.length === 0
      ? copy.lastUpdatedEmpty
      : formatDashboardDate(
          [...initialRecords].sort(
            (a, b) =>
              new Date(b.assessmentDate).getTime() -
              new Date(a.assessmentDate).getTime(),
          )[0].assessmentDate,
          language === "fil" ? "fil-PH" : "en",
        );

  const handleDownloadPdf = (record: DashboardPatientRecord) => {
    router.push(`/assessment/medical/results?id=${record.assessmentId}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <LanguageToggle />
        </div>
        <DashboardHeader
          copy={copy.header}
          restrictedLabel={copy.shell.restricted}
          medicalOnlyNote={copy.shell.medicalOnly}
          totalRecords={initialRecords.length}
          lastUpdated={lastUpdated}
        />

        <KpiCards copy={copy.kpis} kpis={kpis} />

        <FilterBar
          copy={copy.filters}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {!hasAnyRecords ? (
          <EmptyState copy={copy.empty} type="no-records" />
        ) : filteredRecords.length === 0 ? (
          <EmptyState copy={copy.empty} type="no-matches" />
        ) : (
          <PatientTable
            copy={copy}
            records={filteredRecords}
            onViewDetails={setSelectedRecord}
            onDownloadPdf={handleDownloadPdf}
          />
        )}
      </div>

      <PatientDetailDrawer
        copy={copy.drawer}
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </main>
  );
}
