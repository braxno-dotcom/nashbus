import type { Locale } from "@/i18n/config";
import LanguageSwitcher from "./LanguageSwitcher";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

export default function Header({ lang, dict }: { lang: Locale; dict: Dict }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-blue-700/95 backdrop-blur-sm shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17a2 2 0 002 2h4a2 2 0 002-2M8 17H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3M8 17v2m8-2v2M3 11h18M7 7h.01M17 7h.01" />
          </svg>
          <span className="text-white font-bold text-lg tracking-tight">
            {dict.nav.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#driver"
            className="hidden sm:flex items-center gap-1 bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {dict.nav.addTrip}
          </a>
          <LanguageSwitcher current={lang} />
        </div>
      </div>
    </header>
  );
}
