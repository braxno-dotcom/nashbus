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
}

export default function TripCard({ trip, dict }: { trip: Trip; dict: Dict }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${trip.pickupLat},${trip.pickupLng}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      {/* Carrier + price */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Bus icon */}
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17a2 2 0 002 2h4a2 2 0 002-2M8 17H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3M8 17v2m8-2v2M3 11h18M7 7h.01M17 7h.01" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{trip.carrier}</p>
            <p className="text-xs text-gray-400">{trip.date}</p>
          </div>
        </div>
        <span className="text-2xl font-bold text-blue-600">{trip.price}</span>
      </div>

      {/* Route */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-0.5">{trip.departure}</p>
          <p className="text-base font-bold text-gray-900">{trip.from}</p>
        </div>

        {/* Arrow + duration */}
        <div className="flex flex-col items-center px-2">
          <div className="flex items-center gap-1 text-gray-300">
            <div className="w-8 h-px bg-gray-300"></div>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div className="w-8 h-px bg-gray-300"></div>
          </div>
          <span className="text-xs text-gray-400 mt-1">{trip.duration}</span>
        </div>

        <div className="flex-1 text-right">
          <p className="text-xs text-gray-400 mb-0.5">{trip.arrival}</p>
          <p className="text-base font-bold text-gray-900">{trip.to}</p>
        </div>
      </div>

      {/* Info badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="flex items-center gap-1 bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {trip.seats} {dict.trips.seats}
        </span>
        {trip.parcels && (
          <span className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            {dict.trips.parcels}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="hidden sm:inline">{dict.trips.pickupPoint}</span>
        </a>
        <button className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm">
          {dict.trips.book}
        </button>
      </div>
    </div>
  );
}
