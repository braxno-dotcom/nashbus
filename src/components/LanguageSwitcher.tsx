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
    <div className="flex items-center gap-px bg-white/10 rounded p-px">
      {i18n.locales.map((locale) => (
        <a
          key={locale}
          href={getLocalePath(locale)}
          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
            locale === current
              ? "bg-white text-blue-700"
              : "text-white/80 hover:text-white"
          }`}
        >
          {labels[locale]}
        </a>
      ))}
    </div>
  );
}
