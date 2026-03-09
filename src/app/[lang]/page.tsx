import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import Header from "@/components/Header";
import SearchForm from "@/components/SearchForm";
import TripCard from "@/components/TripCard";

const SAMPLE_TRIPS = [
  {
    id: "1",
    carrier: "EuroTrans",
    from: "Київ",
    to: "Варшава",
    date: "2026-03-15",
    time: "06:00",
    price: "€35",
    seats: 12,
    parcels: true,
    pickupLat: 50.4501,
    pickupLng: 30.5234,
    pickupAddress: "Київ, Центральний автовокзал",
  },
  {
    id: "2",
    carrier: "MoldovaExpress",
    from: "Одеса",
    to: "Кишинів",
    date: "2026-03-16",
    time: "08:30",
    price: "€20",
    seats: 8,
    parcels: true,
    pickupLat: 46.4775,
    pickupLng: 30.7326,
    pickupAddress: "Одеса, пр. Шевченка 2",
  },
  {
    id: "3",
    carrier: "TransBus",
    from: "Львів",
    to: "Бухарест",
    date: "2026-03-17",
    time: "22:00",
    price: "€45",
    seats: 5,
    parcels: false,
    pickupLat: 49.8397,
    pickupLng: 24.0297,
    pickupAddress: "Львів, Двірцева площа 1",
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
    <div className="min-h-screen bg-gray-50">
      <Header lang={lang as Locale} dict={dict} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-4 pt-20 pb-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
            {dict.hero.title}
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mb-8">
            {dict.hero.subtitle}
          </p>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center mb-8">
            <button className="flex-1 max-w-[200px] bg-white text-blue-700 font-semibold py-4 px-6 rounded-2xl text-base shadow-lg hover:shadow-xl active:scale-95 transition-all">
              {dict.actions.findTrip}
            </button>
            <button className="flex-1 max-w-[200px] bg-blue-500 text-white font-semibold py-4 px-6 rounded-2xl text-base shadow-lg hover:shadow-xl hover:bg-blue-400 active:scale-95 transition-all border border-blue-400">
              {dict.actions.sendParcel}
            </button>
          </div>
        </div>
      </section>

      {/* Search form */}
      <section className="px-4 -mt-6">
        <div className="max-w-2xl mx-auto">
          <SearchForm dict={dict} />
        </div>
      </section>

      {/* Trips */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {dict.trips.title}
          </h2>
          <div className="space-y-4">
            {SAMPLE_TRIPS.map((trip) => (
              <TripCard key={trip.id} trip={trip} dict={dict} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
