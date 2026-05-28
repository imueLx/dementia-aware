import type { DashboardFilters } from "@/lib/dashboard/dashboard-types";
import { filterMedicalRecordsForDashboard } from "@/lib/assessment/medical-transformers";
import { assertMedicalDashboardRecord, canReadClinicalDashboard } from "@/lib/security/access-policy";
import {
  getMedicalRecordStore,
  type MedicalClinicalRecord,
} from "./medical-record-store";

export async function createMedicalRecord(record: MedicalClinicalRecord) {
  assertMedicalDashboardRecord(record);
  const store = getMedicalRecordStore();
  store.set(record.recordId, record);
  return record;
}

export async function listMedicalRecords() {
  if (!canReadClinicalDashboard()) {
    return [];
  }

  return Array.from(getMedicalRecordStore().values())
    .filter((record) => record.source === "medical-professional")
    .sort(
      (a, b) =>
        new Date(b.assessmentDate).getTime() -
        new Date(a.assessmentDate).getTime(),
    );
}

export async function getMedicalRecordById(recordId: string) {
  const record = getMedicalRecordStore().get(recordId);

  if (!record || record.source !== "medical-professional") {
    return null;
  }

  return record;
}

export async function filterMedicalRecords(filters: DashboardFilters) {
  return filterMedicalRecordsForDashboard(await listMedicalRecords(), filters);
}
