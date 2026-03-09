import type { Locale } from "@/i18n/config";
import LanguageSwitcher from "./LanguageSwitcher";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

export default function Header({ lang, dict }: { lang: Locale; dict: Dict }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-blue-700/95 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
        <span className="text-white font-bold text-xl tracking-tight">
          {dict.nav.title}
        </span>
        <LanguageSwitcher current={lang} />
      </div>
    </header>
  );
}
