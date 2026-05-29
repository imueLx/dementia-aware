import { NextResponse } from "next/server";
import { submitMedicalAssessment } from "@/lib/assessment/medical-submit";

export async function POST(_: Request) {
  if (String(process.env.ENABLE_DEV_ROUTES ?? "false") !== "true") {
    return new Response(null, { status: 404 });
  }
  const { getClinicianSession } = await import("@/lib/auth/session");
  if (!(await getClinicianSession())) {
    return new Response(null, { status: 401 });
  }
  const assessmentDate = new Date().toISOString();

  const values = {
    demographics: {
      patientId: "dev-sample-001",
      fullName: "Dev Sample",
      age: 68,
      sexAtBirth: "male",
      educationYears: "13-16",
      clinicianNameOrId: "dev-api",
    },
    moca: {
      visuospatialExecutive: {
        items: { trailMaking: 1, cubeCopy: 1, clockDrawing: 3 },
      },
      naming: { items: { animalOne: 1, animalTwo: 1, animalThree: 1 } },
      attention: {
        items: {
          forwardDigitSpan: 1,
          backwardDigitSpan: 1,
          vigilanceLetterTapping: 1,
          serialSubtraction: 3,
        },
      },
      language: { items: { sentenceRepetition: 2, verbalFluency: 1 } },
      abstraction: { items: { abstractionPairOne: 1, abstractionPairTwo: 1 } },
      delayedRecall: { items: { wordRecall: 5 } },
      orientation: {
        items: { date: 1, month: 1, year: 1, day: 1, place: 1, city: 1 },
      },
    },
    katz: {
      bathing: "independent",
      dressing: "independent",
      toileting: "independent",
      transferring: "independent",
      continence: "independent",
      feeding: "independent",
    },
  } as any;

  try {
    const result = await submitMedicalAssessment(values, assessmentDate);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: String(err?.message ?? err) },
      { status: 500 },
    );
  }
}
