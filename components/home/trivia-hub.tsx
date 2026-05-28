"use client";

import { useMemo, useState } from "react";
import type { HomeCopy } from "@/constants/i18n/home";

type TriviaHubProps = {
  copy: HomeCopy;
};

export function TriviaHub({ copy }: TriviaHubProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = copy.trivia.items;
  const activeItem = items[activeIndex];

  const progressLabel = useMemo(
    () => `${activeIndex + 1} / ${items.length}`,
    [activeIndex, items.length],
  );

  const showPrevious = () => {
    setActiveIndex((index) => (index === 0 ? items.length - 1 : index - 1));
  };

  const showNext = () => {
    setActiveIndex((index) => (index === items.length - 1 ? 0 : index + 1));
  };

  return (
    <section
      id="about-dementia"
      className="bg-white py-16 sm:py-20"
      aria-labelledby="trivia-heading"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-purple-700">
            {copy.trivia.eyebrow}
          </p>
          <h2
            id="trivia-heading"
            className="mt-3 max-w-xl text-3xl font-bold leading-tight text-slate-950 sm:text-4xl"
          >
            {copy.trivia.title}
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-700">
            {copy.trivia.description}
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-purple-100 bg-purple-50 p-4 shadow-sm sm:p-6">
          <article className="min-h-72 rounded-[1.25rem] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                {progressLabel}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label={copy.trivia.previous}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-purple-200 text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label={copy.trivia.next}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-700 text-white transition hover:bg-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            <h3 className="mt-10 text-2xl font-bold text-slate-950">
              {activeItem.title}
            </h3>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              {activeItem.text}
            </p>

            <div className="mt-8 flex gap-2" aria-hidden="true">
              {items.map((item, index) => (
                <span
                  key={item.title}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-10 bg-purple-700"
                      : "w-2.5 bg-purple-200"
                  }`}
                />
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
