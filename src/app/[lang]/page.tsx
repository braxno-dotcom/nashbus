import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import Header from "@/components/Header";
import SearchForm from "@/components/SearchForm";
import TripCard from "@/components/TripCard";
import AddTripForm from "@/components/AddTripForm";
import AdSlot from "@/components/AdSlot";

const SAMPLE_TRIPS = [
  {
    id: "1",
    carrier: "EuroTrans",
    fromKey: "paris",
    toKey: "chernivtsi",
    date: "15.03.2026",
    departure: "06:00",
    arrival: "22:00",
    duration: "16h",
    price: "€85",
    seats: 12,
    parcels: true,
    pickupLat: 48.8566,
    pickupLng: 2.3522,
    phone: "+380501234567",
  },
  {
    id: "2",
    carrier: "MoldovaExpress",
    fromKey: "madrid",
    toKey: "kyiv",
    date: "16.03.2026",
    departure: "18:00",
    arrival: "20:00+1",
    duration: "26h",
    price: "€120",
    seats: 8,
    parcels: true,
    pickupLat: 40.4168,
    pickupLng: -3.7038,
    phone: "+380671234567",
  },
  {
    id: "3",
    carrier: "TransBus",
    fromKey: "chisinau",
    toKey: "odesa",
    date: "17.03.2026",
    departure: "08:00",
    arrival: "13:30",
    duration: "5.5h",
    price: "€25",
    seats: 5,
    parcels: false,
    pickupLat: 47.0105,
    pickupLng: 28.8638,
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

      {/* Search */}
      <section id="search" className="px-4 -mt-5 relative z-10">
        <div className="max-w-5xl mx-auto">
          <SearchForm dict={dict} />
        </div>
      </section>

      {/* Trips */}
      <section className="px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-bold text-gray-800 mb-3">
            {dict.trips.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Trip 1 */}
            <TripCard trip={SAMPLE_TRIPS[0]} dict={dict} />

            {/* Ad slot — spans full width on mobile, 1 col on desktop */}
            <div className="sm:col-span-2 lg:col-span-3">
              <AdSlot dict={dict} />
            </div>

            {/* Trip 2 & 3 */}
            <TripCard trip={SAMPLE_TRIPS[1]} dict={dict} />
            <TripCard trip={SAMPLE_TRIPS[2]} dict={dict} />
          </div>
        </div>
      </section>

      {/* Driver */}
      <section id="driver" className="px-4 pb-6">
        <div className="max-w-5xl mx-auto">
          <AddTripForm dict={dict} />
        </div>
      </section>
    </div>
  );
}
