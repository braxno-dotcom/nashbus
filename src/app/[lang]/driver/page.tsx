import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import DriverPageClient from "@/components/DriverPageClient";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function DriverPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-slate-800 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-10">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17a2 2 0 002 2h4a2 2 0 002-2M8 17H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3M8 17v2m8-2v2M3 11h18M7 7h.01M17 7h.01" />
            </svg>
            <span className="text-white font-bold text-sm">NashBus</span>
            <span className="text-yellow-300 text-[10px] font-bold px-1.5 py-0.5 bg-yellow-300/15 rounded ml-1">
              {dict.nav.driverPanel}
            </span>
          </div>
          <LanguageSwitcher current={lang as Locale} />
        </div>
      </header>
      <div className="pt-12 px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          <DriverPageClient dict={dict} lang={lang} />
        </div>
      </div>
    </div>
  );
}
