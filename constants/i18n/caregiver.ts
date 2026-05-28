import type { Language } from "@/lib/i18n/language-types";

export const caregiverCopy = {
  en: {
    page: {
      eyebrow: "Family Member / Caregiver track",
      title: "Family / Caregiver Assessment",
      intro:
        "A guided home-based screening flow for families, guardians, and caregivers who want a private first look at memory and daily-function concerns.",
      privacyTitle: "Privacy-first public screening",
      privacyNotice:
        "Results are processed instantly and shown only on this screen. This caregiver flow is not saved to a database and is never pushed to the restricted clinical dashboard.",
      backHome: "Back to home",
    },
    demographics: {
      title: "Simplified Demographic Profile",
      description:
        "Use a nickname or initials to preserve privacy on this public browser.",
      patientInitialOrNickname: "Patient's Initial or Nickname",
      patientAge: "Patient's Age",
      patientSex: "Patient's Sex",
      male: "Male",
      female: "Female",
      relationshipToPatient: "Your Relationship to the Patient",
      relationshipPlaceholder: "Select relationship",
      relationshipOptions: {
        spouse: "Spouse",
        child: "Child",
        sibling: "Sibling",
        "professional-caregiver": "Professional Caregiver",
        "other-family-member": "Other Family Member",
        other: "Other",
      },
    },
    miniCog: {
      title: "Mini-Cog Assessment",
      description:
        "Mini-Cog uses 3-word registration, clock drawing, and 3-word recall for a total of 5 points.",
      stepOne: "Step 1: 3-Word Registration",
      stepOneHelp:
        "Please listen carefully. I am going to say three words that I want you to repeat back to me now and try to remember.",
      wordListVersion: "Word-list version",
      wordLists: {
        "version-a": {
          label: "Word List A",
          words: ["Banana", "Sunrise", "Chair"],
        },
        "version-b": {
          label: "Word List B",
          words: ["Leader", "Season", "Table"],
        },
        "version-c": {
          label: "Word List C",
          words: ["Village", "Kitchen", "Baby"],
        },
      },
      stepTwo: "Step 2: Clock Drawing Test",
      stepTwoHelp:
        "Next, I want you to draw a clock for me. First, put in all of the numbers where they go. Now, set the hands to 10 past 11.",
      normalClock: "Normal Clock",
      abnormalClock: "Abnormal Clock",
      stepThree: "Step 3: 3-Word Recall",
      stepThreeHelp: "What were the three words I asked you to remember?",
      recalled: "Recalled correctly",
      scoreGuideTitle: "Mini-Cog score guidance",
      scoreGuide: {
        wordRecall:
          "Word Recall: 0-3 points. 1 point for each word spontaneously recalled without cueing.",
        clockDraw:
          "Clock Draw: 0 or 2 points. A normal clock has all numbers in the correct sequence and approximately correct position. Hands point to 11 and 2.",
        total:
          "Total Score: 0-5 points. A cut point of 3 has been validated for dementia screening. A cut point of 4 may be used when greater sensitivity is desired.",
      },
    },
    lawton: {
      title: "Lawton IADL",
      description:
        "Score actual performance over the past 24-48 hours. Give 1 only if fully independent; give 0 if help, prompting, or supervision is needed.",
      independent: "Independent",
      dependent: "Dependent",
      maleScoringNote:
        "For men, this version scores up to 5 items to avoid gender bias in the provided material. All 8 categories remain visible for discussion.",
      femaleScoringNote: "For women, this version scores all 8 categories.",
      instructions: [
        "Observe or Interview: Evaluate the patient by observing their daily routine or by interviewing them, their family members, or primary caregivers.",
        "Rate Current Ability: Score the patient based on their actual performance over the past 24 to 48 hours, not their potential ability.",
        "Apply Strict Scoring: Award 1 point ONLY if the patient performs the task completely independently. Award 0 points if they require any form of human assistance, supervision, or verbal prompting.",
      ],
      items: {
        telephone: "Ability to Use Telephone",
        shopping: "Shopping",
        foodPreparation: "Food Preparation",
        housekeeping: "Housekeeping",
        laundry: "Laundry",
        transportation: "Mode of Transportation",
        medications: "Responsibility for Own Medications",
        finances: "Ability to Handle Finances",
      },
    },
    summary: {
      title: "Live Score Summary",
      demographicStatus: "Demographic completion",
      complete: "Complete",
      incomplete: "Incomplete",
      miniCogScore: "Mini-Cog",
      lawtonScore: "Lawton IADL",
      interpretationStatus: "Interpretation status",
      submissionReadiness: "Result readiness",
      ready: "Ready to view on-screen results",
      needsRequired: "Required fields needed",
      privacyReminder: "On-screen only. Not saved. Not sent to dashboard.",
    },
    result: {
      title: "On-Screen Result",
      miniCogTotal: "Mini-Cog total",
      lawtonSummary: "Lawton summary",
      interpretation: "Interpretation",
      referralGuidance: "Referral / next action",
      caregiverSummary: "Plain-language summary",
      difficultySummary: "Daily tasks to mention to a doctor",
      noDifficulties:
        "No dependent Lawton IADL tasks were marked in this screening.",
      print: "Print this page",
      screenshotNote:
        "You may take a screenshot or print this page. DementiAware does not save this caregiver result.",
    },
    interpretationLabels: {
      "Further medical evaluation recommended":
        "Further medical evaluation recommended",
      "Low risk of cognitive impairment": "Low risk of cognitive impairment",
    },
    interpretationLabelsFil: {
      "Further medical evaluation recommended":
        "Kinakailangan ng karagdagang pagsusuri ng doktor",
      "Low risk of cognitive impairment": "Mababang panganib sa pagkaulianin",
    },
    referral: {
      "Further medical evaluation recommended":
        "Schedule an appointment with a Neurologist or Geriatrician. Take a screenshot or print this page to show them.",
      "Low risk of cognitive impairment":
        "Retake after a few weeks if necessary.",
    },
    summaryBoxTitle: "Daily task summary",
    summaryBoxDescription:
      "A clean bulleted checklist summarizing what specific daily tasks the patient struggles with.",
    submit: {
      title: "View Private On-Screen Results",
      description:
        "This button calculates the result on this page only. No API call, database save, local storage, or dashboard submission is performed.",
      button: "View Results",
      viewed: "Results are displayed below. They remain on this screen only.",
    },
  },
  fil: {
    page: {
      eyebrow: "Family Member / Caregiver track",
      title: "Family / Caregiver Assessment",
      intro:
        "Guided home-based screening flow para sa pamilya, guardians, at caregivers na gustong magkaroon ng pribadong unang pagtingin sa memory at daily-function concerns.",
      privacyTitle: "Privacy-first public screening",
      privacyNotice:
        "Ang resulta ay pinoproseso agad at ipinapakita lamang sa screen na ito. Hindi ito sine-save sa database at hindi kailanman ipinapadala sa restricted clinical dashboard.",
      backHome: "Bumalik sa home",
    },
    demographics: {
      title: "Pinasimpleng Demographic Profile",
      description:
        "Gumamit ng nickname o initials para mapanatili ang privacy sa public browser na ito.",
      patientInitialOrNickname: "Inisyal o Palayaw ng Pasyente",
      patientAge: "Edad ng Pasyente",
      patientSex: "Kasarian ng Pasyente",
      male: "Lalaki",
      female: "Babae",
      relationshipToPatient: "Relasyon Mo sa Pasyente",
      relationshipPlaceholder: "Piliin ang relasyon",
      relationshipOptions: {
        spouse: "Asawa",
        child: "Anak",
        sibling: "Kapatid",
        "professional-caregiver": "Professional Caregiver",
        "other-family-member": "Iba pang kamag-anak",
        other: "Iba",
      },
    },
    miniCog: {
      title: "Mini-Cog Assessment",
      description:
        "Ang Mini-Cog ay gumagamit ng 3-word registration, clock drawing, at 3-word recall para sa total na 5 points.",
      stepOne: "Hakbang 1: Pagrehistro sa Tatlong Salita",
      stepOneHelp:
        "Pakisuyong makinig nang mabuti. May sasabihin akong tatlong salitang nais kong ulitin ninyo sa akin ngayon at subukang tandaan.",
      wordListVersion: "Word-list version",
      wordLists: {
        "version-a": {
          label: "Word List A",
          words: ["Saging", "Umaga", "Upuan"],
        },
        "version-b": {
          label: "Word List B",
          words: ["Pinuno", "Panahon", "Mesa"],
        },
        "version-c": {
          label: "Word List C",
          words: ["Nayon", "Kusina", "Sanggol"],
        },
      },
      stepTwo: "Hakbang 2: Pagguhit ng Orasan",
      stepTwoHelp:
        "Sunod, nais kong gumuhit ka ng orasan para sa akin. Una, ilagay ang lahat ng numero kung saan dapat nakapwesto ang mga ito. Ngayon, ilagay ang mga kamay sa 10 minuto makalipas ang 11.",
      normalClock: "Normal na orasan",
      abnormalClock: "Hindi normal na orasan",
      stepThree: "Hakbang 3: Pag-alala sa Tatlong Salita",
      stepThreeHelp: "Ano ang tatlong salitang sinabi kong tandaan mo?",
      recalled: "Tamang naalala",
      scoreGuideTitle: "Gabay sa puntos ng Mini-Cog",
      scoreGuide: {
        wordRecall:
          "Pag-alala sa Salita: 0-3 puntos. 1 puntos para sa bawat salitang kusang naalala nang hindi binibigyan ng palatandaan.",
        clockDraw:
          "Pagguhit ng Orasan: 0 o 2 puntos. Ang normal na orasan ay may lahat ng numero sa wastong pagkakasunod-sunod at humigit-kumulang tamang posisyon. Ang mga kamay ay nakaturo sa 11 at 2.",
        total:
          "Kabuuang Puntos: 0-5 puntos. Ang cut point na 3 ay napatotohanan para sa dementia screening. Kung nais ng higit pang sensitivity, maaaring gamitin ang cut point na 4.",
      },
    },
    lawton: {
      title: "Lawton IADL",
      description:
        "I-score batay sa aktwal na performance sa nakaraang 24-48 oras. Magbigay ng 1 kung fully independent; 0 kung kailangan ng tulong, prompting, o supervision.",
      independent: "Independent",
      dependent: "Dependent",
      maleScoringNote:
        "Para sa men, hanggang 5 items ang scored sa version na ito upang maiwasan ang gender bias sa provided material. Nakikita pa rin ang lahat ng 8 categories para mapag-usapan.",
      femaleScoringNote:
        "Para sa women, lahat ng 8 categories ay kasama sa score.",
      instructions: [
        "Mag-obserba o Magtanong: Suriin ang pasyente sa pamamagitan ng pagmamasid sa kanilang kilos o pagtatanong sa kanila, sa pamilya, o sa kanilang tagapag-alaga.",
        "Ibase sa Kasalukuyang Kakayahan: Bigyan ng marka ang pasyente ayon sa aktwal nilang ginawa sa nakalipas na 24 hanggang 48 oras, hindi sa kung ano ang kaya lang nilang gawin.",
        "Maging Mahigpit sa Pagpuntos: Magbigay ng 1 puntos KUNG KAYA LANG nilang gawin ang buong aktibidad nang mag-isa. Magbigay ng 0 puntos kung kailangan nila ng anumang tulong, gabay, o paalala mula sa ibang tao.",
      ],
      items: {
        telephone: "Kakayahang Gumamit ng Telepono",
        shopping: "Kakayahang Mamili",
        foodPreparation: "Kakayahang Maghanda ng Pagkain",
        housekeeping: "Kakayahang Gumawa ng Gawaing Bahay",
        laundry: "Kakayahang Maglaba",
        transportation: "Kakayahang Paglalakbay",
        medications: "Pangangasiwa sa Pansariling Medikasyon",
        finances: "Kakayahang Mangasiwa ng mga Gastusin",
      },
    },
    summary: {
      title: "Live Score Summary",
      demographicStatus: "Demographic completion",
      complete: "Complete",
      incomplete: "Incomplete",
      miniCogScore: "Mini-Cog",
      lawtonScore: "Lawton IADL",
      interpretationStatus: "Interpretation status",
      submissionReadiness: "Result readiness",
      ready: "Ready to view on-screen results",
      needsRequired: "Kailangan pa ang required fields",
      privacyReminder:
        "Sa screen lang. Hindi sine-save. Hindi pinapadala sa dashboard.",
    },
    result: {
      title: "On-Screen Result",
      miniCogTotal: "Mini-Cog total",
      lawtonSummary: "Lawton summary",
      interpretation: "Interpretation",
      referralGuidance: "Referral / next action",
      caregiverSummary: "Plain-language summary",
      difficultySummary: "Daily tasks na puwedeng banggitin sa doktor",
      noDifficulties:
        "Walang dependent Lawton IADL tasks na namarkahan sa screening na ito.",
      print: "I-print ang page na ito",
      screenshotNote:
        "Maaari kang kumuha ng screenshot o i-print ang page na ito. Hindi sine-save ng DementiAware ang caregiver result.",
    },
    interpretationLabels: {
      "Further medical evaluation recommended":
        "Kinakailangan ng karagdagang pagsusuri ng doktor",
      "Low risk of cognitive impairment": "Mababang panganib sa pagkaulianin",
    },
    interpretationLabelsEn: {
      "Further medical evaluation recommended":
        "Further medical evaluation recommended",
      "Low risk of cognitive impairment": "Low risk of cognitive impairment",
    },
    referral: {
      "Further medical evaluation recommended":
        "Mag-iskedyul ng patingin sa isang Neurologist o Geriatrician. Kuhanan ng larawan screenshot o i-print ang pahinang ito para ipakita sa doktor.",
      "Low risk of cognitive impairment":
        "Ulitin ang test pagkalipas ng ilang linggo kung kinakailangan.",
    },
    summaryBoxTitle: "Buod ng araw-araw na gawain",
    summaryBoxDescription:
      "Isang malinis na bulleted checklist ng mga partikular na gawaing nahihirapan ang pasyente.",
    submit: {
      title: "Tingnan ang Private On-Screen Results",
      description:
        "Kinakalkula ng button na ito ang resulta sa page na ito lamang. Walang API call, database save, local storage, o dashboard submission.",
      button: "View Results",
      viewed: "Nasa ibaba ang resulta. Nananatili ito sa screen na ito lamang.",
    },
  },
} as const satisfies Record<Language, Record<string, unknown>>;

export type CaregiverCopy = (typeof caregiverCopy)[Language];
