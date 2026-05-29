import Link from "next/link";
import type { HomeCopy } from "@/constants/i18n/home";

type FooterProps = {
  copy: HomeCopy;
};

export function Footer({ copy }: FooterProps) {
  const links = [
    { label: copy.nav.home, href: "#home" },
    { label: copy.nav.about, href: "#about-dementia" },
    { label: copy.nav.assessment, href: "#assessment" },
    { label: copy.nav.contact, href: "#contact" },
  ];

  return (
    <footer id="contact" className="border-t border-purple-100 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_0.6fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full bg-purple-700"
              aria-hidden="true"
            />
            <div>
              <p className="text-lg font-bold text-slate-950">
                {copy.brand.name}
              </p>
              <p className="text-sm font-semibold text-purple-700">
                {copy.brand.institution}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700">
            {copy.brand.shortMission}
          </p>
          <p className="mt-5 text-sm text-slate-500">{copy.footer.copyright}</p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-purple-700">
            {copy.footer.quickLinks}
          </h2>
          <ul className="mt-4 grid gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex rounded-lg text-sm font-semibold text-slate-700 transition hover:text-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-4"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
