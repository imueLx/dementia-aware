"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DemographicForm } from "@/components/assessment/medical/demographic-form";
import { KatzSection } from "@/components/assessment/medical/katz-section";
import { MocaSection } from "@/components/assessment/medical/moca-section";
import { ScoreSummary } from "@/components/assessment/medical/score-summary";
import { SubmitBar } from "@/components/assessment/medical/submit-bar";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { useCopy } from "@/lib/i18n/use-copy";
import { computeMedicalAssessmentTotals } from "@/lib/assessment/medical-scoring";
import {
  medicalAssessmentSchema,
  type MedicalAssessmentSchemaValues,
} from "@/lib/assessment/medical-schema";
import {
  katzItems,
  mocaDomainDefinitions,
  type MedicalAssessmentFormValues,
} from "@/lib/assessment/medical-types";
import { submitMedicalAssessmentAction } from "./actions";

type PartialMedicalAssessmentValues = {
  demographics?: Partial<MedicalAssessmentSchemaValues["demographics"]>;
  moca?: Partial<MedicalAssessmentFormValues["moca"]>;
  katz?: Partial<MedicalAssessmentFormValues["katz"]>;
};

function createDefaultMocaValues() {
  return mocaDomainDefinitions.reduce(
    (domains, domain) => {
      domains[domain.id] = {
        items: domain.items.reduce(
          (items, item) => {
            items[item.id] = 0;
            return items;
          },
          {} as Record<string, number>,
        ),
      };

      return domains;
    },
    {} as MedicalAssessmentFormValues["moca"],
  );
}

function createDefaultKatzValues() {
  return katzItems.reduce(
    (items, item) => {
      items[item.id] = "dependent";
      return items;
    },
    {} as MedicalAssessmentFormValues["katz"],
  );
}

function normalizeForScoring(
  values: PartialMedicalAssessmentValues,
): MedicalAssessmentFormValues {
  const watchedMoca = values.moca as
    | Partial<MedicalAssessmentFormValues["moca"]>
    | undefined;
  const watchedKatz = values.katz as
    | Partial<MedicalAssessmentFormValues["katz"]>
    | undefined;

  return {
    demographics: {
      patientId: values.demographics?.patientId ?? "",
      fullName: values.demographics?.fullName ?? "",
      age: Number(values.demographics?.age) || 0,
      sexAtBirth: values.demographics?.sexAtBirth ?? "male",
      educationYears: values.demographics?.educationYears ?? "17-plus",
      clinicianNameOrId: values.demographics?.clinicianNameOrId ?? "",
    },
    moca: {
      ...createDefaultMocaValues(),
      ...watchedMoca,
    },
    katz: {
      ...createDefaultKatzValues(),
      ...watchedKatz,
    },
  };
}

function hasRequiredDemographics(values: PartialMedicalAssessmentValues) {
  return Boolean(
    values.demographics?.patientId &&
    values.demographics?.age &&
    values.demographics?.sexAtBirth &&
    values.demographics?.educationYears &&
    values.demographics?.clinicianNameOrId,
  );
}

export default function MedicalAssessmentPage() {
  const copy = useCopy("medical");
  const router = useRouter();
  const [assessmentDate] = useState(() => new Date().toISOString());
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<MedicalAssessmentSchemaValues>({
    resolver: zodResolver(medicalAssessmentSchema),
    mode: "onSubmit",
    defaultValues: {
      demographics: {
        patientId: "",
        fullName: "",
        clinicianNameOrId: "",
      },
      moca: createDefaultMocaValues(),
      katz: createDefaultKatzValues(),
    },
  });

  const watchedValues = useWatch({ control: methods.control });
  const partialWatchedValues = watchedValues as PartialMedicalAssessmentValues;

  const scoringValues = useMemo(
    () => normalizeForScoring(partialWatchedValues),
    [partialWatchedValues],
  );
  const totals = useMemo(
    () => computeMedicalAssessmentTotals(scoringValues),
    [scoringValues],
  );
  const isDemographicsComplete = hasRequiredDemographics(partialWatchedValues);

  const handleValidSubmit = async (values: MedicalAssessmentSchemaValues) => {
    setSubmitError(null);
    const result = await submitMedicalAssessmentAction(values, assessmentDate);

    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }

    router.push(`/assessment/medical/results?id=${result.recordId}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full border border-purple-200 bg-white px-4 text-sm font-bold text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
          >
            {copy.page.backHome}
          </Link>
          <LanguageToggle />
        </div>

        <header className="mt-8 rounded-[2rem] border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-purple-700">
            {copy.page.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            {copy.page.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
            {copy.page.intro}
          </p>
          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-4 text-sm font-semibold leading-6 text-purple-900">
            {copy.page.professionalNote}
          </div>
        </header>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleValidSubmit)}
            className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]"
          >
            <div className="grid gap-8">
              <DemographicForm copy={copy.demographics} />
              <MocaSection copy={copy.moca} />
              <KatzSection copy={copy.katz} />
              {submitError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
                  {submitError}
                </div>
              ) : null}
              <SubmitBar
                copy={copy.submit}
                isSubmitted={false}
                isSubmitting={methods.formState.isSubmitting}
              />
            </div>

            <ScoreSummary
              copy={copy.summary}
              totals={totals}
              assessmentDate={assessmentDate}
              isDemographicsComplete={isDemographicsComplete}
            />
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
