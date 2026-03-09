"use client";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

interface Trip {
  id: string;
  carrier: string;
  from: string;
  to: string;
  date: string;
  departure: string;
  arrival: string;
  duration: string;
  price: string;
  seats: number;
  parcels: boolean;
  pickupLat: number;
  pickupLng: number;
  pickupAddress: string;
  phone: string;
}

export default function TripCard({ trip, dict }: { trip: Trip; dict: Dict }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${trip.pickupLat},${trip.pickupLng}`;

  function handleBook() {
    const text = encodeURIComponent(`${dict.trips.bookMessage} ${trip.from} → ${trip.to} (${trip.date})`);
    const phone = trip.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      {/* Carrier + price */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17a2 2 0 002 2h4a2 2 0 002-2M8 17H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3M8 17v2m8-2v2M3 11h18M7 7h.01M17 7h.01" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{trip.carrier}</p>
            <p className="text-xs text-gray-400">{trip.date}</p>
          </div>
        </div>
        <span className="text-lg font-bold text-blue-600">{trip.price}</span>
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400">{trip.departure}</p>
          <p className="text-sm font-bold text-gray-900 truncate">{trip.from}</p>
        </div>

        <div className="flex flex-col items-center px-1 shrink-0">
          <div className="flex items-center text-gray-300">
            <div className="w-6 h-px bg-gray-300"></div>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div className="w-6 h-px bg-gray-300"></div>
          </div>
          <span className="text-[10px] text-gray-400 mt-0.5">{trip.duration}</span>
        </div>

        <div className="flex-1 min-w-0 text-right">
          <p className="text-xs text-gray-400">{trip.arrival}</p>
          <p className="text-sm font-bold text-gray-900 truncate">{trip.to}</p>
        </div>
      </div>

      {/* Info badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="flex items-center gap-1 bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full text-xs">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {trip.seats} {dict.trips.seats}
        </span>
        {trip.parcels && (
          <span className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            {dict.trips.parcels}
          </span>
        )}
      </div>

      {/* Actions — big touch targets on mobile */}
      <div className="flex gap-2">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 py-3 sm:py-2 px-3 rounded-lg bg-gray-100 text-gray-600 text-sm sm:text-xs font-medium hover:bg-gray-200 active:scale-95 transition-all"
        >
          <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {dict.trips.pickupPoint}
        </a>
        <button
          onClick={handleBook}
          className="flex-1 py-3 sm:py-2 rounded-lg bg-green-600 text-white text-sm sm:text-xs font-bold hover:bg-green-700 active:scale-[0.97] transition-all flex items-center justify-center gap-1.5"
        >
          <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.613.613l4.458-1.495A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.396 0-4.612-.777-6.413-2.092l-.447-.334-2.636.884.884-2.636-.334-.447A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          {dict.trips.book}
        </button>
      </div>
    </div>
  );
}
