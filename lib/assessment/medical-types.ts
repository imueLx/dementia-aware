export type Language = "en" | "fil";

export type SexAtBirth = "male" | "female";

export type EducationYearsOption =
  | "0-6"
  | "7-12"
  | "13-16"
  | "17-plus";

export type MocaDomainId =
  | "visuospatialExecutive"
  | "naming"
  | "attention"
  | "language"
  | "abstraction"
  | "delayedRecall"
  | "orientation";

export type KatzItemId =
  | "bathing"
  | "dressing"
  | "toileting"
  | "transferring"
  | "continence"
  | "feeding";

export type KatzResponse = "independent" | "dependent";

export type ClinicalInterpretationLabel =
  | "Normal"
  | "MCI"
  | "Moderate Dementia"
  | "Severe Dementia";

export type Demographics = {
  patientId: string;
  fullName?: string;
  age: number;
  sexAtBirth: SexAtBirth;
  educationYears: EducationYearsOption;
  clinicianNameOrId: string;
};

export type MocaItemDefinition = {
  id: string;
  label: string;
  maxScore: number;
  helper?: string;
};

export type MocaDomainDefinition = {
  id: MocaDomainId;
  title: string;
  maxScore: number;
  items: MocaItemDefinition[];
};

export type MocaDomainFormValues = {
  items: Record<string, number>;
};

export type MocaFormValues = Record<MocaDomainId, MocaDomainFormValues>;

export type KatzFormValues = Record<KatzItemId, KatzResponse>;

export type MedicalAssessmentFormValues = {
  demographics: Demographics;
  moca: MocaFormValues;
  katz: KatzFormValues;
};

export type MocaDomainScore = {
  id: MocaDomainId;
  title: string;
  maxScore: number;
  score: number;
  items: Array<{
    id: string;
    label: string;
    score: number;
    maxScore: number;
  }>;
};

export type ClinicalInterpretation = {
  /** Dashboard diagnostic bucket (Normal / MCI / Moderate Dementia / Severe Dementia). */
  label: ClinicalInterpretationLabel;
  /** PDF matrix row interpretation (e.g. Healthy Aging). */
  matrixInterpretation: string;
  /** PDF matrix action / referral text (single source for recommendation + referral). */
  recommendation: string;
  referralAction: string;
};

export type MedicalAssessmentTotals = {
  rawMocaTotal: number;
  educationAdjustment: number;
  adjustedMocaTotal: number;
  katzTotal: number;
  mocaDomainScores: MocaDomainScore[];
  interpretation: ClinicalInterpretation;
};

export type MedicalAssessmentPayload = {
  track: "medical-professional";
  demographics: Demographics;
  moca: {
    domainBreakdown: MocaDomainScore[];
    rawTotal: number;
    educationAdjustment: number;
    adjustedTotal: number;
  };
  katz: {
    responses: KatzFormValues;
    total: number;
  };
  interpretation: ClinicalInterpretation;
  recommendation: string;
  referralAction: string;
  assessmentDate: string;
  clinicianIdentifier: string;
  transmissionTarget: "restricted-clinical-central-dashboard";
};

export const educationOptions: Array<{
  value: EducationYearsOption;
  label: string;
  yearsForAdjustment: number;
}> = [
  { value: "0-6", label: "0-6 years", yearsForAdjustment: 6 },
  { value: "7-12", label: "7-12 years", yearsForAdjustment: 12 },
  { value: "13-16", label: "13-16 years", yearsForAdjustment: 16 },
  { value: "17-plus", label: "17+ years", yearsForAdjustment: 17 },
];

export const mocaDomainDefinitions: MocaDomainDefinition[] = [
  {
    id: "visuospatialExecutive",
    title: "Visuospatial / Executive",
    maxScore: 5,
    items: [
      { id: "trailMaking", label: "Trail making / visuospatial path", maxScore: 1 },
      { id: "cubeCopy", label: "Cube copy", maxScore: 1 },
      { id: "clockDrawing", label: "Clock drawing / visuospatial", maxScore: 3 },
    ],
  },
  {
    id: "naming",
    title: "Naming",
    maxScore: 3,
    items: [
      { id: "animalOne", label: "Naming animals - item 1", maxScore: 1 },
      { id: "animalTwo", label: "Naming animals - item 2", maxScore: 1 },
      { id: "animalThree", label: "Naming animals - item 3", maxScore: 1 },
    ],
  },
  {
    id: "attention",
    title: "Attention",
    maxScore: 6,
    items: [
      { id: "forwardDigitSpan", label: "Forward digit span", maxScore: 1 },
      { id: "backwardDigitSpan", label: "Backward digit span", maxScore: 1 },
      { id: "vigilanceLetterTapping", label: "Vigilance / letter tapping", maxScore: 1 },
      { id: "serialSubtraction", label: "Serial subtraction", maxScore: 3 },
    ],
  },
  {
    id: "language",
    title: "Language",
    maxScore: 3,
    items: [
      { id: "sentenceRepetition", label: "Sentence repetition", maxScore: 2 },
      { id: "verbalFluency", label: "Verbal fluency", maxScore: 1 },
    ],
  },
  {
    id: "abstraction",
    title: "Abstraction",
    maxScore: 2,
    items: [
      { id: "abstractionPairOne", label: "Abstraction pairs - item 1", maxScore: 1 },
      { id: "abstractionPairTwo", label: "Abstraction pairs - item 2", maxScore: 1 },
    ],
  },
  {
    id: "delayedRecall",
    title: "Delayed Recall",
    maxScore: 5,
    items: [
      { id: "wordRecall", label: "Delayed recall word recall", maxScore: 5 },
    ],
  },
  {
    id: "orientation",
    title: "Orientation",
    maxScore: 6,
    items: [
      { id: "date", label: "Orientation to date", maxScore: 1 },
      { id: "month", label: "Orientation to month", maxScore: 1 },
      { id: "year", label: "Orientation to year", maxScore: 1 },
      { id: "day", label: "Orientation to day", maxScore: 1 },
      { id: "place", label: "Orientation to place", maxScore: 1 },
      { id: "city", label: "Orientation to city / locality", maxScore: 1 },
    ],
  },
];

export const katzItems: Array<{ id: KatzItemId; label: string }> = [
  { id: "bathing", label: "Bathing" },
  { id: "dressing", label: "Dressing" },
  { id: "toileting", label: "Toileting" },
  { id: "transferring", label: "Transferring" },
  { id: "continence", label: "Continence" },
  { id: "feeding", label: "Feeding" },
];
