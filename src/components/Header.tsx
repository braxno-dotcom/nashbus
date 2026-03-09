import type { Locale } from "@/i18n/config";
import LanguageSwitcher from "./LanguageSwitcher";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

export default function Header({ lang, dict }: { lang: Locale; dict: Dict }) {
  return (
    <header className="sticky top-0 z-50 bg-blue-700 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-10">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17a2 2 0 002 2h4a2 2 0 002-2M8 17H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3M8 17v2m8-2v2M3 11h18M7 7h.01M17 7h.01" />
          </svg>
          <a href={`/${lang}`} className="text-white font-bold text-sm hover:text-blue-100 transition-colors">
            NashBus
          </a>
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href={`/${lang}/driver`}
            className="bg-yellow-400 text-gray-900 px-2 py-1 rounded text-[11px] font-bold hover:bg-yellow-300 transition-colors"
          >
            {dict.nav.addTrip}
          </a>
          <a
            href={`/${lang}/driver`}
            className="bg-white/15 text-white px-2 py-1 rounded text-[11px] font-medium hover:bg-white/25 transition-colors"
          >
            {dict.nav.myClients}
          </a>
          <LanguageSwitcher current={lang} />
        </div>
      </div>
    </header>
  );
}
