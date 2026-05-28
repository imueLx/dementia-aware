"use client";

import { useFormContext } from "react-hook-form";
import type { MedicalCopy } from "@/constants/i18n/medical";
import { katzItems, type KatzResponse } from "@/lib/assessment/medical-types";
import type { MedicalAssessmentSchemaValues } from "@/lib/assessment/medical-schema";

type KatzSectionProps = {
  copy: MedicalCopy["katz"];
};

export function KatzSection({ copy }: KatzSectionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<MedicalAssessmentSchemaValues>();

  const choices: Array<{ value: KatzResponse; label: string }> = [
    { value: "independent", label: copy.independent },
    { value: "dependent", label: copy.dependent },
  ];

  return (
    <section
      className="rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="katz-heading"
    >
      <div>
        <h2 id="katz-heading" className="text-2xl font-bold text-slate-950">
          {copy.title}
        </h2>
        <p className="mt-2 text-base leading-7 text-slate-700">
          {copy.description}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {katzItems.map((item) => {
          const error = errors.katz?.[item.id]?.message;

          return (
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
                      {...register(`katz.${item.id}`)}
                    />
                    {choice.label}
                  </label>
                ))}
              </div>
              {error ? (
                <p className="mt-2 text-sm font-medium text-red-700">{error}</p>
              ) : null}
            </fieldset>
          );
        })}
      </div>
    </section>
  );
}
