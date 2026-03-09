import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import Header from "@/components/Header";
import SearchForm from "@/components/SearchForm";
import TripCard from "@/components/TripCard";
import AddTripForm from "@/components/AddTripForm";

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
    phone: "+380501234567",
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
    phone: "+380671234567",
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
    phone: "+373691234567",
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
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-4 pt-16 pb-16">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-2 leading-tight">
            {dict.hero.title}
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mb-6 max-w-xl mx-auto">
            {dict.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto sm:max-w-none">
            <a
              href="#search"
              className="bg-white text-blue-700 font-bold py-4 sm:py-2.5 px-5 rounded-xl text-base sm:text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all text-center"
            >
              {dict.actions.findTrip}
            </a>
            <a
              href="#search"
              className="bg-white/15 backdrop-blur-sm text-white font-bold py-4 sm:py-2.5 px-5 rounded-xl text-base sm:text-sm shadow-lg hover:bg-white/25 active:scale-95 transition-all border border-white/20 text-center"
            >
              {dict.actions.sendParcel}
            </a>
          </div>
        </div>
      </section>

      {/* Search form */}
      <section id="search" className="px-4 -mt-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <SearchForm dict={dict} />
        </div>
      </section>

      {/* Trips */}
      <section className="px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {dict.trips.title}
          </h2>
          <div className="space-y-3">
            {SAMPLE_TRIPS.map((trip) => (
              <TripCard key={trip.id} trip={trip} dict={dict} />
            ))}
          </div>
        </div>
      </section>

      {/* Driver section */}
      <section id="driver" className="px-4 pb-8">
        <div className="max-w-3xl mx-auto">
          <AddTripForm dict={dict} />
        </div>
      </section>
    </div>
  );
}
