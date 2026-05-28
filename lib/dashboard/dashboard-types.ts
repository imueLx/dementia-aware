import type {
  ClinicalInterpretationLabel,
  EducationYearsOption,
  KatzItemId,
  KatzResponse,
  MocaDomainScore,
  SexAtBirth,
} from "@/lib/assessment/medical-types";

export type DiagnosticCategory = ClinicalInterpretationLabel;

export type DashboardAgeFilter = "all" | "under-65" | "65-74" | "75-84" | "85-plus";

export type DashboardFilters = {
  patientId: string;
  ageRange: DashboardAgeFilter;
  diagnosticCategory: "all" | DiagnosticCategory;
};

export type DashboardKatzItem = {
  id: KatzItemId;
  label: string;
  response: KatzResponse;
  score: 0 | 1;
};

export type DashboardPatientRecord = {
  assessmentId: string;
  track: "medical-professional";
  patientId: string;
  caseNumber: string;
  fullName?: string;
  age: number;
  sexAssignedAtBirth: SexAtBirth;
  yearsOfFormalEducation: EducationYearsOption;
  clinicianNameOrId: string;
  assessmentDate: string;
  rawMocaScore: number;
  educationAdjustment: number;
  adjustedMocaScore: number;
  mocaDomainBreakdown: MocaDomainScore[];
  katzScore: number;
  katzItemBreakdown: DashboardKatzItem[];
  diagnosticCategory: DiagnosticCategory;
  recommendation: string;
  referralAction: string;
};

export type DashboardKpis = {
  totalRecords: number;
  normal: number;
  mci: number;
  moderateDementia: number;
  severeDementia: number;
  averageAdjustedMoca: number;
  averageKatz: number;
};
