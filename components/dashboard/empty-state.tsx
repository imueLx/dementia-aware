import type { DashboardCopy } from "@/constants/i18n/dashboard";

type EmptyStateProps = {
  copy: DashboardCopy["empty"];
  type: "no-records" | "no-matches";
};

export function EmptyState({ copy, type }: EmptyStateProps) {
  const title =
    type === "no-records" ? copy.noRecordsTitle : copy.noMatchesTitle;
  const description =
    type === "no-records"
      ? copy.noRecordsDescription
      : copy.noMatchesDescription;

  return (
    <div className="rounded-[1.75rem] border border-dashed border-purple-200 bg-white p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-lg font-bold text-purple-800">
        DA
      </div>
      <h2 className="mt-5 text-2xl font-bold text-slate-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-base leading-7 text-slate-700">
        {description}
      </p>
    </div>
  );
}
