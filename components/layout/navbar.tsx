"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCopy } from "@/lib/i18n/use-copy";
import { useLanguage } from "@/lib/i18n/use-language";
import type { Language } from "@/lib/i18n/language-types";

const logoSrc = "/dementia-aware-logo.png";

type NavbarProps = {
  onAssessmentOpen: () => void;
};

type LogoMarkProps = {
  className?: string;
  size?: "sm" | "lg";
};

export function LogoMark({ className = "", size = "sm" }: LogoMarkProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const dimensions = size === "lg" ? "h-16 w-16" : "h-11 w-11";
  const imageSize = size === "lg" ? 64 : 44;

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-purple-100 bg-white text-sm font-bold text-purple-700 shadow-sm ${dimensions} ${className}`}
      aria-hidden="true"
    >
      {logoFailed ? (
        <span>DA</span>
      ) : (
        <Image
          src={logoSrc}
          alt=""
          width={imageSize}
          height={imageSize}
          className="h-full w-full object-contain p-1"
          onError={() => setLogoFailed(true)}
          priority={size === "lg"}
        />
      )}
    </span>
  );
}

export function Navbar({ onAssessmentOpen }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");
  const copy = useCopy("home");
  const common = useCopy("common");
  const { language, setLanguage } = useLanguage();
  const nextLanguage: Language = language === "en" ? "fil" : "en";

  const navLinks = [
    { label: copy.nav.home, href: "#home" },
    { label: copy.nav.about, href: "#about-dementia" },
    { label: copy.nav.assessment, href: "#assessment" },
    { label: copy.nav.contact, href: "#contact" },
  ];

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const syncActiveHash = () => {
      setActiveHref(window.location.hash || "#home");
    };

    syncActiveHash();
    window.addEventListener("hashchange", syncActiveHash);

    return () => window.removeEventListener("hashchange", syncActiveHash);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-purple-100/80 bg-white/90 backdrop-blur-xl">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="#home"
          className="flex items-center gap-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
          onClick={closeMenu}
        >
          <LogoMark />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-slate-950">
              {copy.brand.name}
            </span>
            <span className="text-xs font-medium text-purple-700">
              {copy.brand.subtitle}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={activeHref === link.href ? "page" : undefined}
              onClick={() => setActiveHref(link.href)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4 ${
                activeHref === link.href
                  ? "bg-purple-100 text-purple-900"
                  : "text-slate-700 hover:bg-purple-50 hover:text-purple-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            aria-label={`${copy.nav.language}: ${nextLanguage === "en" ? common.english : common.filipino}`}
            onClick={() => setLanguage(nextLanguage)}
            className="min-h-11 rounded-full border border-purple-200 px-4 text-sm font-bold text-purple-800 transition hover:border-purple-300 hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
          >
            {language === "en" ? common.english : common.filipino}
            <span className="mx-2 text-purple-300">/</span>
            <span className="text-slate-500">
              {language === "en" ? common.filipino : common.english}
            </span>
          </button>
          <button
            type="button"
            onClick={onAssessmentOpen}
            className="min-h-11 rounded-full bg-purple-700 px-5 text-sm font-bold text-white shadow-sm shadow-purple-200 transition hover:bg-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
          >
            {copy.cta.takeAssessment}
          </button>
        </div>

        <button
          type="button"
          aria-label={isOpen ? copy.nav.closeMenu : copy.nav.openMenu}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-purple-200 text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4 lg:hidden"
        >
          <span className="sr-only">
            {isOpen ? copy.nav.closeMenu : copy.nav.openMenu}
          </span>
          <span className="relative h-5 w-5" aria-hidden="true">
            <span
              className={`absolute left-0 top-1 h-0.5 w-5 rounded bg-current transition ${
                isOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-2.5 h-0.5 w-5 rounded bg-current transition ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-4 h-0.5 w-5 rounded bg-current transition ${
                isOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {isOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-purple-100 bg-white px-4 pb-5 pt-3 shadow-lg shadow-purple-100/60 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={activeHref === link.href ? "page" : undefined}
                onClick={() => {
                  setActiveHref(link.href);
                  closeMenu();
                }}
                className={`rounded-2xl px-4 py-3 text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 ${
                  activeHref === link.href
                    ? "bg-purple-100 text-purple-900"
                    : "text-slate-800 hover:bg-purple-50 hover:text-purple-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setLanguage(nextLanguage);
                  closeMenu();
                }}
                className="min-h-12 rounded-2xl border border-purple-200 px-4 text-sm font-bold text-purple-800 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
              >
                {language === "en"
                  ? copy.cta.switchToFilipino
                  : copy.cta.switchToEnglish}
              </button>
              <button
                type="button"
                onClick={() => {
                  onAssessmentOpen();
                  closeMenu();
                }}
                className="min-h-12 rounded-2xl bg-purple-700 px-4 text-sm font-bold text-white transition hover:bg-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
              >
                {copy.cta.takeAssessment}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
