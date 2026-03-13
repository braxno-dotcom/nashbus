import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import Header from "@/components/Header";
import TripSearch from "@/components/TripSearch";
import AdSlot from "@/components/AdSlot";

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/nashbus" : "";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang={lang as Locale} dict={dict} />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 pt-14 pb-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-base sm:text-lg font-bold mb-1">
            {dict.hero.title}
          </h1>
          <p className="text-blue-200 text-xs mb-4">
            {dict.hero.subtitle}
          </p>
          <div className="flex gap-2 justify-center">
            <a href="#search" className="bg-white text-blue-700 font-semibold py-1.5 px-4 rounded-lg text-xs active:scale-95 transition-all">
              {dict.actions.findTrip}
            </a>
            <a href="#search" className="bg-white/15 text-white font-semibold py-1.5 px-4 rounded-lg text-xs active:scale-95 transition-all border border-white/20">
              {dict.actions.sendParcel}
            </a>
          </div>
          <a
            href={`${basePath}/${lang}/freight/`}
            className="inline-flex items-center gap-1.5 mt-3 bg-amber-500 text-white font-bold py-2 px-5 rounded-lg text-xs hover:bg-amber-600 active:scale-[0.97] transition-all shadow-lg shadow-amber-500/30 border border-amber-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17a2 2 0 002 2h4a2 2 0 002-2M8 17H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3M8 17v2m8-2v2M3 11h18M7 7h.01M17 7h.01" />
            </svg>
            {(dict.freight as Record<string, string>).button}
          </a>
        </div>
      </section>

      {/* Search + Trips from Supabase */}
      <TripSearch dict={dict} />

      {/* Ad */}
      <section className="px-4 pb-4">
        <div className="max-w-5xl mx-auto">
          <AdSlot dict={dict} />
        </div>
      </section>
    </div>
  );
}
