"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DemographicForm } from "@/components/assessment/family/demographic-form";
import { LawtonSection } from "@/components/assessment/family/lawton-section";
import { MiniCogSection } from "@/components/assessment/family/minicog-section";
import { ResultPanel } from "@/components/assessment/family/result-panel";
import { ScoreSummary } from "@/components/assessment/family/score-summary";
import { SubmitBar } from "@/components/assessment/family/submit-bar";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { useCopy } from "@/lib/i18n/use-copy";
import type { CaregiverCopy } from "@/constants/i18n/caregiver";
import {
  buildCaregiverResult,
  computeFamilyAssessmentTotals,
} from "@/lib/assessment/family-scoring";
import {
  familyAssessmentSchema,
  type FamilyAssessmentSchemaValues,
} from "@/lib/assessment/family-schema";
import {
  lawtonItems,
  miniCogWordLists,
  type CaregiverResultPayload,
  type FamilyAssessmentFormValues,
} from "@/lib/assessment/family-types";

type PartialFamilyAssessmentValues = {
  demographics?: Partial<FamilyAssessmentSchemaValues["demographics"]>;
  miniCog?: Partial<FamilyAssessmentFormValues["miniCog"]>;
  lawton?: Partial<FamilyAssessmentFormValues["lawton"]>;
};

function createDefaultRecallValues() {
  return miniCogWordLists.reduce(
    (words, wordList) => {
      wordList.words.forEach((word) => {
        words[word] = false;
      });
      return words;
    },
    {} as Record<string, boolean>,
  );
}

function createDefaultLawtonValues() {
  return lawtonItems.reduce(
    (items, item) => {
      items[item.id] = "dependent";
      return items;
    },
    {} as FamilyAssessmentFormValues["lawton"],
  );
}

function normalizeForScoring(
  values: PartialFamilyAssessmentValues,
): FamilyAssessmentFormValues {
  return {
    demographics: {
      patientInitialOrNickname:
        values.demographics?.patientInitialOrNickname ?? "",
      patientAge: Number(values.demographics?.patientAge) || 0,
      patientSex: values.demographics?.patientSex ?? "female",
      relationshipToPatient:
        values.demographics?.relationshipToPatient ?? "other",
    },
    miniCog: {
      wordListId: values.miniCog?.wordListId ?? "version-a",
      clockDrawingScore: values.miniCog?.clockDrawingScore ?? 0,
      recalledWords: {
        ...createDefaultRecallValues(),
        ...values.miniCog?.recalledWords,
      },
    },
    lawton: {
      ...createDefaultLawtonValues(),
      ...values.lawton,
    },
  };
}

function hasRequiredDemographics(values: PartialFamilyAssessmentValues) {
  return Boolean(
    values.demographics?.patientInitialOrNickname &&
    values.demographics?.patientAge &&
    values.demographics?.patientSex &&
    values.demographics?.relationshipToPatient,
  );
}

export default function FamilyAssessmentPage() {
  const copy = useCopy("caregiver") as CaregiverCopy;
  const [assessmentDate] = useState(() => new Date().toISOString());
  const [result, setResult] = useState<CaregiverResultPayload | null>(null);

  const methods = useForm<FamilyAssessmentSchemaValues>({
    resolver: zodResolver(familyAssessmentSchema),
    mode: "onSubmit",
    defaultValues: {
      demographics: {
        patientInitialOrNickname: "",
      },
      miniCog: {
        wordListId: "version-a",
        clockDrawingScore: 0,
        recalledWords: createDefaultRecallValues(),
      },
      lawton: createDefaultLawtonValues(),
    },
  });

  const watchedValues = useWatch({ control: methods.control });
  const partialWatchedValues = watchedValues as PartialFamilyAssessmentValues;

  const scoringValues = useMemo(
    () => normalizeForScoring(partialWatchedValues),
    [partialWatchedValues],
  );
  const totals = useMemo(
    () => computeFamilyAssessmentTotals(scoringValues),
    [scoringValues],
  );
  const isDemographicsComplete = hasRequiredDemographics(partialWatchedValues);

  const handleValidSubmit = (values: FamilyAssessmentSchemaValues) => {
    const payload = buildCaregiverResult(
      values,
      assessmentDate,
      copy.lawton.items,
    );
    setResult(payload);
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
          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-4">
            <h2 className="text-base font-bold text-purple-950">
              {copy.page.privacyTitle}
            </h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-purple-900">
              {copy.page.privacyNotice}
            </p>
          </div>
        </header>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleValidSubmit)}
            className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]"
          >
            <div className="grid gap-8">
              <DemographicForm copy={copy.demographics} />
              <MiniCogSection copy={copy.miniCog} />
              <LawtonSection copy={copy.lawton} />
              <SubmitBar
                copy={copy.submit}
                hasViewedResults={Boolean(result)}
                isSubmitting={methods.formState.isSubmitting}
              />
              <ResultPanel copy={copy.result} result={result} />
            </div>

            <ScoreSummary
              copy={copy.summary}
              totals={totals}
              isDemographicsComplete={isDemographicsComplete}
            />
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
