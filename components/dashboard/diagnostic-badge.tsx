import type { DiagnosticCategory } from "@/lib/dashboard/dashboard-types";

type DiagnosticBadgeProps = {
  category: DiagnosticCategory;
  label?: string;
};

export function DiagnosticBadge({ category, label }: DiagnosticBadgeProps) {
  const className = {
    Normal: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    MCI: "bg-amber-50 text-amber-800 ring-amber-200",
    "Moderate Dementia": "bg-purple-50 text-purple-800 ring-purple-200",
    "Severe Dementia": "bg-rose-50 text-rose-800 ring-rose-200",
  }[category];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${className}`}
    >
      {label ?? category}
    </span>
  );
}
