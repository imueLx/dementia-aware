import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CAREGIVER_INTERPRETATION_MATRIX_ROWS,
  lookupCaregiverInterpretationMatrix,
  resolveLawtonFunctionalBand,
  resolveMiniCogRiskBand,
} from "./caregiver-interpretation-matrix";
import {
  MEDICAL_INTERPRETATION_MATRIX_ROWS,
  lookupMedicalInterpretationMatrix,
  resolveMedicalMatrixCognitiveBand,
  resolveMedicalMatrixKatzBand,
} from "./medical-interpretation-matrix";

test("medical matrix has six PDF rows", () => {
  assert.equal(MEDICAL_INTERPRETATION_MATRIX_ROWS.length, 6);
});

test("caregiver matrix has six PDF rows", () => {
  assert.equal(CAREGIVER_INTERPRETATION_MATRIX_ROWS.length, 6);
});

test("medical matrix row 1: 21-30 cognitive, Katz 6", () => {
  const result = lookupMedicalInterpretationMatrix(28, 6);
  assert.equal(resolveMedicalMatrixCognitiveBand(28), "21-30");
  assert.equal(resolveMedicalMatrixKatzBand(6), "6");
  assert.equal(result.matrixInterpretation, "Healthy Aging");
  assert.equal(result.label, "Normal");
  assert.match(result.recommendation, /Routine Monitoring/i);
});

test("medical matrix row 2: 21-30 cognitive, Katz 3-5", () => {
  const result = lookupMedicalInterpretationMatrix(25, 4);
  assert.equal(result.matrixInterpretation, "Isolated Physical Deconditioning");
  assert.equal(result.label, "Normal");
  assert.match(result.recommendation, /Physical Rehabilitation/i);
});

test("medical matrix row 3: 21-30 cognitive, Katz 2 or below", () => {
  const result = lookupMedicalInterpretationMatrix(30, 1);
  assert.equal(result.matrixInterpretation, "Severe Physical Disability");
  assert.equal(result.label, "Normal");
  assert.match(result.recommendation, /Long-Term Care Support/i);
});

test("medical matrix row 4: 20 or below cognitive, Katz 6", () => {
  const result = lookupMedicalInterpretationMatrix(20, 6);
  assert.equal(resolveMedicalMatrixCognitiveBand(20), "20-or-below");
  assert.equal(result.matrixInterpretation, "Early Cognitive Decline / Mild MCI");
  assert.equal(result.label, "MCI");
  assert.match(result.recommendation, /Neurological Diagnostic Panel/i);
});

test("medical matrix row 5: 20 or below cognitive, Katz 3-5", () => {
  const result = lookupMedicalInterpretationMatrix(15, 4);
  assert.equal(result.matrixInterpretation, "Cognitive Decline with Functional Deficits");
  assert.equal(result.label, "Moderate Dementia");
  assert.match(result.recommendation, /Geriatric Co-Management/i);
});

test("medical matrix row 6: 20 or below cognitive, Katz 2 or below", () => {
  const result = lookupMedicalInterpretationMatrix(8, 0);
  assert.equal(resolveMedicalMatrixKatzBand(0), "2-or-less");
  assert.equal(result.matrixInterpretation, "Advanced Neurodegenerative State");
  assert.equal(result.label, "Severe Dementia");
  assert.match(result.recommendation, /Comprehensive Care/i);
});

test("caregiver matrix row 1: low Mini-Cog, full Lawton (female)", () => {
  const result = lookupCaregiverInterpretationMatrix(5, { total: 8, maxScore: 8 });
  assert.equal(resolveMiniCogRiskBand(5), "low");
  assert.equal(resolveLawtonFunctionalBand({ total: 8, maxScore: 8 }), "full");
  assert.match(result.matrixInterpretation, /Low Risk/i);
  assert.match(result.referralGuidance, /Home Monitoring/i);
});

test("caregiver matrix row 2: low Mini-Cog, partial Lawton", () => {
  const result = lookupCaregiverInterpretationMatrix(4, { total: 5, maxScore: 8 });
  assert.equal(resolveLawtonFunctionalBand({ total: 5, maxScore: 8 }), "partial");
  assert.match(result.matrixInterpretation, /Isolated Functional Support Need/i);
  assert.match(result.referralGuidance, /Home Safety/i);
});

test("caregiver matrix row 3: low Mini-Cog, severe Lawton", () => {
  const result = lookupCaregiverInterpretationMatrix(3, { total: 2, maxScore: 8 });
  assert.equal(resolveLawtonFunctionalBand({ total: 2, maxScore: 8 }), "severe");
  assert.match(result.matrixInterpretation, /Severe Physical/i);
  assert.match(result.referralGuidance, /Primary Care Review/i);
});

test("caregiver matrix row 4: high Mini-Cog, full Lawton (male)", () => {
  const result = lookupCaregiverInterpretationMatrix(2, { total: 5, maxScore: 5 });
  assert.equal(resolveMiniCogRiskBand(2), "high");
  assert.match(result.matrixInterpretation, /Early Cognitive Risk/i);
  assert.match(result.referralGuidance, /Specialist Diagnostic Evaluation/i);
});

test("caregiver matrix row 5: high Mini-Cog, partial Lawton", () => {
  const result = lookupCaregiverInterpretationMatrix(1, { total: 2, maxScore: 5 });
  assert.match(result.matrixInterpretation, /Cognitive Decline with Daily Struggles/i);
  assert.match(result.referralGuidance, /Urgent Medical Workup/i);
});

