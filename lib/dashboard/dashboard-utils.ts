import type {
  DashboardAgeFilter,
  DashboardFilters,
  DashboardKpis,
  DashboardPatientRecord,
  DiagnosticCategory,
} from "./dashboard-types";

export const diagnosticCategoryValues: DiagnosticCategory[] = [
  "Normal",
  "MCI",
  "Moderate Dementia",
  "Severe Dementia",
];

export const ageFilterValues: DashboardAgeFilter[] = [
  "all",
  "under-65",
  "65-74",
  "75-84",
  "85-plus",
];

export const emptyDashboardFilters: DashboardFilters = {
  patientId: "",
  ageRange: "all",
  diagnosticCategory: "all",
};

export function matchesAgeRange(age: number, ageRange: DashboardAgeFilter) {
  if (ageRange === "under-65") return age < 65;
  if (ageRange === "65-74") return age >= 65 && age <= 74;
  if (ageRange === "75-84") return age >= 75 && age <= 84;
  if (ageRange === "85-plus") return age >= 85;
  return true;
}

export function filterDashboardRecords(
  records: DashboardPatientRecord[],
  filters: DashboardFilters,
) {
  const query = filters.patientId.trim().toLowerCase();

  return records.filter((record) => {
    const matchesPatient =
      !query ||
      record.patientId.toLowerCase().includes(query) ||
      record.caseNumber.toLowerCase().includes(query);
    const matchesAge = matchesAgeRange(record.age, filters.ageRange);
    const matchesCategory =
      filters.diagnosticCategory === "all" ||
      record.diagnosticCategory === filters.diagnosticCategory;

    return matchesPatient && matchesAge && matchesCategory;
  });
}

export function computeDashboardKpis(
  records: DashboardPatientRecord[],
): DashboardKpis {
  const totalRecords = records.length;
  const countByCategory = (category: DiagnosticCategory) =>
    records.filter((record) => record.diagnosticCategory === category).length;
  const average = (values: number[]) =>
    values.length === 0
      ? 0
      : Math.round(
          (values.reduce((sum, value) => sum + value, 0) / values.length) * 10,
        ) / 10;

  return {
    totalRecords,
    normal: countByCategory("Normal"),
    mci: countByCategory("MCI"),
    moderateDementia: countByCategory("Moderate Dementia"),
    severeDementia: countByCategory("Severe Dementia"),
    averageAdjustedMoca: average(
      records.map((record) => record.adjustedMocaScore),
    ),
    averageKatz: average(records.map((record) => record.katzScore)),
  };
}

export function formatDashboardDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(value));
}
