import { z } from "zod";

const lawtonChoiceSchema = z.enum(["independent", "dependent"], {
  message: "Choose independent or dependent.",
});

export const familyAssessmentSchema = z.object({
  demographics: z.object({
    patientInitialOrNickname: z
      .string()
      .trim()
      .min(1, "Patient initial or nickname is required."),
    patientAge: z
      .number({ message: "Patient age is required." })
      .int("Age must be a whole number.")
      .min(18, "Age must be at least 18.")
      .max(120, "Age must be 120 or below."),
    patientSex: z.enum(["male", "female"], {
      message: "Select patient sex.",
    }),
    relationshipToPatient: z.enum(
      [
        "spouse",
        "child",
        "sibling",
        "professional-caregiver",
        "other-family-member",
        "other",
      ],
      {
        message: "Select your relationship to the patient.",
      },
    ),
  }),
  miniCog: z.object({
    wordListId: z.enum(["version-a", "version-b", "version-c"]),
    clockDrawingScore: z.union([z.literal(0), z.literal(2)]),
    recalledWords: z.record(z.string(), z.boolean()),
  }),
  lawton: z.object({
    telephone: lawtonChoiceSchema,
    shopping: lawtonChoiceSchema,
    foodPreparation: lawtonChoiceSchema,
    housekeeping: lawtonChoiceSchema,
    laundry: lawtonChoiceSchema,
    transportation: lawtonChoiceSchema,
    medications: lawtonChoiceSchema,
    finances: lawtonChoiceSchema,
  }),
});

export type FamilyAssessmentSchemaValues = z.infer<
  typeof familyAssessmentSchema
>;
