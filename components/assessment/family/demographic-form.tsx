"use client";

import { useFormContext } from "react-hook-form";
import type { CaregiverCopy } from "@/constants/i18n/caregiver";
import {
  relationshipOptions,
  type PatientSex,
} from "@/lib/assessment/family-types";
import type { FamilyAssessmentSchemaValues } from "@/lib/assessment/family-schema";

type DemographicFormProps = {
  copy: CaregiverCopy["demographics"];
};

function ErrorMessage({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="mt-2 text-sm font-medium text-red-700">
      {message}
    </p>
  );
}

function inputClasses(hasError?: boolean) {
  return `mt-2 h-12 w-full rounded-2xl border bg-white px-4 text-base text-slate-950 outline-none transition focus:ring-2 focus:ring-purple-600 ${
    hasError ? "border-red-300" : "border-purple-100 focus:border-purple-400"
  }`;
}

export function DemographicForm({ copy }: DemographicFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FamilyAssessmentSchemaValues>();
  const demographicErrors = errors.demographics;

  return (
    <section
      className="rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="family-demographic-heading"
    >
      <div>
        <h2
          id="family-demographic-heading"
          className="text-2xl font-bold text-slate-950"
        >
          {copy.title}
        </h2>
        <p className="mt-2 text-base leading-7 text-slate-700">
          {copy.description}
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="patientInitialOrNickname"
            className="text-sm font-bold text-slate-800"
          >
            {copy.patientInitialOrNickname}
          </label>
          <input
            id="patientInitialOrNickname"
            type="text"
            aria-invalid={Boolean(demographicErrors?.patientInitialOrNickname)}
            aria-describedby={
              demographicErrors?.patientInitialOrNickname
                ? "patientInitialOrNickname-error"
                : undefined
            }
            className={inputClasses(
              Boolean(demographicErrors?.patientInitialOrNickname),
            )}
            {...register("demographics.patientInitialOrNickname")}
          />
          <ErrorMessage
            id="patientInitialOrNickname-error"
            message={demographicErrors?.patientInitialOrNickname?.message}
          />
        </div>

        <div>
          <label
            htmlFor="patientAge"
            className="text-sm font-bold text-slate-800"
          >
            {copy.patientAge}
          </label>
          <input
            id="patientAge"
            type="number"
            min={18}
            max={120}
            inputMode="numeric"
            aria-invalid={Boolean(demographicErrors?.patientAge)}
            aria-describedby={
              demographicErrors?.patientAge ? "patientAge-error" : undefined
            }
            className={inputClasses(Boolean(demographicErrors?.patientAge))}
            {...register("demographics.patientAge", { valueAsNumber: true })}
          />
          <ErrorMessage
            id="patientAge-error"
            message={demographicErrors?.patientAge?.message}
          />
        </div>

        <fieldset>
          <legend className="text-sm font-bold text-slate-800">
            {copy.patientSex}
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {(["male", "female"] as PatientSex[]).map((value) => (
              <label
                key={value}
                className="flex min-h-12 items-center gap-3 rounded-2xl border border-purple-100 bg-white px-4 text-sm font-semibold text-slate-800 transition has-[:checked]:border-purple-600 has-[:checked]:bg-purple-50"
              >
                <input
                  type="radio"
                  value={value}
                  className="h-4 w-4 accent-purple-700"
                  {...register("demographics.patientSex")}
                />
                {value === "male" ? copy.male : copy.female}
              </label>
            ))}
          </div>
          <ErrorMessage
            id="patientSex-error"
            message={demographicErrors?.patientSex?.message}
          />
        </fieldset>

        <div>
          <label
            htmlFor="relationshipToPatient"
            className="text-sm font-bold text-slate-800"
          >
            {copy.relationshipToPatient}
          </label>
          <select
            id="relationshipToPatient"
            aria-invalid={Boolean(demographicErrors?.relationshipToPatient)}
            className={inputClasses(
              Boolean(demographicErrors?.relationshipToPatient),
            )}
            {...register("demographics.relationshipToPatient")}
          >
            <option value="">{copy.relationshipPlaceholder}</option>
            {relationshipOptions.map((option) => {
              const label =
                copy.relationshipOptions?.[option.value] ?? option.label;

              return (
                <option key={option.value} value={option.value}>
                  {label}
                </option>
              );
            })}
          </select>
          <ErrorMessage
            id="relationshipToPatient-error"
            message={demographicErrors?.relationshipToPatient?.message}
          />
        </div>
      </div>
    </section>
  );
}
