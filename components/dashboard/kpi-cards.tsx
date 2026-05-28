import type { DashboardCopy } from "@/constants/i18n/dashboard";
import type { DashboardKpis } from "@/lib/dashboard/dashboard-types";

type KpiCardsProps = {
  copy: DashboardCopy["kpis"];
  kpis: DashboardKpis;
};

function KpiCard({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: string | number;
  tone?: "purple" | "green" | "amber" | "rose" | "slate";
}) {
  const toneClass = {
    purple: "bg-purple-700 text-white",
    green: "bg-emerald-50 text-emerald-950",
    amber: "bg-amber-50 text-amber-950",
    rose: "bg-rose-50 text-rose-950",
    slate: "bg-white text-slate-950",
  }[tone];

  return (
    <div
      className={`rounded-[1.5rem] border border-purple-100 p-5 shadow-sm ${toneClass}`}
    >
      <p className="text-xs font-bold uppercase tracking-wide opacity-75">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

export function KpiCards({ copy, kpis }: KpiCardsProps) {
  return (
    <section
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-7"
      aria-label="Clinical dashboard key performance indicators"
    >
      <KpiCard
        label={copy.totalRecords}
        value={kpis.totalRecords}
        tone="purple"
      />
      <KpiCard label={copy.normal} value={kpis.normal} tone="green" />
      <KpiCard label={copy.mci} value={kpis.mci} tone="amber" />
      <KpiCard label={copy.moderateDementia} value={kpis.moderateDementia} />
      <KpiCard
        label={copy.severeDementia}
        value={kpis.severeDementia}
        tone="rose"
      />
      <KpiCard
        label={copy.averageAdjustedMoca}
        value={`${kpis.averageAdjustedMoca}/30`}
      />
      <KpiCard label={copy.averageKatz} value={`${kpis.averageKatz}/6`} />
    </section>
  );
}
