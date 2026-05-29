"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { CaregiverCopy } from "@/constants/i18n/caregiver";
import { computeLawtonScore } from "@/lib/assessment/family-scoring";
import {
  lawtonItems,
  type LawtonFormValues,
  type LawtonItemId,
} from "@/lib/assessment/family-types";
import type { FamilyAssessmentSchemaValues } from "@/lib/assessment/family-schema";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/use-language";

type LawtonScaleOption = {
  id: string;
  label: string;
  score: 0 | 1;
};

type LawtonScaleCategory = {
  id: LawtonItemId;
  title: string;
  options: LawtonScaleOption[];
};

type LawtonScaleConfig = {
  helperText: string[];
  scoreLabel: string;
  totalLabel: string;
  maleNote: string;
  femaleNote: string;
  categories: LawtonScaleCategory[];
};

type MiniCogGuideConfig = {
  previewSrc: string;
  previewAlt: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  intro: string;
};

const dialogFocusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const lawtonScaleConfig: Record<"en" | "fil", LawtonScaleConfig> = {
  en: {
    helperText: [
      "Choose one option per category.",
      "Base the answer on the patient’s actual performance over the last 24 to 48 hours.",
      "Select the highest level the patient can reliably do.",
      "The score is calculated automatically.",
    ],
    scoreLabel: "Score",
    totalLabel: "Total score",
    maleNote:
      "Male total uses the original male guidance and counts only the scored categories included in the source guidance.",
    femaleNote:
      "Female total uses the full original scale and counts all 8 categories.",
    categories: [
      {
        id: "telephone",
        title: "Telephone",
        options: [
          {
            id: "telephone-1",
            label:
              "Operates telephone on own initiative, looks up and dials numbers.",
            score: 1,
          },
          {
            id: "telephone-2",
            label: "Dials a few well-known numbers.",
            score: 1,
          },
          {
            id: "telephone-3",
            label: "Answers telephone but does not dial.",
            score: 1,
          },
          {
            id: "telephone-4",
            label: "Does not use telephone at all.",
            score: 0,
          },
        ],
      },
      {
        id: "shopping",
        title: "Shopping",
        options: [
          {
            id: "shopping-1",
            label: "Takes care of all shopping needs independently.",
            score: 1,
          },
          {
            id: "shopping-2",
            label: "Shops independently for small purchases.",
            score: 0,
          },
          {
            id: "shopping-3",
            label: "Needs to be accompanied on any shopping trip.",
            score: 0,
          },
          { id: "shopping-4", label: "Completely unable to shop.", score: 0 },
        ],
      },
      {
        id: "foodPreparation",
        title: "Food Preparation",
        options: [
          {
            id: "foodPreparation-1",
            label: "Plans, prepares, and serves adequate meals independently.",
            score: 1,
          },
          {
            id: "foodPreparation-2",
            label: "Prepares adequate meals if supplied with ingredients.",
            score: 0,
          },
          {
            id: "foodPreparation-3",
            label:
              "Heats, serves, and prepares meals or prepares meals but does not maintain adequate diet.",
            score: 0,
          },
          {
            id: "foodPreparation-4",
            label: "Needs to have meals prepared and served.",
            score: 0,
          },
        ],
      },
      {
        id: "housekeeping",
        title: "Housekeeping",
        options: [
          {
            id: "housekeeping-1",
            label: "Maintains house alone or with occasional assistance.",
            score: 1,
          },
          {
            id: "housekeeping-2",
            label:
              "Performs light daily tasks such as dishwashing or bed making.",
            score: 1,
          },
          {
            id: "housekeeping-3",
            label:
              "Performs light daily tasks but cannot maintain acceptable cleanliness.",
            score: 1,
          },
          {
            id: "housekeeping-4",
            label: "Needs help with all home maintenance tasks.",
            score: 1,
          },
          {
            id: "housekeeping-5",
            label: "Does not participate in any housekeeping tasks.",
            score: 0,
          },
        ],
      },
      {
        id: "laundry",
        title: "Laundry",
        options: [
          {
            id: "laundry-1",
            label: "Does personal laundry completely.",
            score: 1,
          },
          { id: "laundry-2", label: "Launders small items only.", score: 1 },
          {
            id: "laundry-3",
            label: "All laundry must be done by others.",
            score: 0,
          },
        ],
      },
      {
        id: "transportation",
        title: "Transportation",
        options: [
          {
            id: "transportation-1",
            label:
              "Travels independently on public transportation or drives own car.",
            score: 1,
          },
          {
            id: "transportation-2",
            label:
              "Arranges own travel via taxi but does not otherwise use public transportation.",
            score: 1,
          },
          {
            id: "transportation-3",
            label:
              "Travels on public transportation when accompanied by another.",
            score: 1,
          },
          {
            id: "transportation-4",
            label:
              "Travel limited to taxi or automobile with assistance of another.",
            score: 0,
          },
          {
            id: "transportation-5",
            label: "Does not travel at all.",
            score: 0,
          },
        ],
      },
      {
        id: "medications",
        title: "Medications",
        options: [
          {
            id: "medications-1",
            label:
              "Is responsible for taking medication in correct doses at correct time.",
            score: 1,
          },
          {
            id: "medications-2",
            label:
              "Takes responsibility if medication is prepared in advance in separate dosage.",
            score: 0,
          },
          {
            id: "medications-3",
            label: "Is not capable of dispensing own medication.",
            score: 0,
          },
        ],
      },
      {
        id: "finances",
        title: "Finances",
        options: [
          {
            id: "finances-1",
            label: "Manages financial matters independently.",
            score: 1,
          },
          {
            id: "finances-2",
            label:
              "Manages day-to-day purchases but needs help with banking or major purchases.",
            score: 1,
          },
          {
            id: "finances-3",
            label: "Is incapable of handling money.",
            score: 0,
          },
        ],
      },
    ],
  },
  fil: {
    helperText: [
      "Pumili ng isang opsyon sa bawat kategorya.",
      "Ibase ang sagot sa aktwal na performance ng pasyente sa nakalipas na 24 hanggang 48 oras.",
      "Piliin ang pinakamataas na antas na kaya niyang gawin nang maaasahan.",
      "Awtomatikong kinakalkula ang score.",
    ],
    scoreLabel: "Puntos",
    totalLabel: "Kabuuang puntos",
    maleNote:
      "Para sa men, ang total ay sumusunod sa original na male guidance at binibilang lamang ang mga scored categories sa source guidance.",
    femaleNote:
      "Para sa women, ginagamit ang buong original scale at binibilang ang lahat ng 8 categories.",
    categories: [
      {
        id: "telephone",
        title: "Telepono",
        options: [
          {
            id: "telephone-1",
            label:
              "Nagpapatakbo ng telepono sa sariling inisyatiba, naghahanap at nagdi-dial ng mga numero.",
            score: 1,
          },
          {
            id: "telephone-2",
            label: "Nagdi-dial ng ilang pamilyar na numero.",
            score: 1,
          },
          {
            id: "telephone-3",
            label: "Sumasagot ng telepono ngunit hindi nagdi-dial.",
            score: 1,
          },
          {
            id: "telephone-4",
            label: "Hindi gumagamit ng telepono kahit kailan.",
            score: 0,
          },
        ],
      },
      {
        id: "shopping",
        title: "Pamimili",
        options: [
          {
            id: "shopping-1",
            label:
              "Inaako ang lahat ng pangangailangan sa pamimili nang mag-isa.",
            score: 1,
          },
          {
            id: "shopping-2",
            label: "Namimili nang mag-isa para sa maliliit na bilihin.",
            score: 0,
          },
          {
            id: "shopping-3",
            label: "Kailangang samahan sa anumang pagpunta sa pamimili.",
            score: 0,
          },
          {
            id: "shopping-4",
            label: "Lubos na hindi kayang mamili.",
            score: 0,
          },
        ],
      },
      {
        id: "foodPreparation",
        title: "Paghahanda ng Pagkain",
        options: [
          {
            id: "foodPreparation-1",
            label:
              "Nagpaplano, naghahanda, at nagsisilbi ng sapat na pagkain nang mag-isa.",
            score: 1,
          },
          {
            id: "foodPreparation-2",
            label:
              "Nakahahanda ng sapat na pagkain kung may nakahandang sangkap.",
            score: 0,
          },
          {
            id: "foodPreparation-3",
            label:
              "Nagpapainit, naghahain, at naghahanda ng pagkain o naghahanda ng pagkain ngunit hindi napapanatili ang sapat na pagkain sa araw-araw.",
            score: 0,
          },
          {
            id: "foodPreparation-4",
            label: "Kailangang may nakahandang at naihahain nang pagkain.",
            score: 0,
          },
        ],
      },
      {
        id: "housekeeping",
        title: "Gawaing Bahay",
        options: [
          {
            id: "housekeeping-1",
            label:
              "Pinapanatiling maayos ang bahay nang mag-isa o may paminsan-minsang tulong.",
            score: 1,
          },
          {
            id: "housekeeping-2",
            label:
              "Gumagawa ng magaang araw-araw na gawain tulad ng paghuhugas ng pinggan o paggawa ng kama.",
            score: 1,
          },
          {
            id: "housekeeping-3",
            label:
              "Gumagawa ng magaang araw-araw na gawain ngunit hindi napapanatili ang maayos na kalinisan.",
            score: 1,
          },
          {
            id: "housekeeping-4",
            label:
              "Kailangan ng tulong sa lahat ng gawaing pang-maintenance sa bahay.",
            score: 1,
          },
          {
            id: "housekeeping-5",
            label: "Hindi nakikilahok sa anumang gawaing-bahay.",
            score: 0,
          },
        ],
      },
      {
        id: "laundry",
        title: "Paglalaba",
        options: [
          {
            id: "laundry-1",
            label: "Ganap na naglalaba ng sariling damit.",
            score: 1,
          },
          {
            id: "laundry-2",
            label: "Maliliit na damit lamang ang nalalabhan.",
            score: 1,
          },
          {
            id: "laundry-3",
            label: "Ang lahat ng labada ay kailangang gawin ng iba.",
            score: 0,
          },
        ],
      },
      {
        id: "transportation",
        title: "Paglalakbay",
        options: [
          {
            id: "transportation-1",
            label:
              "Nakalalakad o nakakasakay nang mag-isa sa pampublikong transportasyon o nagmamaneho ng sariling sasakyan.",
            score: 1,
          },
          {
            id: "transportation-2",
            label:
              "Kayang ayusin ang sariling biyahe sa taxi ngunit hindi gumagamit ng pampublikong transportasyon.",
            score: 1,
          },
          {
            id: "transportation-3",
            label:
              "Nakakasakay sa pampublikong transportasyon kapag may kasama.",
            score: 1,
          },
          {
            id: "transportation-4",
            label:
              "Limitado ang biyahe sa taxi o sasakyan na may tulong ng iba.",
            score: 0,
          },
          {
            id: "transportation-5",
            label: "Hindi na bumibiyahe kahit kailan.",
            score: 0,
          },
        ],
      },
      {
        id: "medications",
        title: "Medikasyon",
        options: [
          {
            id: "medications-1",
            label:
              "Siya ang responsable sa pag-inom ng gamot sa tamang dosis at tamang oras.",
            score: 1,
          },
          {
            id: "medications-2",
            label:
              "May pananagutan lamang kung ang gamot ay inihanda na nang maaga sa hiwa-hiwalay na dose.",
            score: 0,
          },
          {
            id: "medications-3",
            label: "Hindi kayang magbigay o maghanda ng sariling gamot.",
            score: 0,
          },
        ],
      },
      {
        id: "finances",
        title: "Gastusin",
        options: [
          {
            id: "finances-1",
            label: "Nakakapamahala ng usaping pinansyal nang mag-isa.",
            score: 1,
          },
          {
            id: "finances-2",
            label:
              "Nakakapamahala ng pang-araw-araw na pagbili ngunit kailangan ng tulong sa bangko o malalaking gastusin.",
            score: 1,
          },
          {
            id: "finances-3",
            label: "Hindi kayang humawak ng pera.",
            score: 0,
          },
        ],
      },
    ],
  },
};

