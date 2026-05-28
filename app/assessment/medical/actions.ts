"use server";

import {
  submitMedicalAssessment,
  type SubmitMedicalAssessmentResult,
} from "@/lib/assessment/medical-submit";
import type { MedicalAssessmentFormValues } from "@/lib/assessment/medical-types";

export async function submitMedicalAssessmentAction(
  values: MedicalAssessmentFormValues,
  assessmentDate: string,
): Promise<SubmitMedicalAssessmentResult> {
  return submitMedicalAssessment(values, assessmentDate);
}
