import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createMedicalRecord } from "@/lib/data/medical-record-repository";
import type { MedicalClinicalRecord } from "@/lib/data/medical-record-store";

export async function POST() {
  // Protect dev endpoints behind an explicit env flag
  if (String(process.env.ENABLE_DEV_ROUTES ?? "false") !== "true") {
    return new Response(null, { status: 404 });
  }
  const { getClinicianSession } = await import("@/lib/auth/session");
  if (!(await getClinicianSession())) {
    return new Response(null, { status: 401 });
  }
  const now = new Date().toISOString();

  const record: MedicalClinicalRecord = {
    recordId: `dev-${uuidv4()}`,
    patientId: `DEV-${Math.floor(Math.random() * 100000)}`,
    caseNumber: `CASE-${Math.floor(Math.random() * 100000)}`,
    fullName: "Dev Test Patient",
    age: 72,
    sexAssignedAtBirth: "male",
    yearsOfFormalEducation: "13-16",
    clinicianNameOrId: "dev-tester",
    assessmentDate: now,
    moca: {
      rawTotal: 25,
      educationAdjustment: 1,
      adjustedTotal: 26,
      domainBreakdown: [],
    },
    katz: {
      total: 6,
      itemBreakdown: [],
    },
    interpretation: {
      diagnosticCategory: "Normal",
      summary: "Dev-created sample record",
      recommendation: "None",
    },
    createdAt: now,
    source: "medical-professional",
  };

  try {
    const created = await createMedicalRecord(record);
    return NextResponse.json({ ok: true, recordId: created.recordId });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, message: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
