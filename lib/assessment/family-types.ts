export type Language = "en" | "fil";

export type PatientSex = "male" | "female";

export type RelationshipToPatient =
  | "spouse"
  | "child"
  | "sibling"
  | "professional-caregiver"
  | "other-family-member"
  | "other";

export type MiniCogWordListId = "version-a" | "version-b" | "version-c";

export type ClockDrawingScore = 0 | 2;

export type LawtonItemId =
  | "telephone"
  | "shopping"
  | "foodPreparation"
  | "housekeeping"
  | "laundry"
  | "transportation"
  | "medications"
  | "finances";

export type LawtonResponse = "independent" | "dependent";

export type CaregiverInterpretationLabel =
  | "Further medical evaluation recommended"
  | "Low risk of cognitive impairment";

export type CaregiverDemographics = {
  patientInitialOrNickname: string;
  patientAge: number;
  patientSex: PatientSex;
  relationshipToPatient: RelationshipToPatient;
};

export type MiniCogFormValues = {
  wordListId: MiniCogWordListId;
  clockDrawingScore: ClockDrawingScore;
  recalledWords: Record<string, boolean>;
};

export type LawtonFormValues = Record<LawtonItemId, LawtonResponse>;

export type FamilyAssessmentFormValues = {
  demographics: CaregiverDemographics;
  miniCog: MiniCogFormValues;
  lawton: LawtonFormValues;
};

export type MiniCogWordList = {
  id: MiniCogWordListId;
  label: string;
  words: string[];
};

export type LawtonItemDefinition = {
  id: LawtonItemId;
  label: string;
  countsForMaleScore: boolean;
};

export type LawtonScoreResult = {
  total: number;
  maxScore: 5 | 8;
  scoredItems: LawtonItemId[];
  dependentItems: LawtonItemId[];
  independentItems: LawtonItemId[];
};

export type CaregiverInterpretation = {
  /** Summary badge label (low risk vs further evaluation). */
  label: CaregiverInterpretationLabel;
  filipinoLabel:
    | "Kinakailangan ng karagdagang pagsusuri ng doktor"
    | "Mababang panganib sa pagkaulianin";
  /** PDF matrix row interpretation (English). */
  matrixInterpretation: string;
  matrixInterpretationFil: string;
  /** PDF matrix action / referral (English). */
  referralGuidance: string;
  referralGuidanceFil: string;
  plainLanguageSummary: string;
};

export type CaregiverAssessmentTotals = {
  miniCogTotal: number;
  miniCogMax: 5;
  lawton: LawtonScoreResult;
  interpretation: CaregiverInterpretation;
};

export type CaregiverResultPayload = {
  track: "family-caregiver";
  privacyMode: "on-screen-only";
  storageBehavior: "not-saved";
  dashboardTransmission: "never";
  demographics: CaregiverDemographics;
  miniCog: {
    wordListId: MiniCogWordListId;
    recalledWords: Record<string, boolean>;
    clockDrawingScore: ClockDrawingScore;
    total: number;
    maxScore: 5;
  };
  lawton: LawtonScoreResult & {
    responses: LawtonFormValues;
  };
  interpretation: CaregiverInterpretation;
  difficultySummary: string[];
  assessmentDate: string;
};

export const relationshipOptions: Array<{
  value: RelationshipToPatient;
  label: string;
}> = [
  { value: "spouse", label: "Spouse" },
  { value: "child", label: "Child" },
  { value: "sibling", label: "Sibling" },
  { value: "professional-caregiver", label: "Professional Caregiver" },
  { value: "other-family-member", label: "Other Family Member" },
  { value: "other", label: "Other" },
];

export const miniCogWordLists: MiniCogWordList[] = [
  { id: "version-a", label: "Word List A", words: ["Banana", "Sunrise", "Chair"] },
  { id: "version-b", label: "Word List B", words: ["River", "Market", "Flower"] },
  { id: "version-c", label: "Word List C", words: ["Table", "Garden", "Pencil"] },
];

export const lawtonItems: LawtonItemDefinition[] = [
  { id: "telephone", label: "Ability to Use Telephone", countsForMaleScore: true },
  { id: "shopping", label: "Shopping", countsForMaleScore: true },
  { id: "foodPreparation", label: "Food Preparation", countsForMaleScore: false },
  { id: "housekeeping", label: "Housekeeping", countsForMaleScore: false },
  { id: "laundry", label: "Laundry", countsForMaleScore: false },
  { id: "transportation", label: "Transportation / Transit", countsForMaleScore: true },
  {
    id: "medications",
    label: "Responsibility for Own Medications",
    countsForMaleScore: true,
  },
  { id: "finances", label: "Ability to Handle Finances", countsForMaleScore: true },
];
