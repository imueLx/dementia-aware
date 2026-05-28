"use client";

import { useFormContext, useWatch } from "react-hook-form";
import type { CaregiverCopy } from "@/constants/i18n/caregiver";
import {
  lawtonItems,
  type LawtonResponse,
} from "@/lib/assessment/family-types";
import type { FamilyAssessmentSchemaValues } from "@/lib/assessment/family-schema";

type LawtonSectionProps = {
  copy: CaregiverCopy["lawton"];
};

export function LawtonSection({ copy }: LawtonSectionProps) {
  const { register } = useFormContext<FamilyAssessmentSchemaValues>();
  const patientSex = useWatch<
    FamilyAssessmentSchemaValues,
    "demographics.patientSex"
  >({
    name: "demographics.patientSex",
  });

  const choices: Array<{ value: LawtonResponse; label: string }> = [
    { value: "independent", label: copy.independent },
    { value: "dependent", label: copy.dependent },
  ];

  return (
    <section
      className="rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="lawton-heading"
    >
      <div>
        <h2 id="lawton-heading" className="text-2xl font-bold text-slate-950">
          {copy.title}
        </h2>
        <p className="mt-2 text-base leading-7 text-slate-700">
          {copy.description}
        </p>
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-700">
          {copy.instructions?.map((instruction) => (
            <li key={instruction} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
              <span>{instruction}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-2xl border border-purple-100 bg-purple-50 p-4 text-sm font-semibold leading-6 text-purple-900">
          {patientSex === "female"
            ? copy.femaleScoringNote
            : copy.maleScoringNote}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {lawtonItems.map((item) => (
          <fieldset
            key={item.id}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
          >
            <legend className="text-base font-bold text-slate-950">
              {copy.items?.[item.id] ?? item.label}
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {choices.map((choice) => (
                <label
                  key={choice.value}
                  className="flex min-h-12 items-center justify-center rounded-2xl border border-purple-100 bg-white px-3 text-sm font-bold text-slate-800 transition has-[:checked]:border-purple-600 has-[:checked]:bg-purple-50 has-[:checked]:text-purple-900"
                >
                  <input
                    type="radio"
                    value={choice.value}
                    className="sr-only"
                    {...register(`lawton.${item.id}`)}
                  />
                  {choice.label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </section>
  );
}