test("caregiver matrix row 6: high Mini-Cog, severe Lawton", () => {
  const result = lookupCaregiverInterpretationMatrix(0, { total: 0, maxScore: 5 });
  assert.match(result.matrixInterpretation, /Advanced Cognitive/i);
  assert.match(result.referralGuidance, /Comprehensive Geriatric Care/i);
});

test("Mini-Cog recall counts only active word list", async () => {
  const { computeMiniCogScore, countActiveMiniCogRecall } = await import(
    "./family-scoring"
  );

  const score = computeMiniCogScore({
    wordListId: "version-a",
    clockDrawingScore: 2,
    recalledWords: {
      Banana: true,
      Sunrise: false,
      Chair: false,
      River: true,
      Market: true,
    },
  });

  assert.equal(countActiveMiniCogRecall({
    wordListId: "version-a",
    clockDrawingScore: 2,
    recalledWords: {
      Banana: true,
      Sunrise: false,
      Chair: false,
      River: true,
      Market: true,
    },
  }), 1);
  assert.equal(score, 3);
});

test("26+ normative hint is display-only and separate from matrix routing", async () => {
  const { isAdjustedMocaNormativeNormal } = await import("./medical-interpretation-matrix");
  const normalScore = 27;
  const borderlineScore = 23;
  
  assert.equal(isAdjustedMocaNormativeNormal(normalScore), true);
  assert.equal(isAdjustedMocaNormativeNormal(borderlineScore), false);
  
  // Both fall into the same "21-30" cognitive band for matrix routing
  const normalResult = lookupMedicalInterpretationMatrix(normalScore, 6);
  const borderlineResult = lookupMedicalInterpretationMatrix(borderlineScore, 6);
  
  assert.equal(normalResult.matrixInterpretation, "Healthy Aging");
  assert.equal(borderlineResult.matrixInterpretation, "Healthy Aging");
});

test("Lawton functional band resolves correctly based on gender-specific maxScore", () => {
  const femaleResult = lookupCaregiverInterpretationMatrix(5, { total: 8, maxScore: 8 });
  const maleResult = lookupCaregiverInterpretationMatrix(5, { total: 5, maxScore: 5 });
  
  assert.equal(femaleResult.matrixInterpretation.includes("Low Risk"), true);
  assert.equal(maleResult.matrixInterpretation.includes("Low Risk"), true);
});

test("Exact 6 medical matrix routing cases resolve correctly from lookupMedicalInterpretationMatrix", () => {
  // Case 1: Adjusted 30, Katz 6
  const res1 = lookupMedicalInterpretationMatrix(30, 6);
  assert.equal(res1.matrixInterpretation, "Healthy Aging");
  assert.equal(res1.label, "Normal");

  // Case 2: Adjusted 24, Katz 4
  const res2 = lookupMedicalInterpretationMatrix(24, 4);
  assert.equal(res2.matrixInterpretation, "Isolated Physical Deconditioning");
  assert.equal(res2.label, "Normal");

  // Case 3: Adjusted 23, Katz 1
  const res3 = lookupMedicalInterpretationMatrix(23, 1);
  assert.equal(res3.matrixInterpretation, "Severe Physical Disability");
  assert.equal(res3.label, "Normal");

  // Case 4: Adjusted 18, Katz 6
  const res4 = lookupMedicalInterpretationMatrix(18, 6);
  assert.equal(res4.matrixInterpretation, "Early Cognitive Decline / Mild MCI");
  assert.equal(res4.label, "MCI");

  // Case 5: Adjusted 10, Katz 4
  const res5 = lookupMedicalInterpretationMatrix(10, 4);
  assert.equal(res5.matrixInterpretation, "Cognitive Decline with Functional Deficits");
  assert.equal(res5.label, "Moderate Dementia");

  // Case 6: Adjusted 1, Katz 0
  const res6 = lookupMedicalInterpretationMatrix(1, 0);
  assert.equal(res6.matrixInterpretation, "Advanced Neurodegenerative State");
  assert.equal(res6.label, "Severe Dementia");
});

test("transformRecordToMedicalPayload recomputes legacy fallback records to correct matrix interpretation and actions", async () => {
  const { transformRecordToMedicalPayload } = await import("./medical-transformers");
  
  const legacyRecord: any = {
    recordId: "med_test_legacy",
    patientId: "CASE-LEGACY",
    caseNumber: "CASE-LEGACY",
    fullName: "Legacy Patient",
    age: 75,
    sexAssignedAtBirth: "female",
    yearsOfFormalEducation: "7-12",
    clinicianNameOrId: "DR-TEST",
    assessmentDate: new Date().toISOString(),
    moca: {
      rawTotal: 9,
      educationAdjustment: 1,
      adjustedTotal: 10,
      domainBreakdown: [],
    },
    katz: {
      total: 4,
      itemBreakdown: [],
    },
    interpretation: {
      diagnosticCategory: "Moderate Dementia",
      summary: "Old legacy summary.",
      recommendation: "Old legacy rec.",
    },
  };
  
  const payload = transformRecordToMedicalPayload(legacyRecord);
  
  assert.equal(payload.interpretation.matrixInterpretation, "Cognitive Decline with Functional Deficits");
  assert.match(payload.interpretation.referralAction, /Geriatric Co-Management/i);
  assert.match(payload.interpretation.recommendation, /Geriatric Co-Management/i);
});
