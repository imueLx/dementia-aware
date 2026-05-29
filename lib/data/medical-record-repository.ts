import type { DashboardFilters } from "@/lib/dashboard/dashboard-types";
import { filterMedicalRecordsForDashboard } from "@/lib/assessment/medical-transformers";
import {
  assertMedicalDashboardRecord,
  canReadClinicalDashboard,
} from "@/lib/security/access-policy";
import {
  getMedicalRecordStore,
  type MedicalClinicalRecord,
} from "./medical-record-store";
import { getMedicalCollection } from "./mongo-client";

const USE_MONGO = Boolean(process.env.MONGODB_URI);

export async function createMedicalRecord(record: MedicalClinicalRecord) {
  assertMedicalDashboardRecord(record);

  if (USE_MONGO) {
    const coll = await getMedicalCollection();
    // Insert the record; rely on schema validation earlier in the pipeline
    await coll.insertOne(record as unknown as Record<string, unknown>);
    return record;
  }

  const store = getMedicalRecordStore();
  store.set(record.recordId, record);
  return record;
}

export async function listMedicalRecords() {
  if (!canReadClinicalDashboard()) {
    return [];
  }

  if (USE_MONGO) {
    const coll = await getMedicalCollection();
    const docs = await coll
      .find({ source: "medical-professional" })
      .sort({ assessmentDate: -1 })
      .toArray();

    return docs as unknown as MedicalClinicalRecord[];
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
  if (USE_MONGO) {
    const coll = await getMedicalCollection();
    const record = await coll.findOne({ recordId });

    if (!record || record.source !== "medical-professional") {
      return null;
    }

    return record as unknown as MedicalClinicalRecord;
  }

  const record = getMedicalRecordStore().get(recordId);

  if (!record || record.source !== "medical-professional") {
    return null;
  }

  return record;
}

export async function filterMedicalRecords(filters: DashboardFilters) {
  return filterMedicalRecordsForDashboard(await listMedicalRecords(), filters);
}
