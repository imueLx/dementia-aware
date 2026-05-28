"use server";

import { createMedicalRecord } from "@/lib/data/medical-record-repository";
import {
  buildMedicalAssessmentPayload,
} from "./medical-scoring";
import { medicalAssessmentSchema } from "./medical-schema";
import type { MedicalAssessmentFormValues } from "./medical-types";
import { transformMedicalPayloadToRecord } from "./medical-transformers";

export type SubmitMedicalAssessmentResult =
  | { ok: true; recordId: string }
  | { ok: false; message: string };

export async function submitMedicalAssessment(
  values: MedicalAssessmentFormValues,
  assessmentDate: string,
): Promise<SubmitMedicalAssessmentResult> {
  const parsed = medicalAssessmentSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Medical assessment validation failed.",
    };
  }

  const payload = buildMedicalAssessmentPayload(parsed.data, assessmentDate);

  if (payload.track !== "medical-professional") {
    return {
      ok: false,
      message: "Only medical-professional assessments may be persisted.",
    };
  }

  const record = transformMedicalPayloadToRecord(payload);
  await createMedicalRecord(record);

  return {
    ok: true,
    recordId: record.recordId,
  };
}
