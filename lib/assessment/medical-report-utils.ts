import { lookupMedicalInterpretationMatrix } from "./medical-interpretation-matrix";
import {
  katzItems,
  type ClinicalInterpretationLabel,
  type EducationYearsOption,
  type KatzResponse,
  type MedicalAssessmentPayload,
  type SexAtBirth,
  type MocaDomainScore,
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

/** Stored matrix action text — single source for UI and PDF (no i18n override). */
export function buildRecommendationText(report: MedicalReportPayload) {
  return report.recommendation;
}

export function buildReferralActionText(report: MedicalReportPayload) {
  return report.referralAction;
}

export function buildMatrixInterpretationText(report: MedicalReportPayload) {
  return report.interpretation.matrixInterpretation;
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
  // Use the guideline-mandated field labels for the clinical PDF (medical-professional track).
  return [
    {
      title: options.labels.demographics,
      rows: [
        {
          label: "Patient ID / Case Number",
          value: report.demographics.patientId,
        },
        {
          label: "Full Name",
          value: report.demographics.fullName || options.notProvidedLabel,
        },
        { label: "Age", value: String(report.demographics.age) },
        {
          label: "Sex assigned at birth",
          value: formatSexAtBirth(
            report.demographics.sexAtBirth,
            options.sexLabels,
          ),
        },
        {
          label: "Years of Formal Education",
          value: formatEducationYears(
            report.demographics.educationYears,
            options.educationLabels,
          ),
        },
        { label: "Clinician Name / ID", value: report.clinicianIdentifier },
        {
          label: "Assessment Date",
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
          label: "Final Adjusted MoCA-P Score",
          value: `${report.moca.adjustedTotal}/30`,
        },
        { label: "Raw MoCA-P Score", value: `${report.moca.rawTotal}/30` },
        {
          label: "Education Adjustment",
          value: `+${report.moca.educationAdjustment}`,
        },
        { label: "Katz ADL Score", value: `${report.katz.total}/6` },
        { label: "Exact Classification", value: report.interpretation.label },
        {
          label: "Overall Clinical Interpretation",
          value: report.interpretation.matrixInterpretation,
        },
      ],
    },
  ];
}

/**
 * Validate and normalize a MedicalReportPayload to ensure PDF output consistency.
 * - Recompute domain and katz totals if mismatched
 * - Clamp adjusted MoCA to 0..30
 * - Refresh interpretation/recommendation from the canonical matrix
 */
export function validateAndNormalizeMedicalReport(
  report: MedicalReportPayload,
): MedicalReportPayload {
  // Clone shallow copy to avoid mutating original
  const out = JSON.parse(JSON.stringify(report)) as MedicalReportPayload;

  // Recompute raw moca from domain breakdown if present
  if (out.moca?.domainBreakdown && Array.isArray(out.moca.domainBreakdown)) {
    const domainSum = out.moca.domainBreakdown.reduce(
      (s, d) => s + Number(d.score || 0),
      0,
    );
    if (Number(out.moca.rawTotal) !== domainSum) {
      out.moca.rawTotal = domainSum;
    }
  }

  // Ensure education adjustment is numeric
  out.moca.educationAdjustment = Number(out.moca.educationAdjustment) || 0;

  // Compute adjusted total and clamp
  out.moca.adjustedTotal = Math.min(
    30,
    Math.max(
      0,
      Number(out.moca.adjustedTotal) ||
        Number(out.moca.rawTotal) + out.moca.educationAdjustment,
    ),
  );

  // Recompute katz total from responses
  if (out.katz && out.katz.responses) {
    const katzSum = Object.values(out.katz.responses).reduce(
      (s, r) => s + (r === "independent" ? 1 : 0),
      0,
    );
    if (Number(out.katz.total) !== katzSum) {
      out.katz.total = katzSum;
    }
  }

  // Refresh interpretation via canonical matrix lookup to ensure recommendation matches
  try {
    const interp = lookupMedicalInterpretationMatrix(
      out.moca.adjustedTotal,
      out.katz.total,
    );
    out.interpretation = interp;
    out.recommendation = interp.recommendation;
    out.referralAction = interp.referralAction;
  } catch (e) {
    // If lookup fails, leave as-is but ensure fields exist
    out.interpretation = out.interpretation || {
      label: "Normal",
      matrixInterpretation: "Healthy Aging",
      recommendation: "Routine Monitoring",
      referralAction: "",
    };
    out.recommendation =
      out.recommendation || out.interpretation.recommendation;
    out.referralAction =
      out.referralAction || out.interpretation.referralAction;
  }

  return out;
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
    ...(() => {
      const interpretation = lookupMedicalInterpretationMatrix(21, 5);
      return {
        interpretation,
        recommendation: interpretation.recommendation,
        referralAction: interpretation.referralAction,
      };
    })(),
    assessmentDate,
    clinicianIdentifier: "DR-SAMPLE-01",
    transmissionTarget: "restricted-clinical-central-dashboard",
  };
}
