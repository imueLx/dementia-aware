"use client";

import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { CaregiverCopy } from "@/constants/i18n/caregiver";
import {
  miniCogWordLists,
  type ClockDrawingScore,
  type MiniCogWordListId,
} from "@/lib/assessment/family-types";
import type { FamilyAssessmentSchemaValues } from "@/lib/assessment/family-schema";

type MiniCogSectionProps = {
  copy: CaregiverCopy["miniCog"];
};

export function MiniCogSection({ copy }: MiniCogSectionProps) {
  const { register, setValue } = useFormContext<FamilyAssessmentSchemaValues>();
  const selectedWordListId = useWatch<
    FamilyAssessmentSchemaValues,
    "miniCog.wordListId"
  >({
    name: "miniCog.wordListId",
  });

  const selectedWordList = useMemo(
    () =>
      miniCogWordLists.find((list) => list.id === selectedWordListId) ??
      miniCogWordLists[0],
    [selectedWordListId],
  );
  const displayWordList = copy.wordLists?.[selectedWordList.id];

  const handleWordListChange = (wordListId: MiniCogWordListId) => {
    setValue("miniCog.wordListId", wordListId, { shouldDirty: true });
    const wordList = miniCogWordLists.find((list) => list.id === wordListId);

    wordList?.words.forEach((word) => {
      setValue(`miniCog.recalledWords.${word}`, false, {
        shouldDirty: true,
      });
    });
  };

  return (
    <section
      className="rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="minicog-heading"
    >
      <div>
        <h2 id="minicog-heading" className="text-2xl font-bold text-slate-950">
          {copy.title}
        </h2>
        <p className="mt-2 text-base leading-7 text-slate-700">
          {copy.description}
        </p>
      </div>

      <div className="mt-6 grid gap-5">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <h3 className="text-lg font-bold text-slate-950">{copy.stepOne}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {copy.stepOneHelp}
          </p>
          <fieldset className="mt-4">
            <legend className="text-sm font-bold text-slate-800">
              {copy.wordListVersion}
            </legend>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {miniCogWordLists.map((wordList) => (
                <label
                  key={wordList.id}
                  className="rounded-2xl border border-purple-100 bg-white p-4 transition has-[:checked]:border-purple-600 has-[:checked]:bg-purple-50"
                >
                  <input
                    type="radio"
                    value={wordList.id}
                    className="sr-only"
                    checked={selectedWordListId === wordList.id}
                    onChange={() => handleWordListChange(wordList.id)}
                  />
                  <span className="block text-sm font-bold text-purple-800">
                    {copy.wordLists?.[wordList.id]?.label ?? wordList.label}
                  </span>
                  <span className="mt-2 block text-base font-semibold text-slate-900">
                    {(
                      copy.wordLists?.[wordList.id]?.words ?? wordList.words
                    ).join(" • ")}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <fieldset className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <legend className="text-lg font-bold text-slate-950">
            {copy.stepTwo}
          </legend>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {copy.stepTwoHelp}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { value: 2 as ClockDrawingScore, label: copy.normalClock },
              { value: 0 as ClockDrawingScore, label: copy.abnormalClock },
            ].map((choice) => (
              <label
                key={choice.value}
                className="flex min-h-14 items-center justify-center rounded-2xl border border-purple-100 bg-white px-4 text-sm font-bold text-slate-800 transition has-[:checked]:border-purple-600 has-[:checked]:bg-purple-50 has-[:checked]:text-purple-900"
              >
                <input
                  type="radio"
                  value={choice.value}
                  className="sr-only"
                  {...register("miniCog.clockDrawingScore", {
                    valueAsNumber: true,
                  })}
                />
                {choice.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <legend className="text-lg font-bold text-slate-950">
            {copy.stepThree}
          </legend>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {copy.stepThreeHelp}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {selectedWordList.words.map((word, index) => (
              <label
                key={word}
                className="flex min-h-14 items-center gap-3 rounded-2xl border border-purple-100 bg-white px-4 text-sm font-bold text-slate-800 transition has-[:checked]:border-purple-600 has-[:checked]:bg-purple-50"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-purple-700"
                  {...register(`miniCog.recalledWords.${word}`)}
                />
                <span>
                  {displayWordList?.words?.[index] ?? word}
                  <span className="block text-xs font-semibold text-slate-500">
                    {copy.recalled}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="rounded-3xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-900">
          <h3 className="text-sm font-bold uppercase tracking-wide">
            {copy.scoreGuideTitle}
          </h3>
          <ul className="mt-2 grid gap-2 text-sm leading-6">
            <li>{copy.scoreGuide.wordRecall}</li>
            <li>{copy.scoreGuide.clockDraw}</li>
            <li>{copy.scoreGuide.total}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
