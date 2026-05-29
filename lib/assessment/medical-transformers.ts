import { z } from "zod";
import type { MedicalAssessmentPayload } from "@/lib/assessment/medical-types";
import type { DashboardFilters } from "@/lib/dashboard/dashboard-types";
import type { MedicalClinicalRecord } from "@/lib/data/medical-record-store";
import { lookupMedicalInterpretationMatrix } from "./medical-interpretation-matrix";

const persistedMedicalRecordSchema = z.object({
  recordId: z.string().min(1),
  patientId: z.string().min(1),
  caseNumber: z.string().min(1),
  fullName: z.string().optional(),
  age: z.number().int().min(18).max(120),
  sexAssignedAtBirth: z.enum(["male", "female"]),
  yearsOfFormalEducation: z.enum(["0-6", "7-12", "13-16", "17-plus"]),
  clinicianNameOrId: z.string().min(1),
  assessmentDate: z.string().min(1),
  moca: z.object({
    rawTotal: z.number().min(0).max(30),
    educationAdjustment: z.number().min(0).max(1),
    adjustedTotal: z.number().min(0).max(30),
    domainBreakdown: z.array(z.any()),
  }),
  katz: z.object({
    total: z.number().min(0).max(6),
    itemBreakdown: z.array(
      z.object({
        id: z.enum([
          "bathing",
          "dressing",
          "toileting",
          "transferring",
          "continence",
          "feeding",
        ]),
        label: z.string(),
        response: z.enum(["independent", "dependent"]),
        score: z.union([z.literal(0), z.literal(1)]),
      }),
    ),
  }),
  interpretation: z.object({
    diagnosticCategory: z.enum([
      "Normal",
      "MCI",
      "Moderate Dementia",
      "Severe Dementia",
    ]),
    matrixInterpretation: z.string().optional(),
    summary: z.string(),
    recommendation: z.string(),
    referralAction: z.string().optional(),
    dashboardCategory: z.string().optional(),
  }),
  createdAt: z.string().min(1),
  source: z.literal("medical-professional"),
});

export function buildRecordId(patientId: string, assessmentDate: string) {
  const safePatientId = patientId.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `med_${safePatientId}_${new Date(assessmentDate).getTime()}`;
}

export function transformMedicalPayloadToRecord(
  payload: MedicalAssessmentPayload,
): MedicalClinicalRecord {
  const record: MedicalClinicalRecord = {
    recordId: buildRecordId(payload.demographics.patientId, payload.assessmentDate),
    patientId: payload.demographics.patientId,
    caseNumber: payload.demographics.patientId,
    fullName: payload.demographics.fullName,
    age: payload.demographics.age,
    sexAssignedAtBirth: payload.demographics.sexAtBirth,
    yearsOfFormalEducation: payload.demographics.educationYears,
    clinicianNameOrId: payload.clinicianIdentifier,
    assessmentDate: payload.assessmentDate,
    moca: {
      rawTotal: payload.moca.rawTotal,
      educationAdjustment: payload.moca.educationAdjustment,
      adjustedTotal: payload.moca.adjustedTotal,
      domainBreakdown: payload.moca.domainBreakdown,
    },
    katz: {
      total: payload.katz.total,
      itemBreakdown: Object.entries(payload.katz.responses).map(
        ([id, response]) => ({
          id: id as MedicalClinicalRecord["katz"]["itemBreakdown"][number]["id"],
          label:
            id.charAt(0).toUpperCase() +
            id.slice(1).replace(/([A-Z])/g, " $1"),
          response,
          score: response === "independent" ? 1 : 0,
        }),
      ),
    },
    interpretation: {
      diagnosticCategory: payload.interpretation.label,
      matrixInterpretation: payload.interpretation.matrixInterpretation,
      summary: payload.interpretation.recommendation,
      recommendation: payload.interpretation.referralAction,
      referralAction: payload.interpretation.referralAction,
      dashboardCategory: payload.interpretation.label,
    },
    createdAt: new Date().toISOString(),
    source: "medical-professional",
  };

  return persistedMedicalRecordSchema.parse(record) as MedicalClinicalRecord;
}

