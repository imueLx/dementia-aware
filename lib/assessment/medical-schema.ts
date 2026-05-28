import { z } from "zod";
import {
  educationOptions,
  mocaDomainDefinitions,
  type MocaDomainId,
} from "./medical-types";

const scoreSchema = (maxScore: number) =>
  z
    .number({
      message: "Enter a score.",
    })
    .min(0, "Score cannot be below 0.")
    .max(maxScore, `Score cannot exceed ${maxScore}.`);

const mocaSchemaShape = mocaDomainDefinitions.reduce(
  (domains, domain) => {
    domains[domain.id] = z.object({
      items: z.object(
        domain.items.reduce(
          (items, item) => {
            items[item.id] = scoreSchema(item.maxScore);
            return items;
          },
          {} as Record<string, z.ZodNumber>,
        ),
      ),
    });

    return domains;
  },
  {} as Record<
    MocaDomainId,
    z.ZodObject<{ items: z.ZodObject<Record<string, z.ZodNumber>> }>
  >,
);

const katzChoiceSchema = z.enum(["independent", "dependent"], {
  message: "Select independent or dependent.",
});

const katzSchemaShape = {
  bathing: katzChoiceSchema,
  dressing: katzChoiceSchema,
  toileting: katzChoiceSchema,
  transferring: katzChoiceSchema,
  continence: katzChoiceSchema,
  feeding: katzChoiceSchema,
};

export const medicalAssessmentSchema = z.object({
  demographics: z.object({
    patientId: z.string().trim().min(1, "Patient ID / Case Number is required."),
    fullName: z.string().trim().optional(),
    age: z
      .number({ message: "Age is required." })
      .int("Age must be a whole number.")
      .min(18, "Age must be at least 18.")
      .max(120, "Age must be 120 or below."),
    sexAtBirth: z.enum(["male", "female"], {
      message: "Select sex assigned at birth.",
    }),
    educationYears: z.enum(
      educationOptions.map((option) => option.value) as [
        "0-6",
        "7-12",
        "13-16",
        "17-plus",
      ],
      {
        message: "Select years of formal education.",
      },
    ),
    clinicianNameOrId: z
      .string()
      .trim()
      .min(1, "Clinician Name / ID is required."),
  }),
  moca: z.object(mocaSchemaShape),
  katz: z.object(katzSchemaShape),
});

export type MedicalAssessmentSchemaValues = z.infer<
  typeof medicalAssessmentSchema
>;
