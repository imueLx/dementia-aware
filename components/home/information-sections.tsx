"use client";

import type { HomeCopy } from "@/constants/i18n/home";

type InformationSectionsProps = {
  copy: HomeCopy;
};

export function InformationSections({ copy }: InformationSectionsProps) {
  return (
    <section
      id="learn-more"
      className="bg-slate-50 py-16 sm:py-20"
      aria-labelledby="information-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-purple-700">
            {copy.info.eyebrow}
          </p>
          <h2
            id="information-heading"
            className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl"
          >
            {copy.info.title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            {copy.info.description}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[1.75rem] border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-bold text-slate-950">
              {copy.info.who.title}
            </h3>
            <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-700">
              {copy.info.who.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-2xl bg-slate-50 p-4"
                >
                  <span
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-purple-600"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[1.75rem] border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-bold text-slate-950">
              {copy.info.how.title}
            </h3>
            <ol className="mt-5 grid gap-3">
              {copy.info.how.steps.map((step) => (
                <li
                  key={step.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <p className="text-sm font-bold uppercase tracking-wide text-purple-700">
                    {step.title}
                  </p>
                  <p className="mt-2 text-base leading-7 text-slate-700">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </article>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[1.75rem] border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-bold text-slate-950">
              {copy.info.whatIs.title}
            </h3>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              {copy.info.whatIs.summary}
            </p>
            <ul className="mt-5 grid gap-3">
              {copy.info.whatIs.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-3 text-base leading-7 text-slate-700"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[1.75rem] border border-purple-100 bg-purple-50 p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-bold text-slate-950">
              {copy.info.agingVsDementia.title}
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
                  {copy.info.agingVsDementia.normalTitle}
                </p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                  {copy.info.agingVsDementia.normalItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-wide text-purple-700">
                  {copy.info.agingVsDementia.dementiaTitle}
                </p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                  {copy.info.agingVsDementia.dementiaItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[1.75rem] border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-bold text-slate-950">
              {copy.info.whyTwoTracks.title}
            </h3>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              {copy.info.whyTwoTracks.summary}
            </p>
            <div className="mt-5 grid gap-3">
              {copy.info.whyTwoTracks.items.map((item) => (
                <div key={item.title} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-base font-bold text-slate-950">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-bold text-slate-950">
              {copy.info.privacy.title}
            </h3>
            <ul className="mt-5 grid gap-3">
              {copy.info.privacy.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-base leading-7 text-slate-700"
                >
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-800">
                    i
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[1.75rem] border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-bold text-slate-950">
              {copy.info.seekHelp.title}
            </h3>
            <ul className="mt-5 grid gap-3">
              {copy.info.seekHelp.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-base leading-7 text-slate-700"
                >
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[1.75rem] border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-bold text-slate-950">
              {copy.info.faq.title}
            </h3>
            <div className="mt-5 grid gap-3">
              {copy.info.faq.items.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <summary className="cursor-pointer list-none text-base font-bold text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
