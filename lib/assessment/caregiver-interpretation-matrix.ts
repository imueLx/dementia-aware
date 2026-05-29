import type {
  CaregiverInterpretation,
  CaregiverInterpretationLabel,
  LawtonScoreResult,
} from "./family-types";

export type CaregiverMatrixMiniCogBand = "low" | "high";

export type CaregiverMatrixFunctionalBand = "full" | "partial" | "severe";

export type CaregiverMatrixRow = {
  miniCogBand: CaregiverMatrixMiniCogBand;
  functionalBand: CaregiverMatrixFunctionalBand;
  matrixInterpretation: string;
  matrixInterpretationFil: string;
  summaryLabel: CaregiverInterpretationLabel;
  action: string;
  actionFil: string;
};

/** PDF: 3–5 points = low risk; 0–2 = high risk */
export function resolveMiniCogRiskBand(
  miniCogTotal: number,
): CaregiverMatrixMiniCogBand {
  return miniCogTotal >= 3 ? "low" : "high";
}

/** PDF: full score vs struggles with 2–4 vs 5+ tasks (on sex-scored items). */
export function resolveLawtonFunctionalBand(
  lawton: Pick<LawtonScoreResult, "total" | "maxScore">,
): CaregiverMatrixFunctionalBand {
  const dependentCount = lawton.maxScore - lawton.total;

  if (dependentCount <= 1) {
    return "full";
  }

  if (dependentCount >= 5) {
    return "severe";
  }

  return "partial";
}

