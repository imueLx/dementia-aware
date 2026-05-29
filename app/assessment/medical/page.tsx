"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DemographicForm } from "@/components/assessment/medical/demographic-form";
import { KatzSection } from "@/components/assessment/medical/katz-section";
import { MocaSection } from "@/components/assessment/medical/moca-section";
import { ScoreSummary } from "@/components/assessment/medical/score-summary";
import { SubmitBar } from "@/components/assessment/medical/submit-bar";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { useCopy } from "@/lib/i18n/use-copy";
import type { MedicalCopy } from "@/constants/i18n/medical";
import { computeMedicalAssessmentTotals } from "@/lib/assessment/medical-scoring";
import {
  medicalAssessmentSchema,
  type MedicalAssessmentSchemaValues,
} from "@/lib/assessment/medical-schema";
import {
  katzItems,
  mocaDomainDefinitions,
  type MedicalAssessmentFormValues,
} from "@/lib/assessment/medical-types";
import { submitMedicalAssessmentAction } from "./actions";

type PartialMedicalAssessmentValues = {
  demographics?: Partial<MedicalAssessmentSchemaValues["demographics"]>;
  moca?: Partial<MedicalAssessmentFormValues["moca"]>;
  katz?: Partial<MedicalAssessmentFormValues["katz"]>;
};

type GuideItem = {
  title: string;
  administration: string;
  scoring: string;
};

type KatzGuideItem = {
  activity: string;
  independent: string;
  dependent: string;
};

type InterpretationRow = {
  mocaScore: string;
  katzScore: string;
  interpretation: string;
  action: string;
};

function createDefaultMocaValues() {
  return mocaDomainDefinitions.reduce(
    (domains, domain) => {
      domains[domain.id] = {
        items: domain.items.reduce(
          (items, item) => {
            items[item.id] = 0;
            return items;
          },
          {} as Record<string, number>,
        ),
      };

      return domains;
    },
    {} as MedicalAssessmentFormValues["moca"],
  );
}

function createDefaultKatzValues() {
  return katzItems.reduce(
    (items, item) => {
      items[item.id] = "dependent";
      return items;
    },
    {} as MedicalAssessmentFormValues["katz"],
  );
}

function normalizeForScoring(
  values: PartialMedicalAssessmentValues,
): MedicalAssessmentFormValues {
  const watchedMoca = values.moca as
    | Partial<MedicalAssessmentFormValues["moca"]>
    | undefined;
  const watchedKatz = values.katz as
    | Partial<MedicalAssessmentFormValues["katz"]>
    | undefined;

  return {
    demographics: {
      patientId: values.demographics?.patientId ?? "",
      fullName: values.demographics?.fullName ?? "",
      age: Number(values.demographics?.age) || 0,
      sexAtBirth: values.demographics?.sexAtBirth ?? "male",
      educationYears: values.demographics?.educationYears ?? "17-plus",
      clinicianNameOrId: values.demographics?.clinicianNameOrId ?? "",
    },
    moca: {
      ...createDefaultMocaValues(),
      ...watchedMoca,
    },
    katz: {
      ...createDefaultKatzValues(),
      ...watchedKatz,
    },
  };
}

function hasRequiredDemographics(values: PartialMedicalAssessmentValues) {
  return Boolean(
    values.demographics?.patientId &&
    values.demographics?.age &&
    values.demographics?.sexAtBirth &&
    values.demographics?.educationYears &&
    values.demographics?.clinicianNameOrId,
  );
}

