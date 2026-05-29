import { getMedicalRecordById } from "@/lib/data/medical-record-repository";
import { transformRecordToMedicalPayload } from "@/lib/assessment/medical-transformers";
import {
  buildPrintSections,
  buildDomainRows,
  buildKatzRows,
  buildClinicalRationale,
  buildRecommendationText,
} from "@/lib/assessment/medical-report-utils";
import { buildMedicalAssessmentPdf } from "@/lib/assessment/medical-pdf-document";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";

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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ recordId: string }> },
) {
  try {
    const { recordId } = await params;

    if (!recordId) {
      return new Response("Missing record id", { status: 400 });
    }

    const session = await getServerSession(authOptions as any);
    if (!session || (session.user as any)?.role !== "clinician") {
      return new Response("Unauthorized", { status: 401 });
    }

    const record = await getMedicalRecordById(recordId);

    if (!record) {
      return new Response("Not found", { status: 404 });
    }

    if (record.source !== "medical-professional") {
      return new Response("Not allowed", { status: 403 });
    }

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

    const pdfBytes = await buildMedicalAssessmentPdf({
      recordId: record.recordId,
      report,
      sections,
      domains,
      katzRows,
      rationale,
      recommendation,
    });

    const pdf = Buffer.from(pdfBytes);

    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-${record.recordId}.pdf"`,
      },
    });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
