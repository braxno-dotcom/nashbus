import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import Header from "@/components/Header";
import SearchForm from "@/components/SearchForm";
import TripCard from "@/components/TripCard";

const SAMPLE_TRIPS = [
  {
    id: "1",
    carrier: "EuroTrans",
    from: "Париж",
    to: "Чернівці",
    date: "15.03.2026",
    departure: "06:00",
    arrival: "22:00",
    duration: "16 год",
    price: "€85",
    seats: 12,
    parcels: true,
    pickupLat: 48.8566,
    pickupLng: 2.3522,
    pickupAddress: "Paris, Gare Routière Bercy",
  },
  {
    id: "2",
    carrier: "MoldovaExpress",
    from: "Мадрид",
    to: "Київ",
    date: "16.03.2026",
    departure: "18:00",
    arrival: "20:00+1",
    duration: "26 год",
    price: "€120",
    seats: 8,
    parcels: true,
    pickupLat: 40.4168,
    pickupLng: -3.7038,
    pickupAddress: "Madrid, Estación Sur de Autobuses",
  },
  {
    id: "3",
    carrier: "TransBus",
    from: "Кишинів",
    to: "Одеса",
    date: "17.03.2026",
    departure: "08:00",
    arrival: "13:30",
    duration: "5,5 год",
    price: "€25",
    seats: 5,
    parcels: false,
    pickupLat: 47.0105,
    pickupLng: 28.8638,
    pickupAddress: "Кишинів, Центральний автовокзал",
  },
];

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header lang={lang as Locale} dict={dict} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-4 pt-24 pb-28 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
            {dict.hero.title}
          </h1>
          <p className="text-blue-100 text-base sm:text-lg mb-10 max-w-2xl mx-auto">
            {dict.hero.subtitle}
          </p>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-blue-700 font-bold py-4 px-8 rounded-2xl text-base sm:text-lg shadow-xl hover:shadow-2xl active:scale-95 transition-all">
              {dict.actions.findTrip}
            </button>
            <button className="bg-white/15 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-2xl text-base sm:text-lg shadow-xl hover:bg-white/25 active:scale-95 transition-all border border-white/20">
              {dict.actions.sendParcel}
            </button>
          </div>
        </div>
      </section>

      {/* Search form — overlapping hero */}
      <section className="px-4 -mt-14 relative z-10">
        <div className="max-w-3xl mx-auto">
          <SearchForm dict={dict} />
        </div>
      </section>

      {/* Trips */}
      <section className="px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
            {dict.trips.title}
          </h2>
          <div className="space-y-4">
            {SAMPLE_TRIPS.map((trip) => (
              <TripCard key={trip.id} trip={trip} dict={dict} />
            ))}
          </div>
        </div>
      </section>

      {/* Mobile "Add trip" button for drivers */}
      <div className="sm:hidden fixed bottom-6 right-4 z-40">
        <button className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-all">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