const mocaGuideItems: GuideItem[] = [
  {
    title: "1. Alternating Trail Making",
    administration:
      "Ask the subject to connect numbers and letters in order: 1-A-2-B-3-C-4-D-5-E.",
    scoring:
      "1 point for a correct alternating sequence with no crossing lines; otherwise 0.",
  },
  {
    title: "2. Cube Copy",
    administration:
      "Ask the subject to copy the cube as accurately as possible.",
    scoring:
      "1 point only if the drawing is three-dimensional, complete, parallel where expected, and without extra lines.",
  },
  {
    title: "3. Clock Drawing",
    administration:
      "Ask the subject to draw a clock, place all the numbers, and set the time to 10 past 11.",
    scoring:
      "1 point each for contour, numbers, and hands. All three elements must meet the criteria for credit.",
  },
  {
    title: "4. Naming",
    administration: "Point to each animal and ask the subject to name it.",
    scoring: "1 point each for lion, rhinoceros/rhino, and camel/dromedary.",
  },
  {
    title: "5. Memory",
    administration:
      "Read the five-word list once, then repeat it after the subject recalls, and read it again for Trial Two.",
    scoring:
      "No points for the learning trials. Use them to observe immediate recall and encoding.",
  },
  {
    title: "6. Attention",
    administration:
      "Test forward digit span, backward digit span, vigilance to the letter A, and serial 7s.",
    scoring:
      "Award points for correct spans, 1 point for the vigilance task with zero to one errors, and up to 3 points for serial 7s.",
  },
  {
    title: "7. Sentence Repetition",
    administration: "Ask the subject to repeat each sentence exactly as read.",
    scoring:
      "1 point for each sentence repeated exactly, with no omissions, substitutions, or additions.",
  },
  {
    title: "8. Verbal Fluency",
    administration:
      "Ask for as many words as possible beginning with F in 60 seconds, excluding proper nouns, numbers, and word variants.",
    scoring: "1 point if the subject generates 11 or more valid words.",
  },
  {
    title: "9. Abstraction",
    administration:
      "Ask how a train and bicycle are alike, then how a ruler and watch are alike.",
    scoring:
      "Only the last two pairs are scored. Give 1 point for each correct abstract similarity.",
  },
  {
    title: "10. Delayed Recall",
    administration:
      "After earlier learning, ask the subject to recall the five words again.",
    scoring:
      "1 point for each word freely recalled without cues. Cued recall is for clinical interpretation only.",
  },
  {
    title: "11. Orientation",
    administration:
      "Ask for the date and the exact place, prompting for year, month, date, day, and location if needed.",
    scoring:
      "1 point for each correctly answered orientation item. Exact responses are required.",
  },
];

const katzGuideItems: KatzGuideItem[] = [
  {
    activity: "Bathing / Pagligo",
    independent: "Washes the whole body without help.",
    dependent: "Needs help washing the body.",
  },
  {
    activity: "Dressing / Pagbihis",
    independent: "Gets and puts on clothes without assistance.",
    dependent: "Cannot dress without help.",
  },
  {
    activity: "Toileting / Paggamit ng Kubeta",
    independent: "Can go to the toilet, sit, and clean up independently.",
    dependent: "Needs help getting to the toilet or cleaning afterward.",
  },
  {
    activity: "Transferring / Paglipat ng Puwesto",
    independent: "Can get up from bed or stand from a chair alone.",
    dependent: "Needs help to reposition or transfer.",
  },
  {
    activity: "Continence / Pagpigil sa Pagdumi-Pag-ihi",
    independent: "Has full control of urine and stool.",
    dependent: "Often incontinent or needs continence support.",
  },
  {
    activity: "Feeding / Pagkain",
    independent: "Feeds self from a plate without help.",
    dependent: "Needs to be fed or tube-fed.",
  },
];

