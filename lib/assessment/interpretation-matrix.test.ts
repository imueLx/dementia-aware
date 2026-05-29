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
