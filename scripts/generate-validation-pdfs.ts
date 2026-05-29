import fs from "node:fs";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { lookupMedicalInterpretationMatrix } from "../lib/assessment/medical-interpretation-matrix";
import { buildMedicalAssessmentPdf } from "../lib/assessment/medical-pdf-document";
import {
  buildPrintSections,
  buildDomainRows,
  buildKatzRows,
  buildClinicalRationale,
  buildRecommendationText,
} from "../lib/assessment/medical-report-utils";
import type { MedicalClinicalRecord } from "../lib/data/medical-record-store";
import { transformRecordToMedicalPayload } from "../lib/assessment/medical-transformers";
import { medicalResultsCopy } from "../constants/i18n/medical-results";

const PRINT_LABELS = {
  demographics: "Demographics",
  coreScores: "Core Scores",
  patientId: "Patient ID",
  fullName: "Full name",
  age: "Age",
  sexAtBirth: "Sex (at birth)",
  education: "Education",
  clinician: "Clinician",
  assessmentDate: "Assessment date",
  finalAdjustedMoca: "Adjusted MoCA-P",
  rawMoca: "Raw MoCA-P",
  educationAdjustment: "Education adjustment",
  katzScore: "Katz ADL",
  clinicalInterpretation: "Clinical interpretation",
} as const;

async function generatePdfForCase(
  recordId: string,
  patientName: string,
  adjustedMoca: number,
  katzTotal: number,
  fileName: string,
) {
  const matrix = lookupMedicalInterpretationMatrix(adjustedMoca, katzTotal);

  // Build a dummy record matching these scores
  const record: MedicalClinicalRecord = {
    recordId,
    patientId: recordId,
    caseNumber: recordId,
    fullName: patientName,
    age: 73,
    sexAssignedAtBirth: "female",
    yearsOfFormalEducation: "7-12",
    clinicianNameOrId: "DR-VALIDATION-01",
    assessmentDate: new Date().toISOString(),
    moca: {
      rawTotal: Math.max(adjustedMoca - 1, 0),
      educationAdjustment: Math.min(adjustedMoca, 1),
      adjustedTotal: adjustedMoca,
      domainBreakdown: [
        { id: "visuospatialExecutive", title: "Visuospatial / Executive", score: Math.min(adjustedMoca, 5), maxScore: 5, items: [] },
        { id: "naming", title: "Naming", score: Math.min(Math.max(adjustedMoca - 5, 0), 3), maxScore: 3, items: [] },
        { id: "attention", title: "Attention", score: Math.min(Math.max(adjustedMoca - 8, 0), 6), maxScore: 6, items: [] },
        { id: "language", title: "Language", score: Math.min(Math.max(adjustedMoca - 14, 0), 3), maxScore: 3, items: [] },
        { id: "abstraction", title: "Abstraction", score: Math.min(Math.max(adjustedMoca - 17, 0), 2), maxScore: 2, items: [] },
        { id: "delayedRecall", title: "Delayed Recall", score: Math.min(Math.max(adjustedMoca - 19, 0), 5), maxScore: 5, items: [] },
        { id: "orientation", title: "Orientation", score: Math.min(Math.max(adjustedMoca - 24, 0), 6), maxScore: 6, items: [] },
      ],
    },
    katz: {
      total: katzTotal,
      itemBreakdown: [
        { id: "bathing", label: "Bathing", response: katzTotal >= 1 ? "independent" : "dependent", score: katzTotal >= 1 ? 1 : 0 },
        { id: "dressing", label: "Dressing", response: katzTotal >= 2 ? "independent" : "dependent", score: katzTotal >= 2 ? 1 : 0 },
        { id: "toileting", label: "Toileting", response: katzTotal >= 3 ? "independent" : "dependent", score: katzTotal >= 3 ? 1 : 0 },
        { id: "transferring", label: "Transferring", response: katzTotal >= 4 ? "independent" : "dependent", score: katzTotal >= 4 ? 1 : 0 },
        { id: "continence", label: "Continence", response: katzTotal >= 5 ? "independent" : "dependent", score: katzTotal >= 5 ? 1 : 0 },
        { id: "feeding", label: "Feeding", response: katzTotal >= 6 ? "independent" : "dependent", score: katzTotal >= 6 ? 1 : 0 },
      ],
    },
    interpretation: {
      diagnosticCategory: matrix.label,
      matrixInterpretation: matrix.matrixInterpretation,
      summary: matrix.recommendation,
      recommendation: matrix.referralAction,
      referralAction: matrix.referralAction,
      dashboardCategory: matrix.label,
    },
    createdAt: new Date().toISOString(),
    source: "medical-professional",
  };

  const report = transformRecordToMedicalPayload(record);

  const sections = buildPrintSections(report, {
    labels: PRINT_LABELS,
    sexLabels: { male: "Male", female: "Female" },
    educationLabels: {},
    notProvidedLabel: "Not provided",
    locale: "en",
  });

  const domains = buildDomainRows(report);
  const katzRows = buildKatzRows(report);
  const rationale = buildClinicalRationale(report, {
    domainLabels: {},
    rationale: {
      adjustedPrefix: "Adjusted score",
      withConnector: "with",
      functionalNormal: "functional status within expected",
      functionalConcern: "functional concerns noted",
      domainFlagged: "Flagged domains",
      domainNone: "No domains flagged",
    },
  });
  const recommendation = buildRecommendationText(report);
  const resultsEn = medicalResultsCopy.en;

  const pdfBytes = await buildMedicalAssessmentPdf({
    recordId: record.recordId,
    report,
    sections,
    domains,
    katzRows,
    rationale,
    recommendation,
    logoPngBytes: await readFile(
      path.join(process.cwd(), "public", "dementia-aware-logo.png"),
    ),
    headerTitle: resultsEn.print.title,
    headerSubtitle: resultsEn.print.subtitle,
    preparedForNote: resultsEn.print.preparedFor,
    disclaimer: resultsEn.print.generatedNote,
  });

  const outputPath = path.join(process.cwd(), fileName);
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Successfully generated PDF for ${recordId}: ${outputPath}`);
  console.log(`- Adjusted MoCA: ${adjustedMoca}`);
  console.log(`- Katz ADL: ${katzTotal}/6`);
  console.log(`- matrixInterpretation: "${matrix.matrixInterpretation}"`);
  console.log(`- dashboardCategory: "${matrix.label}"`);
  console.log(`- Action/Referral: "${matrix.referralAction.slice(0, 80)}..."`);
  console.log("------------------------------------------------------------------");
}

async function run() {
  console.log("Generating Validation PDFs...\n");

  // Case 1: Healthy Aging
  await generatePdfForCase(
    "med_validation_001",
    "Alice Johnson",
    30,
    6,
    "healthy_aging.pdf",
  );

  // Case 2: Cognitive Decline with Functional Deficits
  await generatePdfForCase(
    "med_validation_002",
    "Bob Smith",
    10,
    4,
    "cognitive_decline_functional.pdf",
  );

  // Case 3: Advanced Neurodegenerative State
  await generatePdfForCase(
    "med_validation_003",
    "Carol White",
    1,
    0,
    "advanced_neurodegenerative.pdf",
  );

  console.log("All validation PDFs generated successfully!");
}

run().catch(console.error);