/** Source: guidelines-dementiaware.pdf — Mini-Cog & Lawton IADL Integrated Interpretation Matrix */
export const CAREGIVER_INTERPRETATION_MATRIX_ROWS: CaregiverMatrixRow[] = [
  {
    miniCogBand: "low",
    functionalBand: "full",
    matrixInterpretation:
      "Low Risk / Independent: No current indicators of major memory problems; fully capable of managing complex daily tasks independently.",
    matrixInterpretationFil:
      "Mababang Panganib / Malaya: Walang nakikitang malaking problema sa memorya sa ngayon; kayang-kaya mag-isa ang mga gawaing-bahay at personal na buhay.",
    summaryLabel: "Low risk of cognitive impairment",
    action:
      "Home Monitoring: Encourage healthy aging habits. Re-screen in 12 months, or sooner if the family notices sudden behavioral changes.",
    actionFil:
      "Karaniwang Pagsubaybay: Ipagpatuloy ang malusog na pamumuhay. Ulitin ang test paglipas ng isang taon, o mas maaga kung may mapansing biglang pagbabago.",
  },
  {
    miniCogBand: "low",
    functionalBand: "partial",
    matrixInterpretation:
      "Isolated Functional Support Need: Mental clarity appears steady, but the patient struggles with specific independent daily tasks.",
    matrixInterpretationFil:
      "Kailangan ng Tulong sa Gawaing-Bahay: Maayos ang takbo ng isip, ngunit nahihirapan sa ilang partikular na gawain.",
    summaryLabel: "Low risk of cognitive impairment",
    action:
      "Home Safety & Task Assistance: Assign a family member to supervise or assist with the difficult tasks. Schedule a routine check-up with a Family Physician to rule out general physical weakness or joint pain.",
    actionFil:
      "Pag-alalay at Kaligtasan sa Bahay: Magtalaga ng kapamilya na tutulong sa mga gawaing nahihirapan siya. Dalhin sa Family Doctor para masuri kung may panlalata o pananakit ng kasukasuan.",
  },
  {
    miniCogBand: "low",
    functionalBand: "severe",
    matrixInterpretation:
      "Severe Physical/Functional Limitations: Cognitive skills test within the low-risk range, but the patient has a severe loss of independent capabilities due to heavy physical limitations.",
    matrixInterpretationFil:
      "Malubhang Limitasyon sa Kilos: Maayos ang lagay ng isip base sa test, ngunit hindi na kayang kumilos mag-isa dahil sa malubhang pisikal na panghihina.",
    summaryLabel: "Low risk of cognitive impairment",
    action:
      "Primary Care Review & Caregiver Setup: Consult a Family Physician or General Internist immediately to address physical mobility or chronic illness. Organize persistent daily help at home to prevent accidents.",
    actionFil:
      "Konsulta sa Doktor at Pag-ayos ng Tagapag-alaga: Ipatingin agad sa Family Doctor o Internist para magamot ang pisikal na panghihina. Ayusin ang iskedyul ng pamilya para may laging kasama ang pasyente sa bahay.",
  },
  {
    miniCogBand: "high",
    functionalBand: "full",
    matrixInterpretation:
      "Early Cognitive Risk (High Alert): The test flags a high risk for memory or thinking problems, even though the patient is currently managing daily chores without making noticeable mistakes.",
    matrixInterpretationFil:
      "Maagang Panganib sa Memorya: Mataas ang babala na may problema sa memorya o pag-iisip, kahit na sa ngayon ay nagagawa pa naman niya ang mga gawaing-bahay nang walang mali.",
    summaryLabel: "Further medical evaluation recommended",
    action:
      "Specialist Diagnostic Evaluation: Schedule an appointment with a Neurologist or Geriatrician for a formal medical assessment. Do not wait for daily functioning to decline before seeking a professional opinion.",
    actionFil:
      "Patingin sa Espesyalistang Doktor: Magpa-iskedyul agad ng patingin sa isang Neurologist o Geriatrician para sa pormal na pagsusuri. Huwag nang hintaying hindi niya makuha ang mga gawaing-bahay bago magpakonsulta.",
  },
  {
    miniCogBand: "high",
    functionalBand: "partial",
    matrixInterpretation:
      "Cognitive Decline with Daily Struggles: High risk of progressive memory loss that is actively interfering with their ability to live safely and manage household responsibilities alone.",
    matrixInterpretationFil:
      "Pagkaulianin na may Kahirapan sa Gawain: Mataas ang posibilidad ng lumalalang pagkaulianin na kasalukuyan nang nakakaapekto sa ligtas at malayang pamumuhay mag-isa.",
    summaryLabel: "Further medical evaluation recommended",
    action:
      "Urgent Medical Workup & Safety Safeguards: Immediate referral to a Neurologist or Geriatrician. The family must step in immediately to take control of patient medications and financial management to prevent critical errors.",
    actionFil:
      "Agarang Patingin at Ligtas na Pamamahala: Ipatingin agad sa Neurologist o Geriatrician. Kailangan nang makialam ng pamilya sa pagpapainom ng gamot at paghawak ng pera ng pasyente.",
  },
  {
    miniCogBand: "high",
    functionalBand: "severe",
    matrixInterpretation:
      "Advanced Cognitive & Functional Decline: Indicators point toward an advanced state of confusion or memory loss paired with a complete loss of ability to manage daily living tasks without full support.",
    matrixInterpretationFil:
      "Malubhang Pagkaulianin at Panghihina: Malinaw ang mga senyales ng malubhang pagkalito o pagkawala ng memorya, kasabay ng tuluyang kawalan ng kakayahang mamuhay nang walang nag-aalaga.",
    summaryLabel: "Further medical evaluation recommended",
    action:
      "Comprehensive Geriatric Care & Family Support: Seek urgent guidance from a specialized Memory Clinic or Geriatric Medical Team. Establish round-the-clock family supervision, secure home safety modifications, and connect the primary family caregiver with community support groups to prevent psychological burnout.",
    actionFil:
      "Buong Alaga at Suporta sa Pamilya: Humingi ng agarang tulong sa isang Memory Clinic o pangkat ng mga Geriatrician. Magtalaga ng 24/7 na magbabantay at humanap ng suporta para sa nag-aalaga.",
  },
];

export function lookupCaregiverInterpretationMatrix(
  miniCogTotal: number,
  lawton: Pick<LawtonScoreResult, "total" | "maxScore">,
): CaregiverInterpretation {
  const miniCogBand = resolveMiniCogRiskBand(miniCogTotal);
  const functionalBand = resolveLawtonFunctionalBand(lawton);

  const row = CAREGIVER_INTERPRETATION_MATRIX_ROWS.find(
    (candidate) =>
      candidate.miniCogBand === miniCogBand &&
      candidate.functionalBand === functionalBand,
  );

  if (!row) {
    throw new Error(
      `No caregiver interpretation matrix row for miniCog=${miniCogBand}, lawton=${functionalBand}`,
    );
  }

  return {
    label: row.summaryLabel,
    matrixInterpretation: row.matrixInterpretation,
    filipinoLabel:
      row.summaryLabel === "Further medical evaluation recommended"
        ? "Kinakailangan ng karagdagang pagsusuri ng doktor"
        : "Mababang panganib sa pagkaulianin",
    matrixInterpretationFil: row.matrixInterpretationFil,
    referralGuidance: row.action,
    referralGuidanceFil: row.actionFil,
    plainLanguageSummary: row.matrixInterpretation,
  };
}
