import type { MocaDomainScore } from "@/lib/assessment/medical-types";

type MocaDomainListProps = {
  domains: MocaDomainScore[];
};

export function MocaDomainList({ domains }: MocaDomainListProps) {
  return (
    <div className="grid gap-2">
      {domains.map((domain) => {
        const percent =
          domain.maxScore === 0
            ? 0
            : Math.round((domain.score / domain.maxScore) * 100);

        return (
          <div key={domain.id} className="rounded-2xl bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-800">
                {domain.title}
              </span>
              <span className="text-sm font-bold text-slate-950">
                {domain.score}/{domain.maxScore}
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white">
              <div
                className="h-2 rounded-full bg-purple-700"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
