import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import Header from "@/components/Header";
import TripSearch from "@/components/TripSearch";
import AdSlot from "@/components/AdSlot";

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
