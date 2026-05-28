import {
  educationOptions,
  katzItems,
  type ClinicalInterpretationLabel,
  type EducationYearsOption,
  type KatzResponse,
  type MedicalAssessmentPayload,
  type SexAtBirth,
} from "./medical-types";
import type {
  DomainBreakdownRow,
  KatzResultRow,
  MedicalReportPayload,
  PrintReportSection,
} from "./medical-report-types";

export function formatAssessmentDateWithLocale(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatSexAtBirth(
  value: SexAtBirth,
  labels: { male: string; female: string },
) {
  return value === "male" ? labels.male : labels.female;
}

export function formatEducationYears(
  value: EducationYearsOption,
  labels: Partial<Record<EducationYearsOption, string>>,
) {
  return labels[value] ?? value;
}

export function formatKatzResponse(
  value: KatzResponse,
  labels: { independent: string; dependent: string },
) {
  return value === "independent" ? labels.independent : labels.dependent;
}

export function getDomainStatus(
  score: number,
  maxScore: number,
): DomainBreakdownRow["status"] {
  const percent = maxScore === 0 ? 0 : score / maxScore;

  if (percent >= 0.8) {
    return "withinExpected";
  }

  if (percent >= 0.5) {
    return "monitor";
  }

  return "concern";
}

export function buildDomainRows(
  report: MedicalReportPayload,
): DomainBreakdownRow[] {
  return report.moca.domainBreakdown.map((domain) => ({
    id: domain.id,
    title: domain.title,
    score: domain.score,
    maxScore: domain.maxScore,
    percent:
      domain.maxScore === 0
        ? 0
        : Math.round((domain.score / domain.maxScore) * 100),
    status: getDomainStatus(domain.score, domain.maxScore),
  }));
}

export function buildKatzRows(report: MedicalReportPayload): KatzResultRow[] {
  return katzItems.map((item) => {
    const response = report.katz.responses[item.id];

    return {
      id: item.id,
      label: item.label,
      response,
      score: response === "independent" ? 1 : 0,
    };
  });
}

export function getInterpretationTone(label: ClinicalInterpretationLabel) {
  if (label === "Normal") {
    return "green";
  }

  if (label === "MCI") {
    return "amber";
  }

  return "purple";
}

export function buildClinicalRationale(
  report: MedicalReportPayload,
  options: {
    domainLabels: Partial<Record<MocaDomainScore["id"], string>>;
    rationale: {
      adjustedPrefix: string;
      withConnector: string;
      functionalNormal: string;
      functionalConcern: string;
      domainFlagged: string;
      domainNone: string;
    };
  },
) {
  const flaggedDomains = buildDomainRows(report)
    .filter((domain) => domain.status !== "withinExpected")
    .map((domain) => options.domainLabels[domain.id] ?? domain.title);

  const functionalNote =
    report.katz.total >= 5
      ? options.rationale.functionalNormal
      : options.rationale.functionalConcern;

  const domainNote =
    flaggedDomains.length > 0
      ? `${options.rationale.domainFlagged}: ${flaggedDomains.join(", ")}.`
      : options.rationale.domainNone;

  return `${options.rationale.adjustedPrefix} ${report.moca.adjustedTotal}/30 ${options.rationale.withConnector} ${functionalNote} ${domainNote}`;
}

export function buildRecommendationText(
  report: MedicalReportPayload,
  recommendations: Partial<Record<ClinicalInterpretationLabel, string>>,
) {
  return recommendations[report.interpretation.label] ?? report.recommendation;
}

export function buildPrintSections(
  report: MedicalReportPayload,
  options: {
    labels: {
      demographics: string;
      coreScores: string;
      patientId: string;
      fullName: string;
      age: string;
      sexAtBirth: string;
      education: string;
      clinician: string;
      assessmentDate: string;
      finalAdjustedMoca: string;
      rawMoca: string;
      educationAdjustment: string;
      katzScore: string;
      clinicalInterpretation: string;
    };
    sexLabels: { male: string; female: string };
    educationLabels: Partial<Record<EducationYearsOption, string>>;
    notProvidedLabel: string;
    locale: string;
  },
): PrintReportSection[] {
  return [
    {
      title: options.labels.demographics,
      rows: [
        {
          label: options.labels.patientId,
          value: report.demographics.patientId,
        },
        {
          label: options.labels.fullName,
          value: report.demographics.fullName || options.notProvidedLabel,
        },
        { label: options.labels.age, value: String(report.demographics.age) },
        {
          label: options.labels.sexAtBirth,
          value: formatSexAtBirth(
            report.demographics.sexAtBirth,
            options.sexLabels,
          ),
        },
        {
          label: options.labels.education,
          value: formatEducationYears(
            report.demographics.educationYears,
            options.educationLabels,
          ),
        },
        { label: options.labels.clinician, value: report.clinicianIdentifier },
        {
          label: options.labels.assessmentDate,
          value: formatAssessmentDateWithLocale(
            report.assessmentDate,
            options.locale,
          ),
        },
      ],
    },
    {
      title: options.labels.coreScores,
      rows: [
        {
          label: options.labels.finalAdjustedMoca,
          value: `${report.moca.adjustedTotal}/30`,
        },
        {
          label: options.labels.rawMoca,
          value: `${report.moca.rawTotal}/30`,
        },
        {
          label: options.labels.educationAdjustment,
          value: `+${report.moca.educationAdjustment}`,
        },
        { label: options.labels.katzScore, value: `${report.katz.total}/6` },
        {
          label: options.labels.clinicalInterpretation,
          value: report.interpretation.label,
        },
      ],
    },
  ];
}

export function createMockMedicalReport(): MedicalAssessmentPayload {
  const assessmentDate = new Date().toISOString();

  return {
    track: "medical-professional",
    demographics: {
      patientId: "CASE-2026-001",
      fullName: "Sample Patient",
      age: 72,
      sexAtBirth: "female",
      educationYears: "7-12",
      clinicianNameOrId: "DR-SAMPLE-01",
    },
    moca: {
      rawTotal: 20,
      educationAdjustment: 1,
      adjustedTotal: 21,
      domainBreakdown: [
        {
          id: "visuospatialExecutive",
          title: "Visuospatial / Executive",
          score: 3,
          maxScore: 5,
          items: [],
        },
        { id: "naming", title: "Naming", score: 3, maxScore: 3, items: [] },
        {
          id: "attention",
          title: "Attention",
          score: 4,
          maxScore: 6,
          items: [],
        },
        { id: "language", title: "Language", score: 2, maxScore: 3, items: [] },
        {
          id: "abstraction",
          title: "Abstraction",
          score: 1,
          maxScore: 2,
          items: [],
        },
        {
          id: "delayedRecall",
          title: "Delayed Recall",
          score: 2,
          maxScore: 5,
          items: [],
        },
        {
          id: "orientation",
          title: "Orientation",
          score: 5,
          maxScore: 6,
          items: [],
        },
      ],
    },
    katz: {
      total: 5,
      responses: {
        bathing: "independent",
        dressing: "independent",
        toileting: "independent",
        transferring: "independent",
        continence: "dependent",
        feeding: "independent",
      },
    },
    interpretation: {
      label: "MCI",
      recommendation:
        "Recommend clinical review, collateral history, and follow-up cognitive assessment.",
      referralAction:
        "Consider referral to a physician or memory clinic based on clinical judgment.",
    },
    recommendation:
      "Recommend clinical review, collateral history, and follow-up cognitive assessment.",
    referralAction:
      "Consider referral to a physician or memory clinic based on clinical judgment.",
    assessmentDate,
    clinicianIdentifier: "DR-SAMPLE-01",
    transmissionTarget: "restricted-clinical-central-dashboard",
  };
}