function createDefaultLawtonSelections(categories: LawtonScaleCategory[]) {
  return categories.reduce<Record<string, string>>((selections, category) => {
    selections[category.id] =
      category.options.find((option) => option.score === 0)?.id ??
      category.options[0]?.id ??
      "";
    return selections;
  }, {});
}

function LawtonScaleCard({
  category,
  selectedOptionId,
  onSelect,
  disabled,
  scoreLabel,
}: {
  category: LawtonScaleCategory;
  selectedOptionId: string;
  onSelect: (categoryId: LawtonItemId, optionId: string) => void;
  disabled?: boolean;
  scoreLabel: string;
}) {
  return (
    <article
      className={`rounded-[1.75rem] border bg-white p-4 shadow-sm sm:p-5 ${
        disabled ? "border-slate-200 opacity-70" : "border-purple-100"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-950">{category.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Choose one statement that best matches the patient’s highest current
            functional level.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-800">
          {scoreLabel}:{" "}
          {disabled
            ? "-"
            : (category.options.find((option) => option.id === selectedOptionId)
                ?.score ?? 0)}
        </span>
      </div>

      {disabled ? (
        <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold leading-5 text-amber-900">
          This category is retained for audit trail but is not counted in the
          male total.
        </p>
      ) : null}

      <div className="mt-4 grid gap-3">
        {category.options.map((option) => {
          const isSelected = option.id === selectedOptionId;

          return (
            <div key={option.id} className="grid gap-2">
              <label
                className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                  isSelected
                    ? "border-purple-600 bg-purple-50"
                    : "border-slate-200 bg-slate-50 hover:border-purple-300 hover:bg-purple-50/70"
                } ${disabled ? "cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name={category.id}
                  value={option.id}
                  checked={isSelected}
                  disabled={disabled}
                  onChange={() => onSelect(category.id, option.id)}
                  className="mt-1 h-4 w-4 shrink-0 accent-purple-700"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-semibold leading-6 text-slate-900">
                      {option.label}
                    </span>
                    <span className="shrink-0 rounded-full bg-white px-2 py-1 text-xs font-bold text-slate-700 shadow-sm">
                      {option.score}
                    </span>
                  </div>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </article>
  );
}

const miniCogGuideConfig = {
  en: {
    imageSrc: "/mini-cog-english.jpg",
    imageAlt: "Mini-Cog screening guide in English",
    title: "Mini-Cog Guide",
    intro:
      "English guide for the Mini-Cog screening steps and score interpretation.",
  },
  fil: {
    imageSrc: "/mini-cog-tagalog.jpg",
    imageAlt: "Mini-Cog screening guide in Tagalog",
    title: "Mini-Cog Guide",
    intro:
      "Tagalog guide para sa mga hakbang at interpretasyon ng Mini-Cog screening.",
  },
} as const;

type LawtonSectionProps = {
  copy: CaregiverCopy;
};

export function LawtonSection({ copy }: LawtonSectionProps) {
  const { setValue } = useFormContext<FamilyAssessmentSchemaValues>();
  const { language } = useLanguage();
  const lawtonCopy = copy.lawton;
  const miniCogCopy = copy.miniCog;
  const lawtonGuideImage =
    language === "fil"
      ? {
          src: "/lawton-tagalog.jpg",
          alt: "Lawton IADL scoring guide in Tagalog",
        }
      : {
          src: "/lawton-english.jpg",
          alt: "Lawton IADL scoring guide in English",
        };
  const patientSex = useWatch<
    FamilyAssessmentSchemaValues,
    "demographics.patientSex"
  >({
    name: "demographics.patientSex",
  });
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isMiniCogZoomed, setIsMiniCogZoomed] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() =>
    createDefaultLawtonSelections(
      lawtonScaleConfig[language === "fil" ? "fil" : "en"].categories,
    ),
  );
  const guideDialogRef = useRef<HTMLDivElement>(null);
  const guideCloseButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<Element | null>(null);
  const miniCogGuide = miniCogGuideConfig[language === "fil" ? "fil" : "en"];
  const scaleConfig = lawtonScaleConfig[language === "fil" ? "fil" : "en"];
  const lawtonValues = useWatch<FamilyAssessmentSchemaValues, "lawton">({
    name: "lawton",
  }) as LawtonFormValues;
  const lawtonScore = computeLawtonScore(
    lawtonValues ?? ({} as LawtonFormValues),
    patientSex,
  );

  useEffect(() => {
    if (!isGuideOpen) {
      return;
    }

    previouslyFocusedElement.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      guideCloseButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsGuideOpen(false);
        return;
      }

      if (event.key !== "Tab" || !guideDialogRef.current) {
        return;
      }

      const focusableElements = Array.from(
        guideDialogRef.current.querySelectorAll<HTMLElement>(
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
  }, [isGuideOpen]);

  const handleLawtonSelection = (
    categoryId: LawtonItemId,
    optionId: string,
  ) => {
    const category = scaleConfig.categories.find(
      (item) => item.id === categoryId,
    );
    const option = category?.options.find((item) => item.id === optionId);

    if (!option) {
      return;
    }

    setSelectedOptions((currentSelections) => ({
      ...currentSelections,
      [categoryId]: optionId,
    }));

    setValue(
      `lawton.${categoryId}`,
      option.score === 1 ? "independent" : "dependent",
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  return (
    <section
      className="rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="lawton-heading"
    >
      <div className="fixed bottom-4 right-4 z-50 w-14 sm:bottom-6 sm:right-6 sm:w-[min(18rem,calc(100vw-2.5rem))]">
        <button
          type="button"
          onClick={() => {
            setIsImageZoomed(false);
            setIsGuideOpen(true);
          }}
          aria-label="Open Lawton IADL image guide"
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
              <path d="M4 6a2 2 0 0 1 2-2h5.5a2.5 2.5 0 0 1 2.5 2.5V20H6a2 2 0 0 1-2-2V6Z" />
              <path d="M20 6a2 2 0 0 0-2-2h-5.5a2.5 2.5 0 0 0-2.5 2.5V20h8a2 2 0 0 0 2-2V6Z" />
              <path d="M12 6v14" />
              <path d="M7 9h3" />
              <path d="M14 9h3" />
              <path d="M7 12h3" />
              <path d="M14 12h3" />
            </svg>
            <span className="sr-only">Open Lawton IADL image guide</span>
          </div>

          <div className="hidden sm:block">
            <div className="relative aspect-4/3 w-full bg-slate-100">
              <Image
                src={lawtonGuideImage.src}
                alt={lawtonGuideImage.alt}
                fill
                sizes="(max-width: 640px) calc(100vw - 2rem), 18rem"
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/80 via-slate-950/30 to-transparent p-3">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/85">
                  {language === "fil" ? "Tagalog" : "English"} Lawton image
                  guide
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm font-bold text-slate-950">
                  Quick image reference
                </p>
                <p className="text-xs leading-5 text-slate-600">Tap to open.</p>
              </div>
              <span className="shrink-0 rounded-full bg-purple-700 px-3 py-1 text-xs font-bold text-white">
                Open
              </span>
            </div>
          </div>
        </button>
      </div>

      {isGuideOpen ? (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsGuideOpen(false);
            }
          }}
        >
          <div
            ref={guideDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lawton-guide-title"
            className="mx-auto flex max-h-[94svh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:rounded-[1.75rem]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-700">
                  Family assessment aid
                </p>
                <h2
                  id="lawton-guide-title"
                  className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl"
                >
                  Lawton IADL image guide
                </h2>
              </div>
              <button
                ref={guideCloseButtonRef}
                type="button"
                onClick={() => setIsGuideOpen(false)}
                aria-label="Close Lawton guide"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-purple-200 text-xl text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
              >
                <span aria-hidden="true">x</span>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-3 sm:p-6">
              <div className="mx-auto grid w-full max-w-6xl gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
                  <div className="grid gap-4 p-4 sm:p-6">
                    <button
                      type="button"
                      onClick={() => setIsImageZoomed((current) => !current)}
                      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
                      aria-label="Tap the Lawton image to zoom"
                    >
                      <div className="overflow-auto bg-white p-3 sm:p-4 max-h-[72svh]">
                        <div
                          className={`mx-auto transition-transform duration-200 ease-out ${
                            isImageZoomed
                              ? "w-[180%] max-w-none cursor-zoom-out sm:w-full sm:max-w-3xl"
                              : "w-full max-w-3xl cursor-zoom-in"
                          }`}
                          style={{
                            transformOrigin: "top center",
                            touchAction: "pan-x pan-y pinch-zoom",
                          }}
                        >
                          <Image
                            src={lawtonGuideImage.src}
                            alt={lawtonGuideImage.alt}
                            width={1200}
                            height={1600}
                            className="h-auto w-full cursor-zoom-in object-contain"
                            priority
                          />
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/75 to-transparent p-3 text-left">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/85">
                          {isImageZoomed ? "Tap to fit" : "Tap to zoom"}
                        </p>
                      </div>
                    </button>
                  </div>
                </section>

                <aside className="grid gap-6">
                  <section className="overflow-hidden rounded-[1.75rem] border border-purple-100 bg-white shadow-sm">
                    <div className="border-b border-slate-200 bg-slate-50 p-4 sm:p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-700">
                        {miniCogCopy.scoreGuideTitle}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-slate-950 sm:text-xl">
                        {miniCogGuide.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {miniCogGuide.intro}
                      </p>
                    </div>

                    <div className="grid gap-4 p-4 sm:p-6">
                      <button
                        type="button"
                        onClick={() =>
                          setIsMiniCogZoomed((current) => !current)
                        }
                        className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
                        aria-label={miniCogCopy.scoreGuideTitle}
                      >
                        <div className="overflow-auto bg-white p-3 sm:p-4 max-h-[72svh]">
                          <div
                            className={`mx-auto transition-transform duration-200 ease-out ${
                              isMiniCogZoomed
                                ? "w-[180%] max-w-none cursor-zoom-out sm:w-full sm:max-w-3xl"
                                : "w-full max-w-3xl cursor-zoom-in"
                            }`}
                            style={{ transformOrigin: "top center" }}
                          >
                            <Image
                              src={miniCogGuide.imageSrc}
                              alt={miniCogGuide.imageAlt}
                              width={1200}
                              height={1600}
                              className="h-auto w-full object-contain"
                              priority
                            />
                          </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/75 to-transparent p-3 text-left">
                          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/85">
                            {isMiniCogZoomed
                              ? "Tap to fit"
                              : miniCogCopy.stepOne}
                          </p>
                        </div>
                      </button>

                      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                        <p>
                          <span className="font-semibold text-slate-900">
                            {miniCogCopy.stepOne}
                          </span>{" "}
                          {miniCogCopy.stepOneHelp}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            {miniCogCopy.stepTwo}
                          </span>{" "}
                          {miniCogCopy.stepTwoHelp}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            {miniCogCopy.stepThree}
                          </span>{" "}
                          {miniCogCopy.stepThreeHelp}
                        </p>
                      </div>

                      <div className="rounded-3xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-900">
                        <h4 className="text-sm font-bold uppercase tracking-wide">
                          {miniCogCopy.scoreGuideTitle}
                        </h4>
                        <ul className="mt-2 grid gap-2 text-sm leading-6">
                          <li>{miniCogCopy.scoreGuide.wordRecall}</li>
                          <li>{miniCogCopy.scoreGuide.clockDraw}</li>
                          <li>{miniCogCopy.scoreGuide.total}</li>
                        </ul>
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div>
        <h2 id="lawton-heading" className="text-2xl font-bold text-slate-950">
          {lawtonCopy.title}
        </h2>
        <p className="mt-2 text-base leading-7 text-slate-700">
          {lawtonCopy.description}
        </p>
        <div className="mt-4 rounded-[1.75rem] border border-purple-100 bg-purple-50 p-4 text-sm leading-6 text-purple-950 sm:p-5">
          <ul className="grid gap-2">
            {scaleConfig.helperText.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-700" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold leading-6 text-purple-900">
            {patientSex === "female"
              ? scaleConfig.femaleNote
              : scaleConfig.maleNote}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {scaleConfig.categories.map((category) => {
          const selectedOptionId = selectedOptions[category.id];
          const selectedOption =
            category.options.find((option) => option.id === selectedOptionId) ??
            category.options[0];
          const countsForMaleScore =
            lawtonItems.find((item) => item.id === category.id)
              ?.countsForMaleScore ?? true;
          const isDisabled = patientSex === "male" && !countsForMaleScore;

          return (
            <LawtonScaleCard
              key={category.id}
              category={category}
              selectedOptionId={selectedOption?.id ?? ""}
              onSelect={handleLawtonSelection}
              disabled={isDisabled}
              scoreLabel={scaleConfig.scoreLabel}
            />
          );
        })}

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-700">
                {scaleConfig.totalLabel}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Sex-specific excluded items remain visible for audit but are
                disabled when they do not count toward the current total.
              </p>
            </div>
            <div className="rounded-2xl bg-purple-50 px-4 py-3 text-right">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-700">
                {scaleConfig.totalLabel}
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-950">
                {lawtonScore.total} / {lawtonScore.maxScore}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
