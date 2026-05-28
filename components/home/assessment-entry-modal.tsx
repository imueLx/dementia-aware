"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { HomeCopy } from "@/constants/i18n/home";
import { TrackOptionCard, type TrackId } from "./track-option-card";

type AssessmentEntryModalProps = {
  copy: HomeCopy;
  isOpen: boolean;
  onClose: () => void;
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function AssessmentEntryModal({
  copy,
  isOpen,
  onClose,
}: AssessmentEntryModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<Element | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<TrackId>("caregiver");

  const modalCopy = copy.assessment.entryModal;
  const tracks = copy.assessment.tracks;

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
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
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
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const continueToTrack = (trackId: TrackId) => {
    setSelectedTrack(trackId);
    onClose();
    router.push(tracks[trackId].route);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end bg-slate-950/45 p-3 opacity-100 backdrop-blur-sm transition-opacity duration-200 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assessment-entry-title"
        aria-describedby="assessment-entry-description assessment-entry-notice"
        className="mx-auto max-h-[94svh] w-full max-w-6xl animate-[modalEnter_180ms_ease-out] overflow-y-auto rounded-t-[1.75rem] bg-white p-5 shadow-2xl sm:rounded-[1.75rem] sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-purple-700">
              {modalCopy.eyebrow}
            </p>
            <h2
              id="assessment-entry-title"
              className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl"
            >
              {modalCopy.title}
            </h2>
            <p
              id="assessment-entry-description"
              className="mt-3 max-w-3xl text-base leading-7 text-slate-700"
            >
              {modalCopy.description}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={modalCopy.closeLabel}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-purple-200 text-xl text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
          >
            <span aria-hidden="true">x</span>
          </button>
        </div>

        <div
          role="radiogroup"
          aria-label={modalCopy.title}
          className="mt-7 grid gap-4 lg:grid-cols-2"
        >
          <TrackOptionCard
            id="professional"
            track={tracks.professional}
            labels={modalCopy.comparisonLabels}
            isSelected={selectedTrack === "professional"}
            selectedLabel={modalCopy.selectedLabel}
            onSelect={setSelectedTrack}
            onContinue={continueToTrack}
          />
          <TrackOptionCard
            id="caregiver"
            track={tracks.caregiver}
            labels={modalCopy.comparisonLabels}
            isSelected={selectedTrack === "caregiver"}
            selectedLabel={modalCopy.selectedLabel}
            onSelect={setSelectedTrack}
            onContinue={continueToTrack}
          />
        </div>

        <div className="mt-6 grid gap-4 border-t border-purple-100 pt-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div
            id="assessment-entry-notice"
            className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
          >
            <h3 className="text-sm font-bold text-amber-900">
              {modalCopy.noticeTitle}
            </h3>
            <p className="mt-1 text-sm leading-6 text-amber-900/90">
              {modalCopy.noticeText}
            </p>
          </div>
          <button
            type="button"
            onClick={() => continueToTrack(selectedTrack)}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-purple-700 px-6 text-base font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
          >
            {modalCopy.continueSelected}
          </button>
        </div>
      </div>
    </div>
  );
}