export function transformRecordToMedicalPayload(
  record: MedicalClinicalRecord,
): MedicalAssessmentPayload {
  const matrixLookup = lookupMedicalInterpretationMatrix(
    record.moca.adjustedTotal,
    record.katz.total
  );

  const isLegacy = !record.interpretation.matrixInterpretation ||
    record.interpretation.matrixInterpretation === record.interpretation.diagnosticCategory ||
    ["Normal", "MCI", "Moderate Dementia", "Severe Dementia"].includes(record.interpretation.matrixInterpretation);

  const matrixInterpretation = isLegacy ? matrixLookup.matrixInterpretation : record.interpretation.matrixInterpretation!;
  const recommendation = isLegacy ? matrixLookup.recommendation : record.interpretation.summary;
  const referralAction = isLegacy ? matrixLookup.referralAction : (record.interpretation.referralAction ?? record.interpretation.recommendation);

  return {
    track: "medical-professional",
    demographics: {
      patientId: record.patientId,
      fullName: record.fullName,
      age: record.age,
      sexAtBirth: record.sexAssignedAtBirth,
      educationYears: record.yearsOfFormalEducation,
      clinicianNameOrId: record.clinicianNameOrId,
    },
    moca: {
      rawTotal: record.moca.rawTotal,
      educationAdjustment: record.moca.educationAdjustment,
      adjustedTotal: record.moca.adjustedTotal,
      domainBreakdown: record.moca.domainBreakdown,
    },
    katz: {
      total: record.katz.total,
      responses: record.katz.itemBreakdown.reduce((responses, item) => {
        responses[item.id] = item.response;
        return responses;
      }, {} as MedicalAssessmentPayload["katz"]["responses"]),
    },
    interpretation: {
      label: record.interpretation.diagnosticCategory,
      matrixInterpretation,
      recommendation,
      referralAction,
    },
    recommendation,
    referralAction,
    assessmentDate: record.assessmentDate,
    clinicianIdentifier: record.clinicianNameOrId,
    transmissionTarget: "restricted-clinical-central-dashboard",
  };
}

export function filterMedicalRecordsForDashboard(
  records: MedicalClinicalRecord[],
  filters: DashboardFilters,
) {
  const query = filters.patientId.trim().toLowerCase();

  return records.filter((record) => {
    const matchesPatient =
      !query ||
      record.patientId.toLowerCase().includes(query) ||
      record.caseNumber.toLowerCase().includes(query);
    const matchesAge =
      filters.ageRange === "all" ||
      (filters.ageRange === "under-65" && record.age < 65) ||
      (filters.ageRange === "65-74" && record.age >= 65 && record.age <= 74) ||
      (filters.ageRange === "75-84" && record.age >= 75 && record.age <= 84) ||
      (filters.ageRange === "85-plus" && record.age >= 85);
    const matchesCategory =
      filters.diagnosticCategory === "all" ||
      record.interpretation.diagnosticCategory === filters.diagnosticCategory;

    return matchesPatient && matchesAge && matchesCategory;
  });
}

export function transformRecordToDashboardRecord(record: MedicalClinicalRecord) {
  return {
    assessmentId: record.recordId,
    track: record.source,
    patientId: record.patientId,
    caseNumber: record.caseNumber,
    fullName: record.fullName,
    age: record.age,
    sexAssignedAtBirth: record.sexAssignedAtBirth,
    yearsOfFormalEducation: record.yearsOfFormalEducation,
    clinicianNameOrId: record.clinicianNameOrId,
    assessmentDate: record.assessmentDate,
    rawMocaScore: record.moca.rawTotal,
    educationAdjustment: record.moca.educationAdjustment,
    adjustedMocaScore: record.moca.adjustedTotal,
    mocaDomainBreakdown: record.moca.domainBreakdown,
    katzScore: record.katz.total,
    katzItemBreakdown: record.katz.itemBreakdown,
    diagnosticCategory: record.interpretation.diagnosticCategory,
    recommendation: record.interpretation.summary,
    referralAction: record.interpretation.recommendation,
  } as const;
}
