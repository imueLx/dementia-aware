import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import { getMedicalRecordById } from "@/lib/data/medical-record-repository";
import { transformRecordToMedicalPayload } from "@/lib/assessment/medical-transformers";
import {
  buildPrintSections,
  buildDomainRows,
  buildKatzRows,
  buildClinicalRationale,
  buildRecommendationText,
  formatAssessmentDateWithLocale,
} from "@/lib/assessment/medical-report-utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";

export async function GET(
  _req: Request,
  { params }: { params: { recordId: string } },
) {
  try {
    const { recordId } = params;

    if (!recordId) {
      return new Response("Missing record id", { status: 400 });
    }

    // Ensure the caller is authenticated and has clinician role
    const session = await getServerSession(authOptions as any);
    if (!session || (session.user as any)?.role !== "clinician") {
      return new Response("Unauthorized", { status: 401 });
    }

    const record = await getMedicalRecordById(recordId);

    if (!record) {
      return new Response("Not found", { status: 404 });
    }

    // Only allow medical-professional records (repository already enforces this)
    if (record.source !== "medical-professional") {
      return new Response("Not allowed", { status: 403 });
    }

    const report = transformRecordToMedicalPayload(record);

    // Build printable content
    const sections = buildPrintSections(report, {
      labels: {
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
      },
      sexLabels: { male: "Male", female: "Female" },
      educationLabels: {},
      notProvidedLabel: "Not provided",
      locale: "en",
    });

    const domains = buildDomainRows(report as any);
    const katzRows = buildKatzRows(report as any);
    const rationale = buildClinicalRationale(report as any, {
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
    const recommendation = buildRecommendationText(report as any, {});

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = new PassThrough();
    doc.pipe(stream);

    // Header
    doc.fontSize(18).text("DementiAware", { align: "left" });
    doc.moveDown(0.5);
    doc.fontSize(16).text("Clinical Assessment Report", { align: "left" });
    doc.moveDown(1);

    // Demographics
    doc.fontSize(12).text("Patient Demographics", { underline: true });
    sections[0].rows.forEach((row) => {
      doc.moveDown(0.25);
      doc.fontSize(10).text(`${row.label}: ${row.value}`);
    });

    doc.moveDown(0.8);

    // Core scores
    doc.fontSize(12).text("Core Scores", { underline: true });
    sections[1].rows.forEach((row) => {
      doc.moveDown(0.25);
      doc.fontSize(10).text(`${row.label}: ${row.value}`);
    });

    doc.moveDown(0.8);

    // Domain breakdown
    doc.fontSize(12).text("MoCA-P Domain Breakdown", { underline: true });
    domains.forEach((d) => {
      doc.moveDown(0.25);
      doc
        .fontSize(10)
        .text(`${d.title}: ${d.score}/${d.maxScore} (${d.status})`);
    });

    doc.moveDown(0.8);

    // Katz breakdown
    doc.fontSize(12).text("Katz ADL Breakdown", { underline: true });
    katzRows.forEach((k) => {
      doc.moveDown(0.25);
      doc.fontSize(10).text(`${k.label}: ${k.response} (${k.score})`);
    });

    doc.moveDown(0.8);

    // Interpretation and recommendation
    doc.fontSize(12).text("Clinical Interpretation", { underline: true });
    doc.moveDown(0.25);
    doc.fontSize(10).text(report.interpretation.label || "");
    doc.moveDown(0.5);
    doc.fontSize(10).text(String(rationale));
    doc.moveDown(0.5);
    doc.fontSize(10).text("Recommendation:");
    doc.moveDown(0.25);
    doc.fontSize(10).text(String(recommendation));

    doc.moveDown(1);
    doc
      .fontSize(9)
      .text(
        `Assessment date: ${formatAssessmentDateWithLocale(report.assessmentDate, "en")}`,
      );

    doc.end();

    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }

    const pdf = Buffer.concat(chunks);

    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-${record.recordId}.pdf"`,
      },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
