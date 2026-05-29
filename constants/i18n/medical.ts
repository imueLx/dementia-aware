import type { Language } from "@/lib/i18n/language-types";

export const medicalCopy = {
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
        "12 years or fewer triggers 1 bonus point on MoCA-P calculation. More than 12 years adds 0 points.",
      educationOptions: {
        "0-6": "0-6 years",
        "7-12": "7-12 years",
        "13-16": "13-16 years",
        "17-plus": "17+ years",
      },
      clinicianNameOrId: "Clinician Name / ID",
    },
    moca: {
      title: "MoCA-P Assessment",
      description:
        "Enter domain item scores now. Each domain subtotal is preserved for later charts and clinical summary output.",
      scoreLabel: "Score",
      maxLabel: "Max",
      domainSubtotal: "Domain subtotal",
      domains: {
        visuospatialExecutive: "Visuospatial / Executive",
        naming: "Naming",
        attention: "Attention",
        language: "Language",
        abstraction: "Abstraction",
        delayedRecall: "Delayed Recall",
        orientation: "Orientation",
      },
      items: {
        trailMaking: "Trail making / visuospatial path",
        cubeCopy: "Cube copy",
        clockDrawing: "Clock drawing / visuospatial",
        animalOne: "Naming animals - item 1",
        animalTwo: "Naming animals - item 2",
        animalThree: "Naming animals - item 3",
        forwardDigitSpan: "Forward digit span",
        backwardDigitSpan: "Backward digit span",
        vigilanceLetterTapping: "Vigilance / letter tapping",
        serialSubtraction: "Serial subtraction",
        sentenceRepetition: "Sentence repetition",
        verbalFluency: "Verbal fluency",
        abstractionPairOne: "Abstraction pairs - item 1",
        abstractionPairTwo: "Abstraction pairs - item 2",
        wordRecall: "Delayed recall word recall",
        date: "Orientation to date",
        month: "Orientation to month",
        year: "Orientation to year",
        day: "Orientation to day",
        place: "Orientation to place",
        city: "Orientation to city / locality",
      },
    },
    katz: {
      title: "Katz ADL",
      description:
        "Choose Independent or Dependent for each activity. Independent scores 1; Dependent scores 0.",
      independent: "Independent",
      dependent: "Dependent",
      items: {
        bathing: "Bathing",
        dressing: "Dressing",
        toileting: "Toileting",
        transferring: "Transferring",
        continence: "Continence",
        feeding: "Feeding",
      },
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
      recommendation: "Clinical recommendation",
      referralAction: "Referral / action",
    },
    interpretation: {
      Normal: {
        recommendation:
          "Continue routine monitoring and provide education on brain health and follow-up if symptoms progress.",
        referralAction:
          "No urgent referral indicated from this scaffolded interpretation.",
      },
      MCI: {
        recommendation:
          "Recommend clinical review, collateral history, and follow-up cognitive assessment.",
        referralAction:
          "Consider referral to a physician or memory clinic based on clinical judgment.",
      },
      "Moderate Dementia": {
        recommendation:
          "Recommend comprehensive medical evaluation and caregiver support planning.",
        referralAction:
          "Refer for formal diagnostic assessment and functional care planning.",
      },
      "Severe Dementia": {
        recommendation:
          "Recommend urgent comprehensive clinical review, safety planning, and caregiver support.",
        referralAction:
          "Refer to a specialist or appropriate clinical service for immediate follow-up.",
      },
    },
    submit: {
      title: "Submit to Clinical Dashboard Queue",
      description:
        "Final validation runs before secure transmission to the restricted Clinical Central Dashboard.",
      button: "Submit Assessment",
      submitted: "Assessment submitted to the restricted clinical dashboard.",
      payloadHint:
        "Record includes demographics, MoCA-P domains, Katz ADL, interpretation, and referral notes.",
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
      fullName: "Buong Pangalan",
      fullNameOptional: "Opsyonal",
      age: "Edad",
      sexAtBirth: "Kasarian mula kapanganakan",
      male: "Lalaki",
      female: "Babae",
      educationYears: "Taon ng Pormal na Edukasyon",
      educationHelp:
        "Kapag 12 taon o mas mababa, may dagdag na 1 bonus point sa MoCA-P. Kapag higit sa 12 taon, 0 ang dagdag.",
      educationOptions: {
        "0-6": "0-6 taon",
        "7-12": "7-12 taon",
        "13-16": "13-16 taon",
        "17-plus": "17+ taon",
      },
      clinicianNameOrId: "Pangalan / ID ng Clinician",
    },
    moca: {
      title: "MoCA-P Assessment",
      description:
        "Ilagay muna ang item scores per domain. Naka-save ang bawat domain subtotal para sa future charts at clinical summary output.",
      scoreLabel: "Puntos",
      maxLabel: "Max",
      domainSubtotal: "Domain subtotal",
      domains: {
        visuospatialExecutive: "Visuospatial",
        naming: "Naming",
        attention: "Atensyon",
        language: "Wika",
        abstraction: "Abstraksyon",
        delayedRecall: "Naantalang Pag-alaala",
        orientation: "Oryentasyon",
      },
      items: {
        trailMaking: "Trail making / visuospatial path",
        cubeCopy: "Pagkopya ng cube",
        clockDrawing: "Pagguhit ng orasan / visuospatial",
        animalOne: "Pagkilala sa hayop - item 1",
        animalTwo: "Pagkilala sa hayop - item 2",
        animalThree: "Pagkilala sa hayop - item 3",
        forwardDigitSpan: "Forward digit span",
        backwardDigitSpan: "Backward digit span",
        vigilanceLetterTapping: "Vigilance / letter tapping",
        serialSubtraction: "Serial subtraction",
        sentenceRepetition: "Pag-uulit ng pangungusap",
        verbalFluency: "Verbal fluency",
        abstractionPairOne: "Abstraction pairs - item 1",
        abstractionPairTwo: "Abstraction pairs - item 2",
        wordRecall: "Delayed recall word recall",
        date: "Oryentasyon sa petsa",
        month: "Oryentasyon sa buwan",
        year: "Oryentasyon sa taon",
        day: "Oryentasyon sa araw",
        place: "Oryentasyon sa lugar",
        city: "Oryentasyon sa lungsod / lokalidad",
      },
    },
    katz: {
      title: "Katz ADL",
      description:
        "Piliin ang Independent o Dependent sa bawat activity. Independent ay 1; Dependent ay 0.",
      independent: "Independent",
      dependent: "Dependent",
      items: {
        bathing: "Pagligo",
        dressing: "Pagbihis",
        toileting: "Paggamit ng Kubeta",
        transferring: "Paglipat ng Puwesto",
        continence: "Pagpigil sa Pagdumi / Pag-ihi",
        feeding: "Pagkain",
      },
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
      recommendation: "Clinical recommendation",
      referralAction: "Referral / action",
    },
    interpretation: {
      Normal: {
        recommendation:
          "Karaniwang pagsubaybay at pagbibigay ng gabay sa brain health. Mag-follow up kung lumalala ang sintomas.",
        referralAction:
          "Walang agarang referral na kailangan batay sa scaffolded interpretation na ito.",
      },
      MCI: {
        recommendation:
          "Irekomenda ang clinical review, collateral history, at follow-up cognitive assessment.",
        referralAction:
          "Isaalang-alang ang referral sa physician o memory clinic batay sa clinical judgment.",
      },
      "Moderate Dementia": {
        recommendation:
          "Irekomenda ang komprehensibong medical evaluation at caregiver support planning.",
        referralAction:
          "I-refer para sa pormal na diagnostic assessment at functional care planning.",
      },
      "Severe Dementia": {
        recommendation:
          "Irekomenda ang agarang komprehensibong clinical review, safety planning, at caregiver support.",
        referralAction:
          "I-refer sa specialist o angkop na clinical service para sa agarang follow-up.",
      },
    },
    submit: {
      title: "Submit to Clinical Dashboard Queue",
      description:
        "Magsasagawa ng final validation bago secure na maipadala sa restricted Clinical Central Dashboard.",
      button: "Ipasa ang Assessment",
      submitted: "Naipasa na ang assessment sa restricted clinical dashboard.",
      payloadHint:
        "Kasama sa record ang demographics, MoCA-P domains, Katz ADL, interpretation, at referral notes.",
    },
  },
} as const satisfies Record<Language, Record<string, unknown>>;

export type MedicalCopy = (typeof medicalCopy)[Language];
