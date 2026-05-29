"use client";

import { LogoMark } from "@/components/layout/navbar";
import Image from "next/image";
import type { HomeCopy } from "@/constants/i18n/home";

type HeroProps = {
  copy: HomeCopy;
  onAssessmentOpen: () => void;
};

export function Hero({ copy, onAssessmentOpen }: HeroProps) {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-purple-50 via-white to-white"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <div className="mb-6">
            <div className="inline-flex rounded-2xl bg-slate-950/95 p-3 shadow-lg shadow-slate-900/10">
              <Image
                src="/dementia-aware-logo.png"
                alt="DementiAware"
                width={520}
                height={140}
                priority
                className="h-14 w-auto max-w-full object-contain drop-shadow-[0_3px_10px_rgba(0,0,0,0.35)] sm:h-16"
              />
            </div>
          </div>
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-bold text-purple-800 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {copy.hero.eyebrow}
          </div>
          <h1
            id="hero-heading"
            className="max-w-4xl text-balance text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl"
          >
            {copy.hero.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
            {copy.hero.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#about-dementia"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-purple-200 bg-white px-6 text-base font-bold text-purple-800 shadow-sm transition hover:border-purple-300 hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
            >
              {copy.cta.whatIsDementia}
            </a>
            <button
              type="button"
              onClick={onAssessmentOpen}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-purple-700 px-6 text-base font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
            >
              {copy.cta.takeAssessment}
            </button>
          </div>
          <p className="mt-5 max-w-2xl rounded-2xl border border-purple-100 bg-white/80 p-4 text-sm leading-6 text-slate-700 shadow-sm">
            {copy.hero.note}
          </p>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-purple-100 bg-white p-5 shadow-2xl shadow-purple-100 sm:p-7">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
              <LogoMark size="lg" />
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-purple-700">
                  {copy.brand.name}
                </p>
                <h2 className="text-2xl font-bold text-slate-950">
                  {copy.hero.visualTitle}
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {copy.hero.visualSubtitle}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {copy.hero.visualItems.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-base font-bold text-purple-800">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">{item}</p>
                    <p className="text-sm leading-6 text-slate-600">
                      {index === 0
                        ? copy.trivia.items[0].text
                        : index === 1
                          ? copy.assessment.title
                          : copy.hero.assurance}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-purple-700 p-5 text-white">
              <p className="text-sm font-semibold text-purple-100">
                {copy.hero.assurance}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
