"use client";

import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { MedicalCopy } from "@/constants/i18n/medical";
import { mocaDomainDefinitions } from "@/lib/assessment/medical-types";
import type { MedicalAssessmentSchemaValues } from "@/lib/assessment/medical-schema";

type MocaSectionProps = {
  copy: MedicalCopy["moca"];
};

export function MocaSection({ copy }: MocaSectionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<MedicalAssessmentSchemaValues>();
  const mocaValues = useWatch<MedicalAssessmentSchemaValues, "moca">({
    name: "moca",
  });

  const domainSubtotals = useMemo(() => {
    return mocaDomainDefinitions.reduce(
      (totals, domain) => {
        totals[domain.id] = domain.items.reduce((sum, item) => {
          const value = mocaValues?.[domain.id]?.items?.[item.id] ?? 0;
          return sum + Number(value);
        }, 0);

        return totals;
      },
      {} as Record<string, number>,
    );
  }, [mocaValues]);

  return (
    <section
      className="rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="moca-heading"
    >
      <div>
        <h2 id="moca-heading" className="text-2xl font-bold text-slate-950">
          {copy.title}
        </h2>
        <p className="mt-2 text-base leading-7 text-slate-700">
          {copy.description}
        </p>
      </div>

      <div className="mt-6 grid gap-5">
        {mocaDomainDefinitions.map((domain) => (
          <fieldset
            key={domain.id}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
          >
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <legend className="text-lg font-bold text-slate-950">
                {copy.domains?.[domain.id] ?? domain.title}
              </legend>
              <div className="rounded-full bg-purple-100 px-3 py-1.5 text-sm font-bold text-purple-800">
                {copy.domainSubtotal}: {domainSubtotals[domain.id] ?? 0} /{" "}
                {domain.maxScore}
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {domain.items.map((item) => {
                const fieldName = `moca.${domain.id}.items.${item.id}` as const;
                const error =
                  errors.moca?.[domain.id]?.items?.[item.id]?.message;

                return (
                  <div
                    key={item.id}
                    className="grid gap-3 rounded-2xl bg-white p-4 sm:grid-cols-[1fr_9rem] sm:items-center"
                  >
                    <label
                      htmlFor={fieldName}
                      className="text-sm font-semibold leading-6 text-slate-800"
                    >
                      {copy.items?.[item.id] ?? item.label}
                    </label>
                    <div>
                      <select
                        id={fieldName}
                        aria-invalid={Boolean(error)}
                        className="h-11 w-full rounded-2xl border border-purple-100 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-600"
                        {...register(fieldName, { valueAsNumber: true })}
                      >
                        {Array.from(
                          { length: item.maxScore + 1 },
                          (_, score) => (
                            <option key={score} value={score}>
                              {copy.scoreLabel}: {score} / {item.maxScore}
                            </option>
                          ),
                        )}
                      </select>
                      {error ? (
                        <p className="mt-2 text-sm font-medium text-red-700">
                          {error}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </section>
  );
}
