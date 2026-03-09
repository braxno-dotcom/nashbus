type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

interface Trip {
  id: string;
  carrier: string;
  from: string;
  to: string;
  date: string;
  time: string;
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {trip.carrier}
          </p>
          <p className="text-lg font-bold text-gray-900 mt-0.5">
            {trip.from} → {trip.to}
          </p>
        </div>
        <span className="text-xl font-bold text-blue-600">{trip.price}</span>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {trip.date}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {trip.time}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {trip.seats} {dict.trips.seats}
        </span>
        {trip.parcels && (
          <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
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
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {dict.trips.pickupPoint}
        </a>
        <button className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all">
          {dict.trips.book}
        </button>
      </div>
    </div>
  );
}
