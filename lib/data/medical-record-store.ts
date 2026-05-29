import type {
  ClinicalInterpretationLabel,
  EducationYearsOption,
  KatzItemId,
  KatzResponse,
  MocaDomainScore,
  SexAtBirth,
} from "@/lib/assessment/medical-types";
import { mockMedicalRecords } from "./mock-medical-records";

export type MedicalClinicalRecord = {
  recordId: string;
  patientId: string;
  caseNumber: string;
  fullName?: string;
  age: number;
  sexAssignedAtBirth: SexAtBirth;
  yearsOfFormalEducation: EducationYearsOption;
  clinicianNameOrId: string;
  assessmentDate: string;
  moca: {
    rawTotal: number;
    educationAdjustment: number;
    adjustedTotal: number;
    domainBreakdown: MocaDomainScore[];
  };
  katz: {
    total: number;
    itemBreakdown: Array<{
      id: KatzItemId;
      label: string;
      response: KatzResponse;
      score: 0 | 1;
    }>;
  };
  interpretation: {
    diagnosticCategory: ClinicalInterpretationLabel;
    matrixInterpretation?: string;
    summary: string;
    recommendation: string;
    referralAction?: string;
    dashboardCategory?: string;
  };
  createdAt: string;
  source: "medical-professional";
};

type MedicalRecordStore = Map<string, MedicalClinicalRecord>;

const globalForMedicalRecords = globalThis as typeof globalThis & {
  __dementiaAwareMedicalRecordStore?: MedicalRecordStore;
};

export function getMedicalRecordStore() {
  if (!globalForMedicalRecords.__dementiaAwareMedicalRecordStore) {
    globalForMedicalRecords.__dementiaAwareMedicalRecordStore = new Map(
      mockMedicalRecords.map((record) => [record.recordId, record]),
    );
  }

  return globalForMedicalRecords.__dementiaAwareMedicalRecordStore;
}
