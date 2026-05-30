"use client";

import type { KeyboardEvent } from "react";
import type { HomeCopy } from "@/constants/i18n/home";

type TrackId = "professional" | "caregiver";
type TrackCopy = HomeCopy["assessment"]["tracks"][TrackId];
type ComparisonLabels =
  HomeCopy["assessment"]["entryModal"]["comparisonLabels"];

type TrackOptionCardProps = {
  id: TrackId;
  track: TrackCopy;
  labels: ComparisonLabels;
  isSelected: boolean;
  selectedLabel: string;
  onSelect: (id: TrackId) => void;
  onContinue: (id: TrackId) => void;
};

export type { TrackId };

export function TrackOptionCard({
  id,
  track,
  labels,
  isSelected,
  selectedLabel,
  onSelect,
  onContinue,
}: TrackOptionCardProps) {
  const details = [
    { label: labels.intendedUser, value: track.details.intendedUser },
    { label: labels.dataHandling, value: track.details.dataHandling },
    { label: labels.screeningType, value: track.details.screeningType },
    { label: labels.privacyLevel, value: track.details.privacyLevel },
    { label: labels.recommendedUse, value: track.details.recommendedUse },
  ];

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => onSelect(id)}
      onKeyDown={handleKeyDown}
      className={`group flex h-full cursor-pointer flex-col rounded-[1.25rem] border bg-white p-4 text-left shadow-sm transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4 sm:rounded-3xl sm:p-6 ${
        isSelected
          ? "border-purple-600 bg-purple-50/70 ring-2 ring-purple-200"
          : "border-purple-100 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-purple-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-purple-800">
          {track.badge}
        </span>
        <span
          aria-hidden="true"
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
            isSelected
              ? "border-purple-700 bg-purple-700 text-white"
              : "border-purple-200 bg-white text-transparent"
          }`}
        >
          ✓
        </span>
      </div>

      <h3 className="mt-3 text-lg font-bold leading-snug text-slate-950 sm:mt-5 sm:text-xl">
        {track.label}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-700 sm:mt-3 sm:text-base sm:leading-7">
        {track.description}
      </p>

      <ul className="mt-3 grid gap-1.5 sm:mt-5 sm:gap-2">
        {track.highlights.map((highlight) => (
          <li
            key={highlight}
            className="flex gap-2 text-xs leading-5 text-slate-700 sm:text-sm sm:leading-6"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 hidden gap-3 border-t border-purple-100 pt-5 sm:mt-6 sm:grid">
        {details.map((detail) => (
          <div key={detail.label} className="rounded-2xl bg-white/80 p-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-purple-700">
              {detail.label}
            </dt>
            <dd className="mt-1 text-sm leading-6 text-slate-700">
              {detail.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto pt-4 sm:pt-6">
        {isSelected ? (
          <p className="mb-2 text-xs font-bold text-purple-800 sm:mb-3 sm:text-sm">
            {selectedLabel}
          </p>
        ) : null}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onContinue(id);
          }}
          className={`hidden min-h-12 w-full items-center justify-center rounded-full px-5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4 sm:inline-flex ${
            isSelected
              ? "bg-purple-700 text-white shadow-lg shadow-purple-200 hover:bg-purple-800"
              : "border border-purple-200 bg-white text-purple-800 hover:bg-purple-50"
          }`}
        >
          {track.continueLabel}
        </button>
      </div>
    </div>
  );
}
