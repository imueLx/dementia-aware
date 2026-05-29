"use client";

import { useState } from "react";
import { AssessmentEntryModal } from "@/components/home/assessment-entry-modal";
import { AssessmentCta } from "@/components/home/assessment-cta";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import { InformationSections } from "@/components/home/information-sections";
import { TriviaHub } from "@/components/home/trivia-hub";
import { Navbar } from "@/components/layout/navbar";
import { useCopy } from "@/lib/i18n/use-copy";
import type { HomeCopy } from "@/constants/i18n/home";
import { useLanguage } from "@/lib/i18n/use-language";

export default function HomePage() {
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const copy = useCopy("home") as HomeCopy;
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-slate-950" lang={language}>
      <Navbar onAssessmentOpen={() => setIsAssessmentOpen(true)} />
      <main>
        <Hero copy={copy} onAssessmentOpen={() => setIsAssessmentOpen(true)} />
        <TriviaHub copy={copy} />
        <InformationSections copy={copy} />
        <AssessmentCta copy={copy} onOpen={() => setIsAssessmentOpen(true)} />
      </main>
      <Footer copy={copy} />
      <AssessmentEntryModal
        copy={copy}
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
      />
    </div>
  );
}
