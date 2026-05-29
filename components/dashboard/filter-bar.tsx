"use client";

import type { DashboardCopy } from "@/constants/i18n/dashboard";
import type { DashboardFilters } from "@/lib/dashboard/dashboard-types";
import {
  ageFilterValues,
  diagnosticCategoryValues,
  emptyDashboardFilters,
} from "@/lib/dashboard/dashboard-utils";

type FilterBarProps = {
  copy: DashboardCopy["filters"];
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
};

export function FilterBar({ copy, filters, onFiltersChange }: FilterBarProps) {
  return (
    <section
      className="rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="dashboard-filter-heading"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="grid flex-1 gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="patientIdFilter"
              className="text-sm font-bold text-slate-800"
            >
              {copy.patientId}
            </label>
            <input
              id="patientIdFilter"
              type="search"
              value={filters.patientId}
              onChange={(event) =>
                onFiltersChange({ ...filters, patientId: event.target.value })
              }
              placeholder={copy.patientIdPlaceholder}
              className="mt-2 h-12 w-full rounded-2xl border border-purple-100 bg-white px-4 text-base outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label
              htmlFor="ageRangeFilter"
              className="text-sm font-bold text-slate-800"
            >
              {copy.age}
            </label>
            <select
              id="ageRangeFilter"
              value={filters.ageRange}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  ageRange: event.target.value as DashboardFilters["ageRange"],
                })
              }
              className="mt-2 h-12 w-full rounded-2xl border border-purple-100 bg-white px-4 text-base outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-600"
            >
              {ageFilterValues.map((value) => (
                <option key={value} value={value}>
                  {copy.ageFilters[value]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="diagnosticCategoryFilter"
              className="text-sm font-bold text-slate-800"
            >
              {copy.diagnosticCategory}
            </label>
            <select
              id="diagnosticCategoryFilter"
              value={filters.diagnosticCategory}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  diagnosticCategory: event.target
                    .value as DashboardFilters["diagnosticCategory"],
                })
              }
              className="mt-2 h-12 w-full rounded-2xl border border-purple-100 bg-white px-4 text-base outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-600"
            >
              <option value="all">{copy.allCategories}</option>
              {diagnosticCategoryValues.map((category) => (
                <option key={category} value={category}>
                  {copy.categories[category]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onFiltersChange(emptyDashboardFilters)}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-purple-200 bg-white px-5 text-sm font-bold text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
        >
          {copy.reset}
        </button>
      </div>
    </section>
  );
}
