import {
  lawtonItems,
  miniCogWordLists,
  type CaregiverAssessmentTotals,
  type CaregiverInterpretation,
  type CaregiverResultPayload,
  type FamilyAssessmentFormValues,
  type LawtonFormValues,
  type LawtonItemId,
  type LawtonScoreResult,
  type PatientSex,
} from "./family-types";

export function computeMiniCogScore(
  miniCog: FamilyAssessmentFormValues["miniCog"],
): number {
  const recallTotal = Object.values(miniCog.recalledWords).filter(
    Boolean,
  ).length;
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
): CaregiverInterpretation {
  const lawtonConcern = lawton.total <= Math.max(lawton.maxScore - 2, 0);

  if (miniCogTotal <= 2 || lawtonConcern) {
    return {
      label: "Further medical evaluation recommended",
      filipinoLabel: "Kinakailangan ng karagdagang pagsusuri ng doktor",
      referralGuidance:
        "Schedule an appointment with a Neurologist or Geriatrician. Take a screenshot or print this page to show them.",
      plainLanguageSummary:
        "The screening suggests it would be wise to discuss these results with a doctor, especially if changes are new or affecting daily life.",
    };
  }

  return {
    label: "Low risk of cognitive impairment",
    filipinoLabel: "Mababang panganib sa pagkaulianin",
    referralGuidance:
      "Continue observing. Retake after a few weeks if concerns continue, worsen, or new symptoms appear.",
    plainLanguageSummary:
      "The current screening pattern suggests lower risk, but family observations still matter. Seek medical advice if concerns persist.",
  };
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
