import { getMedicalRecordById } from "@/lib/data/medical-record-repository";
import { transformRecordToMedicalPayload } from "@/lib/assessment/medical-transformers";
import { medicalCopy } from "@/constants/i18n/medical";
import { medicalResultsCopy } from "@/constants/i18n/medical-results";
import path from "node:path";
import { readFile } from "node:fs/promises";
import {
  buildPrintSections,
  buildDomainRows,
  buildKatzRows,
  buildClinicalRationale,
  buildRecommendationText,
} from "@/lib/assessment/medical-report-utils";
import { buildMedicalAssessmentPdf } from "@/lib/assessment/medical-pdf-document";
import { getClinicianSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ recordId: string }> },
) {
  try {
    const { recordId } = await params;
    const requestUrl = new URL(req.url);
    const ts = requestUrl.searchParams.get("ts") ?? "";

    if (!recordId) {
      return new Response("Missing record id", { status: 400 });
    }

    if (!(await getClinicianSession())) {
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

    const medicalEn = medicalCopy.en;
    const resultsEn = medicalResultsCopy.en;

    const sections = buildPrintSections(report, {
      labels: {
        demographics: resultsEn.printSections.demographics,
        coreScores: resultsEn.printSections.coreScores,
        patientId: resultsEn.overview.patientId,
        fullName: resultsEn.overview.fullName,
        age: resultsEn.overview.age,
        sexAtBirth: resultsEn.overview.sexAtBirth,
        education: resultsEn.overview.education,
        clinician: resultsEn.overview.clinician,
        assessmentDate: resultsEn.overview.assessmentDate,
        finalAdjustedMoca: resultsEn.printSections.finalAdjustedMoca,
        rawMoca: resultsEn.printSections.rawMoca,
        educationAdjustment: resultsEn.printSections.educationAdjustment,
        katzScore: resultsEn.printSections.katzScore,
        clinicalInterpretation: resultsEn.printSections.clinicalInterpretation,
      },
      sexLabels: { male: medicalEn.demographics.male, female: medicalEn.demographics.female },
      educationLabels: medicalEn.demographics.educationOptions,
      notProvidedLabel: resultsEn.overview.notProvided,
      locale: "en",
    });

    const domains = buildDomainRows(report);
    const katzRows = buildKatzRows(report);
    const rationale = buildClinicalRationale(report, {
      domainLabels: medicalEn.moca.domains,
      rationale: resultsEn.rationale,
    });
    const recommendation = buildRecommendationText(report);
    const logoPngBytes = await readFile(
      path.join(process.cwd(), "public", "dementia-aware-logo.png"),
    );

    const filenameTs = ts && /^[0-9]+$/.test(ts) ? ts : String(Date.now());
    const filename = `report-${record.recordId}-${filenameTs}.pdf`;


    const pdfBytes = await buildMedicalAssessmentPdf({
      recordId: record.recordId,
      report,
      sections,
      domains,
      katzRows,
      rationale,
      recommendation,
      logoPngBytes,
      headerTitle: resultsEn.print.title,
      headerSubtitle: resultsEn.print.subtitle,
      preparedForNote: resultsEn.print.preparedFor,
      disclaimer: resultsEn.print.generatedNote,
    });

    const pdf = Buffer.from(pdfBytes);

    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=\"${filename}\"`,
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
