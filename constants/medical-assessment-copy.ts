export const medicalAssessmentCopy = {
  en: {
    page: {
      eyebrow: "Medical Professional / Trained Specialist track",
      title: "Medical Professional Assessment",
      intro:
        "This workflow is intended for clinicians and trained specialists completing a structured dementia screening record.",
      professionalNote:
        "Professional-use workflow: submitted medical-track data is prepared for secure transmission to the restricted Clinical Central Dashboard after completion.",
      backHome: "Back to home",
    },
    demographics: {
      title: "Demographic Profile",
      description:
        "These fields map directly to the future clinical dashboard record.",
      patientId: "Patient ID / Case Number",
      fullName: "Full Name",
      fullNameOptional: "Optional",
      age: "Age",
      sexAtBirth: "Sex assigned at birth",
      male: "Male",
      female: "Female",
      educationYears: "Years of Formal Education",
      educationHelp:
        "12 years or fewer adds 1 bonus point to the adjusted MoCA-P score.",
      clinicianNameOrId: "Clinician Name / ID",
    },
    moca: {
      title: "MoCA-P Assessment",
      description:
        "Enter domain item scores now. Each domain subtotal is preserved for later charts and clinical summary output.",
      scoreLabel: "Score",
      maxLabel: "Max",
      domainSubtotal: "Domain subtotal",
    },
    katz: {
      title: "Katz ADL",
      description:
        "Choose Independent or Dependent for each activity. Independent scores 1; Dependent scores 0.",
      independent: "Independent",
      dependent: "Dependent",
    },
    summary: {
      title: "Live Score Summary",
      demographicStatus: "Demographic completion",
      complete: "Complete",
      incomplete: "Incomplete",
      rawMoca: "Raw MoCA-P",
      educationAdjustment: "Education adjustment",
      adjustedMoca: "Adjusted MoCA-P",
      katzScore: "Katz ADL",
      domainBreakdown: "MoCA-P domain breakdown",
      assessmentDate: "Assessment date",
      submissionReadiness: "Submission readiness",
      ready: "Ready to validate and submit",
      needsRequired: "Required demographic fields needed",
      interpretation: "Clinical interpretation scaffold",
      recommendation: "Clinical recommendation placeholder",
      referralAction: "Referral / action placeholder",
    },
    submit: {
      title: "Submit to Clinical Dashboard Queue",
      description:
        "For now this builds and logs a mock payload. Later, this same payload can be securely transmitted to the restricted Clinical Central Dashboard.",
      button: "Submit Assessment",
      submitted: "Mock payload prepared for secure dashboard transmission.",
      payloadHint: "Payload logged in the browser console for development review.",
    },
  },
  fil: {
    page: {
      eyebrow: "Medical Professional / Trained Specialist track",
      title: "Medical Professional Assessment",
      intro:
        "Para ito sa clinicians at trained specialists na gumagawa ng structured dementia screening record.",
      professionalNote:
        "Professional-use workflow: ang medical-track data ay ihahanda para sa secure transmission papunta sa restricted Clinical Central Dashboard pagkatapos makumpleto.",
      backHome: "Bumalik sa home",
    },
    demographics: {
      title: "Demographic Profile",
      description:
        "Ang mga field na ito ay direktang imamapa sa future clinical dashboard record.",
      patientId: "Patient ID / Case Number",
      fullName: "Full Name",
      fullNameOptional: "Optional",
      age: "Edad",
      sexAtBirth: "Sex assigned at birth",
      male: "Male",
      female: "Female",
      educationYears: "Years of Formal Education",
      educationHelp:
        "Kapag 12 years o mas mababa, may dagdag na 1 bonus point sa adjusted MoCA-P score.",
      clinicianNameOrId: "Clinician Name / ID",
    },
    moca: {
      title: "MoCA-P Assessment",
      description:
        "Ilagay muna ang item scores per domain. Naka-save ang bawat domain subtotal para sa future charts at clinical summary output.",
      scoreLabel: "Score",
      maxLabel: "Max",
      domainSubtotal: "Domain subtotal",
    },
    katz: {
      title: "Katz ADL",
      description:
        "Piliin ang Independent o Dependent sa bawat activity. Independent ay 1; Dependent ay 0.",
      independent: "Independent",
      dependent: "Dependent",
    },
    summary: {
      title: "Live Score Summary",
      demographicStatus: "Demographic completion",
      complete: "Complete",
      incomplete: "Incomplete",
      rawMoca: "Raw MoCA-P",
      educationAdjustment: "Education adjustment",
      adjustedMoca: "Adjusted MoCA-P",
      katzScore: "Katz ADL",
      domainBreakdown: "MoCA-P domain breakdown",
      assessmentDate: "Assessment date",
      submissionReadiness: "Submission readiness",
      ready: "Ready to validate and submit",
      needsRequired: "Kailangan pa ang required demographic fields",
      interpretation: "Clinical interpretation scaffold",
      recommendation: "Clinical recommendation placeholder",
      referralAction: "Referral / action placeholder",
    },
    submit: {
      title: "Submit to Clinical Dashboard Queue",
      description:
        "Sa ngayon, gumagawa at naglo-log ito ng mock payload. Sa susunod, ang payload na ito ay puwedeng secure na ipadala sa restricted Clinical Central Dashboard.",
      button: "Submit Assessment",
      submitted: "Mock payload prepared para sa secure dashboard transmission.",
      payloadHint: "Payload logged sa browser console para sa development review.",
    },
  },
} as const;

export type MedicalAssessmentCopy =
  (typeof medicalAssessmentCopy)[keyof typeof medicalAssessmentCopy];
