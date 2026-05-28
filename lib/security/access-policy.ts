import type { MedicalClinicalRecord } from "@/lib/data/medical-record-store";

export function assertMedicalDashboardRecord(record: MedicalClinicalRecord) {
  if (record.source !== "medical-professional") {
    throw new Error("Only medical-professional records may enter the dashboard.");
  }
}

export function canReadClinicalDashboard() {
  // Placeholder for future auth/RBAC integration.
  return true;
}
