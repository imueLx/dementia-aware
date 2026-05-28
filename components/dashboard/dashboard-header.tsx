import type { DashboardCopy } from "@/constants/i18n/dashboard";

type DashboardHeaderProps = {
  copy: DashboardCopy["header"];
  restrictedLabel: string;
  medicalOnlyNote: string;
  totalRecords: number;
  lastUpdated: string;
};

export function DashboardHeader({
  copy,
  restrictedLabel,
  medicalOnlyNote,
  totalRecords,
  lastUpdated,
}: DashboardHeaderProps) {
  return (
    <header className="rounded-[2rem] border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <span className="inline-flex rounded-full bg-purple-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-purple-800">
            {restrictedLabel}
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
            {copy.subtitle}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-80 lg:grid-cols-1">
          <div className="rounded-2xl bg-purple-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-purple-700">
              {copy.totalRecords}
            </p>
            <p className="mt-1 text-3xl font-bold text-purple-950">
              {totalRecords}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              {copy.lastUpdated}
            </p>
            <p className="mt-1 text-sm font-bold text-slate-950">
              {lastUpdated}
            </p>
          </div>
        </div>
      </div>
      <p className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-4 text-sm font-semibold leading-6 text-purple-900">
        {medicalOnlyNote}
      </p>
    </header>
  );
}
