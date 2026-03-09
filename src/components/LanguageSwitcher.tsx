"use client";

import { usePathname } from "next/navigation";
import { i18n, type Locale } from "@/i18n/config";

const labels: Record<Locale, string> = {
  uk: "UA",
  ru: "RU",
  ro: "RO",
};

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();

  function getLocalePath(locale: Locale) {
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  }

  return (
    <div className="flex items-center gap-0.5 bg-white/10 rounded-lg p-0.5">
      {i18n.locales.map((locale) => (
        <a
          key={locale}
          href={getLocalePath(locale)}
          className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
            locale === current
              ? "bg-white text-blue-700 shadow-sm"
              : "text-white/80 hover:text-white hover:bg-white/10"
          }`}
        >
          {labels[locale]}
        </a>
      ))}
    </div>
  );
}
