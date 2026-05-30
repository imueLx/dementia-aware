"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
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
import { DeleteConfirmModal } from "./delete-confirm-modal";

type DashboardShellProps = {
  initialRecords: DashboardPatientRecord[];
};

export function DashboardShell({ initialRecords }: DashboardShellProps) {
  const pageSize = 10;
  const copy = useCopy("dashboard");
  const { language } = useLanguage();
  const router = useRouter();
  const [records, setRecords] =
    useState<DashboardPatientRecord[]>(initialRecords);
  const [filters, setFilters] = useState<DashboardFilters>(
    emptyDashboardFilters,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] =
    useState<DashboardPatientRecord | null>(null);
  const [pendingDelete, setPendingDelete] =
    useState<DashboardPatientRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredRecords = useMemo(
    () => filterDashboardRecords(records, filters),
    [records, filters],
  );
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [currentPage, filteredRecords]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const kpis = useMemo(() => computeDashboardKpis(records), [records]);
  const hasAnyRecords = records.length > 0;
  const lastUpdated =
    records.length === 0
      ? copy.lastUpdatedEmpty
      : formatDashboardDate(
          [...records].sort(
            (a, b) =>
              new Date(b.assessmentDate).getTime() -
              new Date(a.assessmentDate).getTime(),
          )[0].assessmentDate,
          language === "fil" ? "fil-PH" : "en",
        );

  const handleFiltersChange = (nextFilters: DashboardFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const handleOpenDeleteModal = (record: DashboardPatientRecord) => {
    setPendingDelete(record);
  };

  const handleDeleteRecord = async () => {
    if (!pendingDelete || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/dashboard/medical/${pendingDelete.assessmentId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Delete request failed");
      }

      setRecords((prev) =>
        prev.filter(
          (record) => record.assessmentId !== pendingDelete.assessmentId,
        ),
      );
      setSelectedRecord((prev) =>
        prev?.assessmentId === pendingDelete.assessmentId ? null : prev,
      );
      setPendingDelete(null);
    } catch {
      window.alert(copy.actions.deleteFailed);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadPdf = (record: DashboardPatientRecord) => {
    // Open the server-side PDF for the given record in a new tab/window
    if (typeof window !== "undefined") {
      const url = `/api/medical/report/${record.assessmentId}?ts=${Date.now()}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
    } finally {
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-3 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <LanguageToggle />
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-purple-200 bg-white px-3 py-2 text-xs font-bold text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4 sm:px-4 sm:text-sm"
          >
            Logout
          </button>
        </div>
        <DashboardHeader
          copy={copy.header}
          restrictedLabel={copy.shell.restricted}
          medicalOnlyNote={copy.shell.medicalOnly}
          totalRecords={records.length}
          lastUpdated={lastUpdated}
        />

        <KpiCards copy={copy.kpis} kpis={kpis} />

        <FilterBar
          copy={copy.filters}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {!hasAnyRecords ? (
          <EmptyState copy={copy.empty} type="no-records" />
        ) : filteredRecords.length === 0 ? (
          <EmptyState copy={copy.empty} type="no-matches" />
        ) : (
          <PatientTable
            copy={copy}
            records={paginatedRecords}
            onViewDetails={setSelectedRecord}
            onDownloadPdf={handleDownloadPdf}
            onDelete={handleOpenDeleteModal}
            deletingRecordId={
              isDeleting ? (pendingDelete?.assessmentId ?? null) : null
            }
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={filteredRecords.length}
            pageSize={pageSize}
            onPreviousPage={() =>
              setCurrentPage((prev) => Math.max(1, prev - 1))
            }
            onNextPage={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          />
        )}
      </div>

      <PatientDetailDrawer
        copy={copy.drawer}
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      <DeleteConfirmModal
        copy={copy.actions}
        record={pendingDelete}
        isDeleting={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setPendingDelete(null);
          }
        }}
        onConfirm={handleDeleteRecord}
      />
    </main>
  );
}
