"use client";

import { useFormContext } from "react-hook-form";
import type { MedicalCopy } from "@/constants/i18n/medical";
import {
  educationOptions,
  type Demographics,
} from "@/lib/assessment/medical-types";
import type { MedicalAssessmentSchemaValues } from "@/lib/assessment/medical-schema";
import { useCopy } from "@/lib/i18n/use-copy";

type DemographicFormProps = {
  copy: MedicalCopy["demographics"];
};

function ErrorMessage({ message, id }: { message?: string; id: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="mt-2 text-sm font-medium text-red-700">
      {message}
    </p>
  );
}

function textInputClasses(hasError?: boolean) {
  return `mt-2 h-12 w-full rounded-2xl border bg-white px-4 text-base text-slate-950 outline-none transition focus:ring-2 focus:ring-purple-600 ${
    hasError ? "border-red-300" : "border-purple-100 focus:border-purple-400"
  }`;
}

export function DemographicForm({ copy }: DemographicFormProps) {
  const common = useCopy("common");
  const {
    register,
    formState: { errors },
  } = useFormContext<MedicalAssessmentSchemaValues>();
  const demographicErrors = errors.demographics;

  return (
    <section
      className="rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="demographic-heading"
    >
      <div>
        <h2
          id="demographic-heading"
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
            htmlFor="patientId"
            className="text-sm font-bold text-slate-800"
          >
            {copy.patientId}
          </label>
          <input
            id="patientId"
            type="text"
            aria-invalid={Boolean(demographicErrors?.patientId)}
            aria-describedby={
              demographicErrors?.patientId ? "patientId-error" : undefined
            }
            className={textInputClasses(Boolean(demographicErrors?.patientId))}
            {...register("demographics.patientId")}
          />
          <ErrorMessage
            id="patientId-error"
            message={demographicErrors?.patientId?.message}
          />
        </div>

        <div>
          <label
            htmlFor="fullName"
            className="flex items-center gap-2 text-sm font-bold text-slate-800"
          >
            {copy.fullName}
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
              {copy.fullNameOptional}
            </span>
          </label>
          <input
            id="fullName"
            type="text"
            className={textInputClasses()}
            {...register("demographics.fullName")}
          />
        </div>

        <div>
          <label htmlFor="age" className="text-sm font-bold text-slate-800">
            {copy.age}
          </label>
          <input
            id="age"
            type="number"
            min={18}
            max={120}
            inputMode="numeric"
            aria-invalid={Boolean(demographicErrors?.age)}
            aria-describedby={demographicErrors?.age ? "age-error" : undefined}
            className={textInputClasses(Boolean(demographicErrors?.age))}
            {...register("demographics.age", { valueAsNumber: true })}
          />
          <ErrorMessage
            id="age-error"
            message={demographicErrors?.age?.message}
          />
        </div>

        <fieldset>
          <legend className="text-sm font-bold text-slate-800">
            {copy.sexAtBirth}
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {(["male", "female"] as Demographics["sexAtBirth"][]).map(
              (value) => (
                <label
                  key={value}
                  className="flex min-h-12 items-center gap-3 rounded-2xl border border-purple-100 bg-white px-4 text-sm font-semibold text-slate-800 transition has-[:checked]:border-purple-600 has-[:checked]:bg-purple-50"
                >
                  <input
                    type="radio"
                    value={value}
                    className="h-4 w-4 accent-purple-700"
                    {...register("demographics.sexAtBirth")}
                  />
                  {value === "male" ? copy.male : copy.female}
                </label>
              ),
            )}
          </div>
          <ErrorMessage
            id="sexAtBirth-error"
            message={demographicErrors?.sexAtBirth?.message}
          />
        </fieldset>

        <div>
          <label
            htmlFor="educationYears"
            className="text-sm font-bold text-slate-800"
          >
            {copy.educationYears}
          </label>
          <select
            id="educationYears"
            aria-invalid={Boolean(demographicErrors?.educationYears)}
            aria-describedby="educationYears-help"
            className={textInputClasses(
              Boolean(demographicErrors?.educationYears),
            )}
            {...register("demographics.educationYears")}
          >
            <option value="">{common.selectEducationRange}</option>
            {educationOptions.map((option) => {
              const label =
                copy.educationOptions?.[option.value] ?? option.value;

              return (
                <option key={option.value} value={option.value}>
                  {label}
                </option>
              );
            })}
          </select>
          <p id="educationYears-help" className="mt-2 text-sm text-slate-600">
            {copy.educationHelp}
          </p>
          <ErrorMessage
            id="educationYears-error"
            message={demographicErrors?.educationYears?.message}
          />
        </div>

        <div>
          <label
            htmlFor="clinicianNameOrId"
            className="text-sm font-bold text-slate-800"
          >
            {copy.clinicianNameOrId}
          </label>
          <input
            id="clinicianNameOrId"
            type="text"
            aria-invalid={Boolean(demographicErrors?.clinicianNameOrId)}
            aria-describedby={
              demographicErrors?.clinicianNameOrId
                ? "clinicianNameOrId-error"
                : undefined
            }
            className={textInputClasses(
              Boolean(demographicErrors?.clinicianNameOrId),
            )}
            {...register("demographics.clinicianNameOrId")}
          />
          <ErrorMessage
            id="clinicianNameOrId-error"
            message={demographicErrors?.clinicianNameOrId?.message}
          />
        </div>
      </div>
    </section>
  );
}
