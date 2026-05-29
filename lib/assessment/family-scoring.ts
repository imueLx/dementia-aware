import { lookupCaregiverInterpretationMatrix } from "./caregiver-interpretation-matrix";
import {
  lawtonItems,
  miniCogWordLists,
  type CaregiverAssessmentTotals,
  type CaregiverResultPayload,
  type FamilyAssessmentFormValues,
  type LawtonFormValues,
  type LawtonItemId,
  type LawtonScoreResult,
  type PatientSex,
} from "./family-types";

export function countActiveMiniCogRecall(
  miniCog: FamilyAssessmentFormValues["miniCog"],
): number {
  const wordList =
    miniCogWordLists.find((list) => list.id === miniCog.wordListId) ??
    miniCogWordLists[0];

  return wordList.words.filter((word) => Boolean(miniCog.recalledWords[word]))
    .length;
}

export function computeMiniCogScore(
  miniCog: FamilyAssessmentFormValues["miniCog"],
): number {
  const recallTotal = countActiveMiniCogRecall(miniCog);
  return Math.min(recallTotal + Number(miniCog.clockDrawingScore), 5);
}

export function getLawtonScoredItems(patientSex: PatientSex): LawtonItemId[] {
  return lawtonItems
    .filter((item) => patientSex === "female" || item.countsForMaleScore)
    .map((item) => item.id);
}

export function getLawtonMaxScore(patientSex: PatientSex): 5 | 8 {
  return patientSex === "female" ? 8 : 5;
}

export function computeLawtonScore(
  lawton: LawtonFormValues,
  patientSex: PatientSex,
): LawtonScoreResult {
  const scoredItems = getLawtonScoredItems(patientSex);
  const total = scoredItems.reduce(
    (sum, itemId) => sum + (lawton[itemId] === "independent" ? 1 : 0),
    0,
  );

  return {
    total,
    maxScore: getLawtonMaxScore(patientSex),
    scoredItems,
    dependentItems: lawtonItems
      .filter((item) => lawton[item.id] === "dependent")
      .map((item) => item.id),
    independentItems: lawtonItems
      .filter((item) => lawton[item.id] === "independent")
      .map((item) => item.id),
  };
}

export function computeCaregiverInterpretation(
  miniCogTotal: number,
  lawton: LawtonScoreResult,
) {
  return lookupCaregiverInterpretationMatrix(miniCogTotal, lawton);
}

export function buildCaregiverSummary(
  lawton: LawtonFormValues,
  patientSex: PatientSex,
  labelOverrides?: Partial<Record<LawtonItemId, string>>,
): string[] {
  const scoredItems = getLawtonScoredItems(patientSex);

  return lawtonItems
    .filter((item) => lawton[item.id] === "dependent")
    .map((item) => {
      const scoreNote = scoredItems.includes(item.id)
        ? "included in score"
        : "not counted in male-adjusted score";
      const label = labelOverrides?.[item.id] ?? item.label;
      return `${label}: needs help, prompting, or supervision (${scoreNote}).`;
    });
}

export function computeFamilyAssessmentTotals(
  values: FamilyAssessmentFormValues,
): CaregiverAssessmentTotals {
  const miniCogTotal = computeMiniCogScore(values.miniCog);
  const lawton = computeLawtonScore(
    values.lawton,
    values.demographics.patientSex,
  );
  const interpretation = computeCaregiverInterpretation(miniCogTotal, lawton);

  return {
    miniCogTotal,
    miniCogMax: 5,
    lawton,
    interpretation,
  };
}

export function buildCaregiverResult(
  values: FamilyAssessmentFormValues,
  assessmentDate: string,
  labelOverrides?: Partial<Record<LawtonItemId, string>>,
): CaregiverResultPayload {
  const totals = computeFamilyAssessmentTotals(values);
  const wordList = miniCogWordLists.find(
    (list) => list.id === values.miniCog.wordListId,
  );
  const recalledWords = wordList
    ? wordList.words.reduce(
        (words, word) => {
          words[word] = Boolean(values.miniCog.recalledWords[word]);
          return words;
        },
        {} as Record<string, boolean>,
      )
    : values.miniCog.recalledWords;

  return {
    track: "family-caregiver",
    privacyMode: "on-screen-only",
    storageBehavior: "not-saved",
    dashboardTransmission: "never",
    demographics: values.demographics,
    miniCog: {
      wordListId: values.miniCog.wordListId,
      recalledWords,
      clockDrawingScore: values.miniCog.clockDrawingScore,
      total: totals.miniCogTotal,
      maxScore: 5,
    },
    lawton: {
      ...totals.lawton,
      responses: values.lawton,
    },
    interpretation: totals.interpretation,
    difficultySummary: buildCaregiverSummary(
      values.lawton,
      values.demographics.patientSex,
      labelOverrides,
    ),
    assessmentDate,
  };
}
