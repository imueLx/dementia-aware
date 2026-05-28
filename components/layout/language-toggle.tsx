"use client";

import { useCopy } from "@/lib/i18n/use-copy";
import { useLanguage } from "@/lib/i18n/use-language";
import type { Language } from "@/lib/i18n/language-types";

type LanguageToggleProps = {
  className?: string;
};

export function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const common = useCopy("common");
  const { language, setLanguage } = useLanguage();
  const nextLanguage: Language = language === "en" ? "fil" : "en";

  return (
    <button
      type="button"
      aria-label={`${common.language}: ${language === "en" ? common.filipino : common.english}`}
      onClick={() => setLanguage(nextLanguage)}
      className={`min-h-11 rounded-full border border-purple-200 px-4 text-sm font-bold text-purple-800 transition hover:border-purple-300 hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4 ${className}`}
    >
      {language === "en" ? common.english : common.filipino}
      <span className="mx-2 text-purple-300">/</span>
      <span className="text-slate-500">
        {language === "en" ? common.filipino : common.english}
      </span>
    </button>
  );
}
