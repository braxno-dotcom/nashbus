import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import Header from "@/components/Header";
import TripSearch from "@/components/TripSearch";
import AdSlot from "@/components/AdSlot";

const SAMPLE_TRIPS = [
  {
    id: "1",
    carrier: "EuroTrans",
    fromKey: "paris",
    toKey: "kyiv",
    date: "15.03.2026",
    departure: "06:00",
    arrival: "14:00+1",
    duration: "32h",
    price: "€95",
    seats: 14,
    parcels: true,
    pickupLat: 48.8566,
    pickupLng: 2.3522,
    phone: "+380501234567",
    waypoints: ["strasbourg", "nuremberg", "prague", "krakow", "lviv", "ternopil", "zhytomyr"],
  },
  {
    id: "2",
    carrier: "BerlinLvivBus",
    fromKey: "berlin",
    toKey: "lviv",
    date: "16.03.2026",
    departure: "18:00",
    arrival: "16:00+1",
    duration: "22h",
    price: "€75",
    seats: 10,
    parcels: true,
    pickupLat: 52.52,
    pickupLng: 13.405,
    phone: "+380671234567",
    waypoints: ["wroclaw", "katowice", "krakow", "rzeszow", "ivanofrankivsk"],
  },
  {
    id: "3",
    carrier: "WarszawaOdesa",
    fromKey: "warsaw",
    toKey: "odesa",
    date: "17.03.2026",
    departure: "07:00",
    arrival: "08:00+1",
    duration: "25h",
    price: "€80",
    seats: 8,
    parcels: true,
    pickupLat: 52.2297,
    pickupLng: 21.0122,
    phone: "+380931234567",
    waypoints: ["lublin", "lviv", "ternopil", "vinnytsya", "kyiv", "mykolaiv"],
  },
  {
    id: "4",
    carrier: "MoldovaExpress",
    fromKey: "chisinau",
    toKey: "chernivtsi",
    date: "18.03.2026",
    departure: "06:30",
    arrival: "14:00",
    duration: "7.5h",
    price: "€30",
    seats: 6,
    parcels: false,
    pickupLat: 47.0105,
    pickupLng: 28.8638,
    phone: "+373691234567",
    waypoints: ["tiraspol", "odesa", "iasi", "suceava", "siret"],
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

      {/* Search + Trips (client component with smart filtering) */}
      <TripSearch trips={SAMPLE_TRIPS} dict={dict} />

      {/* Ad */}
      <section className="px-4 pb-4">
        <div className="max-w-5xl mx-auto">
          <AdSlot dict={dict} />
        </div>
      </section>
    </div>
  );
}
