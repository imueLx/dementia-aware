import type { DashboardKatzItem } from "@/lib/dashboard/dashboard-types";

type KatzSummaryProps = {
  items: DashboardKatzItem[];
};

export function KatzSummary({ items }: KatzSummaryProps) {
  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3"
        >
          <span className="text-sm font-semibold text-slate-800">
            {item.label}
          </span>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              item.response === "independent"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {item.response === "independent" ? "Independent" : "Dependent"}
          </span>
        </li>
      ))}
    </ul>
  );
}
