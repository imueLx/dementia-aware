import type { MedicalClinicalRecord } from "@/lib/data/medical-record-store";

import { getClinicianSession } from "@/lib/auth/session";

export function assertMedicalDashboardRecord(record: MedicalClinicalRecord) {
  if (record.source !== "medical-professional") {
    throw new Error(
      "Only medical-professional records may enter the dashboard.",
    );
  }
}

export async function canReadClinicalDashboard() {
  return Boolean(await getClinicianSession());
}
