import type {
  ClinicalInterpretation,
  ClinicalInterpretationLabel,
} from "./medical-types";

/** Matrix lookup bands per PDF MoCA-P + Katz table (not the 26+ normative rule). */
export type MedicalMatrixCognitiveBand = "21-30" | "20-or-below";

export type MedicalMatrixKatzBand = "6" | "3-5" | "2-or-less";

export type MedicalMatrixRow = {
  cognitiveBand: MedicalMatrixCognitiveBand;
  katzBand: MedicalMatrixKatzBand;
  matrixInterpretation: string;
  dashboardLabel: ClinicalInterpretationLabel;
  action: string;
};

/** MoCA-P scoring pages: 26+ is normative normal (display only; separate from matrix lookup). */
export function isAdjustedMocaNormativeNormal(adjustedMocaTotal: number): boolean {
  return adjustedMocaTotal >= 26;
}

export function resolveMedicalMatrixCognitiveBand(
  adjustedMocaTotal: number,
): MedicalMatrixCognitiveBand {
  return adjustedMocaTotal >= 21 ? "21-30" : "20-or-below";
}

export function resolveMedicalMatrixKatzBand(
  katzTotal: number,
): MedicalMatrixKatzBand {
  if (katzTotal >= 6) {
    return "6";
  }

  if (katzTotal >= 3) {
    return "3-5";
  }

  return "2-or-less";
}

/** Source: guidelines-dementiaware.pdf — MoCA-P + Katz ADLs Assessment Interpretation Guide */
export const MEDICAL_INTERPRETATION_MATRIX_ROWS: MedicalMatrixRow[] = [
  {
    cognitiveBand: "21-30",
    katzBand: "6",
    matrixInterpretation: "Healthy Aging",
    dashboardLabel: "Normal",
    action:
      "Routine Monitoring: Provide preventative wellness education. Re-screen annually or if new complaints surface.",
  },
  {
    cognitiveBand: "21-30",
    katzBand: "3-5",
    matrixInterpretation: "Isolated Physical Deconditioning",
    dashboardLabel: "Normal",
    action:
      "Physical Rehabilitation: Refer to Physical Therapy (PT) or Occupational Therapy (OT) to regain strength. Request a home safety assessment to prevent falls.",
  },
  {
    cognitiveBand: "21-30",
    katzBand: "2-or-less",
    matrixInterpretation: "Severe Physical Disability",
    dashboardLabel: "Normal",
    action:
      "Long-Term Care Support: Refer to Home Health Care Services and social workers. Order specialized assistive devices and mobility aids.",
  },
  {
    cognitiveBand: "20-or-below",
    katzBand: "6",
    matrixInterpretation: "Early Cognitive Decline / Mild MCI",
    dashboardLabel: "MCI",
    action:
      "Neurological Diagnostic Panel: Refer to a Neurologist or Geriatric Psychiatrist. Order baseline labs TSH, B12, CBC. Initiate driving and medication safety counselling.",
  },
  {
    cognitiveBand: "20-or-below",
    katzBand: "3-5",
    matrixInterpretation: "Cognitive Decline with Functional Deficits",
    dashboardLabel: "Moderate Dementia",
    action:
      "Geriatric Co-Management: Refer to a Geriatrician for pharmacological evaluation. Engage Occupational Therapy (OT) for highly structured routines at home.",
  },
  {
    cognitiveBand: "20-or-below",
    katzBand: "2-or-less",
    matrixInterpretation: "Advanced Neurodegenerative State",
    dashboardLabel: "Severe Dementia",
    action:
      "Comprehensive Care / Palliative Services: Immediate referral to a Multidisciplinary Geriatric Palliative Team or memory care institution. Implement 24/7 supervision and support family caregivers against burnout.",
  },
];

export function lookupMedicalInterpretationMatrix(
  adjustedMocaTotal: number,
  katzTotal: number,
): ClinicalInterpretation {
  const cognitiveBand = resolveMedicalMatrixCognitiveBand(adjustedMocaTotal);
  const katzBand = resolveMedicalMatrixKatzBand(katzTotal);

  const row = MEDICAL_INTERPRETATION_MATRIX_ROWS.find(
    (candidate) =>
      candidate.cognitiveBand === cognitiveBand &&
      candidate.katzBand === katzBand,
  );

  if (!row) {
    throw new Error(
      `No medical interpretation matrix row for cognitive=${cognitiveBand}, katz=${katzBand}`,
    );
  }

  return {
    label: row.dashboardLabel,
    matrixInterpretation: row.matrixInterpretation,
    recommendation: row.action,
    referralAction: row.action,
  };
}