const interpretationRows: InterpretationRow[] = [
  {
    mocaScore: "21 to 30 / 21 hanggang 30 (Normal)",
    katzScore: "6 / 6 (Fully Independent / Ganap na Malaya)",
    interpretation: "Healthy Aging / Malusog na Pagtanda",
    action:
      "Cognitively intact and completely physically independent / Malinaw ang isip at kayang-kaya ang lahat ng pisikal na gawain nang mag-isa. Routine monitoring, re-screen yearly or if new complaints arise / Karaniwang pagsubaybay at ulitin ang screening taon-taon o kung may bagong mapuna.",
  },
  {
    mocaScore: "21 to 30 / 21 hanggang 30 (Normal)",
    katzScore: "3 to 5 (Moderate Impairment / Bahagyang May Kahirapan)",
    interpretation:
      "Isolated Physical Deconditioning / Pisikal na Panghihina Lamang",
    action:
      "Intact mental clarity but struggles with specific physical tasks / Malinaw at normal ang isip, ngunit nahihirapan sa ilang pisikal na kilos. Refer to PT or OT and assess the home for fall risk / I-refer sa Physical Therapist o Occupational Therapist at suriin ang bahay.",
  },
  {
    mocaScore: "21 to 30 / 21 hanggang 30 (Normal)",
    katzScore: "2 or less (Severe Impairment / Malalang Kahirapan)",
    interpretation:
      "Severe Physical Disability / Malalang Kapansanan sa Pisikal",
    action:
      "Preserved cognitive function alongside profound physical dependence / Normal ang takbo ng isip ngunit lubos na umaasa sa iba para sa pisikal na pangangailangan. Refer to home health care services or social worker and prepare assistive devices / I-refer sa home health care services o social worker at maghanda ng assistive device.",
  },
  {
    mocaScore: "20 or below / 20 o mas mababa (Impaired / May Kakulangan)",
    katzScore: "6 / 6 (Fully Independent / Ganap na Malaya)",
    interpretation:
      "Early Cognitive Decline / Mild MCI / Maagang Senyales ng Pagkaulyanin / MCI",
    action:
      "Meets DOST-PCHRD criteria for probable cognitive impairment, but retains independent physical functioning / Pasok sa DOST-PCHRD criteria ng maagang paghina ng isip, ngunit kaya pa ang pisikal na pag-aalaga sa sarili. Refer to a neurologist or geriatric psychiatrist and order baseline labs / I-refer sa neurologist o geriatric psychiatrist at magpasuri ng dugo.",
  },
  {
    mocaScore: "20 or below / 20 o mas mababa (Impaired / May Kakulangan)",
    katzScore: "3 to 5 (Moderate Impairment / Bahagyang May Kahirapan)",
    interpretation:
      "Cognitive Decline with Functional Deficits / Pagkaulyanin na May Epekto sa Kilos",
    action:
      "Signs of dementia or progressing Alzheimer’s beginning to interfere with safe, independent daily self-care / May senyales ng Alzheimer's o dementia na nagsisimula nang makagulo sa ligtas at malayang pag-aalaga sa sarili. Refer to a geriatrician and engage OT for structured routines / I-refer sa geriatrician at kumonsulta sa OT.",
  },
  {
    mocaScore: "20 or below / 20 o mas mababa (Impaired / May Kakulangan)",
    katzScore: "2 or less (Severe Impairment / Malalang Kahirapan)",
    interpretation:
      "Advanced Neurodegenerative State / Malalang Paghina ng Isip at Katawan",
    action:
      "Severe co-occurring cognitive decline and total dependency across basic survival tasks / Magkasabay na malalang pagkaulyanin at kawalan ng kakayahang kumilos o mabuhay nang walang nag-aalaga. Immediate referral to a multidisciplinary geriatric palliative team or memory care institution / Agarang i-refer sa multidisciplinary geriatric palliative team o memory care facility.",
  },
];

function GuideCard({ item }: { item: GuideItem }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <h3 className="text-base font-bold text-slate-950">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        <span className="font-semibold text-slate-900">Administration:</span>{" "}
        {item.administration}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        <span className="font-semibold text-slate-900">Scoring:</span>{" "}
        {item.scoring}
      </p>
    </article>
  );
}

function KatzGuideCard({ item }: { item: KatzGuideItem }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-bold text-slate-950">{item.activity}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-emerald-50 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Independent = 1
          </p>
          <p className="mt-2 text-sm leading-6 text-emerald-950">
            {item.independent}
          </p>
        </div>
        <div className="rounded-2xl bg-amber-50 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
            Dependent = 0
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-950">
            {item.dependent}
          </p>
        </div>
      </div>
    </article>
  );
}

function InterpretationCard({ item }: { item: InterpretationRow }) {
  return (
    <article className="rounded-[1.5rem] border border-purple-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-700">
            MoCA-P Score / Isip-Cognitive
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-950">
            {item.mocaScore}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-700">
            Katz Score / Pisikal-Physical ADLs
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-950">
            {item.katzScore}
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Overall Clinical Interpretation / Interpretasyon sa Kalagayan ng
            Pasyente
          </p>
          <p className="mt-1 text-base font-bold text-slate-950">
            {item.interpretation}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Action & Recommended Referral / Rekomendasyon at Aksyon / Referral
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{item.action}</p>
        </div>
      </div>
    </article>
  );
}

const dialogFocusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function MocaGuideButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedElement.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          dialogFocusableSelector,
        ),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);

      if (previouslyFocusedElement.current instanceof HTMLElement) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isOpen]);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 w-14 sm:bottom-6 sm:right-6 sm:w-[min(18rem,calc(100vw-2.5rem))]">
        <button
          type="button"
          onClick={() => {
            setZoomLevel(1);
            setIsOpen(true);
          }}
          aria-label="Open MOCA-P guide"
          className="group block w-14 overflow-hidden rounded-[1.4rem] border border-purple-200 bg-white text-left shadow-[0_18px_50px_rgba(15,23,42,0.16)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4 sm:w-full"
        >
          <div className="flex h-14 items-center justify-center bg-purple-700 text-white sm:hidden">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
              <path d="M14 3v5h5" />
              <path d="M9 13h6" />
              <path d="M9 16h4" />
            </svg>
            <span className="sr-only">Open MOCA-P guide</span>
          </div>

          <div className="hidden sm:block">
            <div className="relative aspect-[4/3] w-full bg-slate-100">
              <Image
                src="/Moca-guide-english.jpg"
                alt="MOCA-P guide preview"
                fill
                sizes="(max-width: 640px) calc(100vw - 2rem), 18rem"
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-3">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/85">
                  Guide MOCA-p
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm font-bold text-slate-950">
                  Quick reference
                </p>
                <p className="text-xs leading-5 text-slate-600">
                  Tap to open the full guide.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-purple-700 px-3 py-1 text-xs font-bold text-white">
                Open
              </span>
            </div>
          </div>
        </button>
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="moca-guide-title"
            className="mx-auto flex max-h-[94svh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-2xl sm:rounded-[1.75rem]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-700">
                  Professional assessment aid
                </p>
                <h2
                  id="moca-guide-title"
                  className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl"
                >
                  MoCA and Katz Guide
                </h2>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">Zoom</span>
                  <button
                    type="button"
                    onClick={() =>
                      setZoomLevel((current) =>
                        Math.max(1, +(current - 0.25).toFixed(2)),
                      )
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-bold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                    aria-label="Zoom out"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                    aria-label="Reset zoom"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setZoomLevel((current) =>
                        Math.min(2.5, +(current + 0.25).toFixed(2)),
                      )
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-bold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close assessment guide"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-purple-200 text-xl text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
              >
                <span aria-hidden="true">x</span>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-3 sm:p-6">
              <div className="mx-auto grid w-full max-w-6xl gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-700">
                      MoCA quick reference
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-slate-950 sm:text-xl">
                      Montreal Cognitive Assessment overview
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Rapid screening for mild cognitive dysfunction. It covers
                      attention, executive function, memory, language,
                      visuoconstruction, conceptual thinking, calculations, and
                      orientation. Total score is 30, and 26 or above is
                      considered normal. Add 1 point when education is 12 years
                      or fewer.
                    </p>
                  </div>

                  <div className="border-b border-slate-200 bg-slate-50 p-4 sm:p-6">
                    <div className="mx-auto max-w-3xl overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
                      <div
                        className="relative aspect-[8.5/11] bg-white"
                        style={{
                          width: `${zoomLevel * 100}%`,
                          touchAction: "pan-x pan-y pinch-zoom",
                        }}
                      >
                        <Image
                          src="/Moca-guide-english.jpg"
                          alt="MOCA administration guide"
                          fill
                          priority
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 60vw"
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Pinch to zoom on mobile. Use the zoom controls above for
                      desktop and touchpad navigation.
                    </p>
                  </div>

                  <div className="grid gap-4 p-4 sm:p-6">
                    {mocaGuideItems.map((item) => (
                      <GuideCard key={item.title} item={item} />
                    ))}
                  </div>
                </section>

                <aside className="grid gap-6">
                  <section className="rounded-[1.75rem] border border-purple-100 bg-white p-4 shadow-sm sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-700">
                      Katz ADL guide
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-slate-950 sm:text-xl">
                      Scoring instructions
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Observe the patient or interview the patient, family, or
                      caregiver. Score based on actual performance in the last
                      24 to 48 hours, not capacity. Give 1 point only when the
                      activity is completed fully independently; give 0 for any
                      help, supervision, or verbal prompting.
                    </p>
                    <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                      <span className="font-semibold text-slate-900">
                        Tagalog summary:
                      </span>{" "}
                      Mag-obserba o magtanong. Ibase sa aktwal na nagawa sa
                      nakalipas na 24 hanggang 48 oras. 1 puntos lang kung
                      mag-isa nilang nagagawa ang buong gawain; 0 kung may
                      anumang tulong o gabay.
                    </p>
                  </section>

                  <section className="grid gap-4">
                    {katzGuideItems.map((item) => (
                      <KatzGuideCard key={item.activity} item={item} />
                    ))}
                  </section>

                  <section className="rounded-[1.75rem] border border-emerald-100 bg-white p-4 shadow-sm sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                      MoCA-P and Katz ADLs Assessment Interpretation Guide
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-slate-950 sm:text-xl">
                      English / Filipino combined guidance
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Use the MoCA-P cognitive score together with the Katz ADL
                      physical score to interpret the patient’s overall status
                      and choose the proper referral path.
                    </p>
                  </section>

                  <section className="grid gap-4">
                    {interpretationRows.map((item) => (
                      <InterpretationCard
                        key={`${item.mocaScore}-${item.katzScore}`}
                        item={item}
                      />
                    ))}
                  </section>
                </aside>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function MedicalAssessmentPage() {
  const copy = useCopy("medical") as MedicalCopy;
  const router = useRouter();
  const [assessmentDate] = useState(() => new Date().toISOString());
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<MedicalAssessmentSchemaValues>({
    resolver: zodResolver(medicalAssessmentSchema),
    mode: "onSubmit",
    defaultValues: {
      demographics: {
        patientId: "",
        fullName: "",
        clinicianNameOrId: "",
      },
      moca: createDefaultMocaValues(),
      katz: createDefaultKatzValues(),
    },
  });

  const watchedValues = useWatch({ control: methods.control });
  const partialWatchedValues = watchedValues as PartialMedicalAssessmentValues;

  const scoringValues = useMemo(
    () => normalizeForScoring(partialWatchedValues),
    [partialWatchedValues],
  );
  const totals = useMemo(
    () => computeMedicalAssessmentTotals(scoringValues),
    [scoringValues],
  );
  const isDemographicsComplete = hasRequiredDemographics(partialWatchedValues);

  const handleValidSubmit = async (values: MedicalAssessmentSchemaValues) => {
    setSubmitError(null);
    const result = await submitMedicalAssessmentAction(values, assessmentDate);

    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }

    router.push(`/assessment/medical/results?id=${result.recordId}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <MocaGuideButton />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full border border-purple-200 bg-white px-4 text-sm font-bold text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
          >
            {copy.page.backHome}
          </Link>
          <LanguageToggle />
        </div>

        <header className="mt-8 rounded-[2rem] border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-purple-700">
            {copy.page.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            {copy.page.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
            {copy.page.intro}
          </p>
          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-4 text-sm font-semibold leading-6 text-purple-900">
            {copy.page.professionalNote}
          </div>
        </header>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleValidSubmit)}
            className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]"
          >
            <div className="grid gap-8">
              <DemographicForm copy={copy.demographics} />
              <MocaSection copy={copy.moca} />
              <KatzSection copy={copy.katz} />
              {submitError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
                  {submitError}
                </div>
              ) : null}
              <SubmitBar
                copy={copy.submit}
                isSubmitted={false}
                isSubmitting={methods.formState.isSubmitting}
              />
            </div>

            <ScoreSummary
              copy={copy.summary}
              totals={totals}
              assessmentDate={assessmentDate}
              isDemographicsComplete={isDemographicsComplete}
            />
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
