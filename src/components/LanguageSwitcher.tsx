"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n, type Locale } from "@/i18n/config";
import { useState } from "react";

const labels: Record<Locale, string> = {
  uk: "UA",
  ru: "RU",
  ro: "RO",
};

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function switchLocale(locale: Locale) {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors"
      >
        {labels[current]}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
          {i18n.locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLocale(locale)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
                locale === current ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"
              }`}
            >
              {labels[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
