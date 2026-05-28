import {
  educationOptions,
  katzItems,
  mocaDomainDefinitions,
  type ClinicalInterpretation,
  type EducationYearsOption,
  type KatzFormValues,
  type MedicalAssessmentFormValues,
  type MedicalAssessmentPayload,
  type MedicalAssessmentTotals,
  type MocaDomainScore,
  type MocaFormValues,
} from "./medical-types";

const clampScore = (score: number, maxScore: number) => {
  if (Number.isNaN(score)) {
    return 0;
  }

  return Math.min(Math.max(score, 0), maxScore);
};

export function computeMocaDomainScores(moca: MocaFormValues): MocaDomainScore[] {
  return mocaDomainDefinitions.map((domain) => {
    const items = domain.items.map((item) => {
      const score = clampScore(moca[domain.id]?.items?.[item.id] ?? 0, item.maxScore);

      return {
        id: item.id,
        label: item.label,
        score,
        maxScore: item.maxScore,
      };
    });

    return {
      id: domain.id,
      title: domain.title,
      maxScore: domain.maxScore,
      score: clampScore(
        items.reduce((total, item) => total + item.score, 0),
        domain.maxScore,
      ),
      items,
    };
  });
}

export function computeRawMocaScore(moca: MocaFormValues): number {
  return computeMocaDomainScores(moca).reduce(
    (total, domain) => total + domain.score,
    0,
  );
}

export function computeEducationAdjustment(
  educationYears?: EducationYearsOption,
): number {
  const option = educationOptions.find((item) => item.value === educationYears);

  return option && option.yearsForAdjustment <= 12 ? 1 : 0;
}

export function computeAdjustedMocaScore(
  rawMocaTotal: number,
  educationAdjustment: number,
): number {
  return Math.min(rawMocaTotal + educationAdjustment, 30);
}

export function computeKatzScore(katz: KatzFormValues): number {
  return katzItems.reduce(
    (total, item) => total + (katz[item.id] === "independent" ? 1 : 0),
    0,
  );
}

export function computeClinicalInterpretation(
  adjustedMocaTotal: number,
  katzTotal: number,
): ClinicalInterpretation {
  if (adjustedMocaTotal >= 26 && katzTotal >= 5) {
    return {
      label: "Normal",
      recommendation:
        "Continue routine monitoring and provide education on brain health and follow-up if symptoms progress.",
      referralAction:
        "No urgent referral indicated from this scaffolded interpretation.",
    };
  }

  if (adjustedMocaTotal >= 18 && katzTotal >= 4) {
    return {
      label: "MCI",
      recommendation:
        "Recommend clinical review, collateral history, and follow-up cognitive assessment.",
      referralAction:
        "Consider referral to a physician or memory clinic based on clinical judgment.",
    };
  }

  if (adjustedMocaTotal >= 10 || katzTotal >= 2) {
    return {
      label: "Moderate Dementia",
      recommendation:
        "Recommend comprehensive medical evaluation and caregiver support planning.",
      referralAction:
        "Refer for formal diagnostic assessment and functional care planning.",
    };
  }

  return {
    label: "Severe Dementia",
    recommendation:
      "Recommend urgent comprehensive clinical review, safety planning, and caregiver support.",
    referralAction:
      "Refer to a specialist or appropriate clinical service for immediate follow-up.",
  };
}

export function computeMedicalAssessmentTotals(
  values: MedicalAssessmentFormValues,
): MedicalAssessmentTotals {
  const mocaDomainScores = computeMocaDomainScores(values.moca);
  const rawMocaTotal = mocaDomainScores.reduce(
    (total, domain) => total + domain.score,
    0,
  );
  const educationAdjustment = computeEducationAdjustment(
    values.demographics.educationYears,
  );
  const adjustedMocaTotal = computeAdjustedMocaScore(
    rawMocaTotal,
    educationAdjustment,
  );
  const katzTotal = computeKatzScore(values.katz);
  const interpretation = computeClinicalInterpretation(
    adjustedMocaTotal,
    katzTotal,
  );

  return {
    rawMocaTotal,
    educationAdjustment,
    adjustedMocaTotal,
    katzTotal,
    mocaDomainScores,
    interpretation,
  };
}

export function buildMedicalAssessmentPayload(
  values: MedicalAssessmentFormValues,
  assessmentDate: string,
): MedicalAssessmentPayload {
  const totals = computeMedicalAssessmentTotals(values);

  return {
    track: "medical-professional",
    demographics: values.demographics,
    moca: {
      domainBreakdown: totals.mocaDomainScores,
      rawTotal: totals.rawMocaTotal,
      educationAdjustment: totals.educationAdjustment,
      adjustedTotal: totals.adjustedMocaTotal,
    },
    katz: {
      responses: values.katz,
      total: totals.katzTotal,
    },
    interpretation: totals.interpretation,
    recommendation: totals.interpretation.recommendation,
    referralAction: totals.interpretation.referralAction,
    assessmentDate,
    clinicianIdentifier: values.demographics.clinicianNameOrId,
    transmissionTarget: "restricted-clinical-central-dashboard",
  };
}
