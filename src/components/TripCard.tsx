"use client";

import { useState, useRef, useEffect } from "react";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

interface Trip {
  id: string;
  carrier: string;
  fromKey: string;
  toKey: string;
  date: string;
  departure: string;
  arrival: string;
  duration: string;
  price: string;
  seats: number;
  maxSeats?: number;
  bookedSeats?: number;
  parcels: boolean;
  pickupLat: number;
  pickupLng: number;
  phone: string;
  waypoints?: string[];
  logoUrl?: string;
}

export type { Trip };

export default function TripCard({ trip, dict }: { trip: Trip; dict: Dict }) {
  const [fav, setFav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [routeOpen, setRouteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const cities = dict.cities as Record<string, string>;
  const from = cities[trip.fromKey] || trip.fromKey;
  const to = cities[trip.toKey] || trip.toKey;

  // Full route: from -> waypoints -> to
  const fullRoute = [
    trip.fromKey,
    ...(trip.waypoints || []),
    trip.toKey,
  ];
  const fullRouteNames = fullRoute.map((key) => cities[key] || key);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${trip.pickupLat},${trip.pickupLng}`;
  const phone = trip.phone.replace(/[^0-9+]/g, "");
  const phoneClean = phone.replace(/[^0-9]/g, "");

  const messageText = dict.trips.bookMessage
    .replace("{from}", from)
    .replace("{to}", to)
    .replace("{date}", trip.date);

  const waUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(messageText)}`;
  const viberUrl = `viber://chat?number=${encodeURIComponent(phone)}&draft=${encodeURIComponent(messageText)}`;
  const telUrl = `tel:${phone}`;

  // Seats calculation
  const totalSeats = trip.maxSeats || trip.seats || 20;
  const booked = trip.bookedSeats || 0;
  const seatsLeft = totalSeats - booked;

  // Close menu on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow transition-shadow relative">
      {/* Favorite */}
      <button
        onClick={() => setFav(!fav)}
        className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-colors ${fav ? "text-red-500 fill-red-500" : "text-gray-300"}`}
          fill={fav ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Carrier + price */}
      <div className="flex items-center justify-between mb-2 pr-7">
        <div className="flex items-center gap-1.5">
          {trip.logoUrl ? (
            <img src={trip.logoUrl} alt="" className="w-6 h-6 rounded object-cover shrink-0" />
          ) : (
            <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17a2 2 0 002 2h4a2 2 0 002-2M8 17H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3M8 17v2m8-2v2M3 11h18M7 7h.01M17 7h.01" />
              </svg>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-gray-800">{trip.carrier}</p>
            <p className="text-[10px] text-gray-400">{trip.date}</p>
          </div>
        </div>
        <span className="text-sm font-bold text-blue-600">{trip.price}</span>
      </div>

      {/* Route */}
      <div className="flex items-center gap-1 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-400">{trip.departure}</p>
          <p className="text-xs font-bold text-gray-900 truncate">{from}</p>
        </div>
        <div className="flex flex-col items-center px-1 shrink-0">
          <span className="text-gray-300 text-xs">&rarr;</span>
          <span className="text-[9px] text-gray-400">{trip.duration}</span>
        </div>
        <div className="flex-1 min-w-0 text-right">
          <p className="text-[10px] text-gray-400">{trip.arrival}</p>
          <p className="text-xs font-bold text-gray-900 truncate">{to}</p>
        </div>
      </div>

      {/* Badges + Route button */}
      <div className="flex gap-1 mb-2 flex-wrap">
        {seatsLeft > 0 ? (
          <span className="bg-gray-50 text-gray-500 px-1.5 py-px rounded text-[10px]">
            {(dict.trips as Record<string, string>).seatsLeft
              ?.replace("{left}", String(seatsLeft))
              .replace("{total}", String(totalSeats)) || `${seatsLeft}/${totalSeats}`}
          </span>
        ) : (
          <span className="bg-red-50 text-red-600 px-1.5 py-px rounded text-[10px] font-bold">
            {(dict.trips as Record<string, string>).noSeats || "Мест нет"}
          </span>
        )}
        {trip.parcels && (
          <span className="bg-green-50 text-green-600 px-1.5 py-px rounded text-[10px]">
            {dict.trips.parcels}
          </span>
        )}
        {(trip.waypoints?.length ?? 0) > 0 && (
          <button
            onClick={() => setRouteOpen(!routeOpen)}
            className="bg-blue-50 text-blue-600 px-1.5 py-px rounded text-[10px] font-semibold hover:bg-blue-100 transition-colors flex items-center gap-0.5"
          >
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            {dict.trips.route} ({fullRoute.length})
          </button>
        )}
      </div>

      {/* Route details dropdown */}
      {routeOpen && (
        <div className="bg-blue-50 rounded-lg p-2 mb-2">
          <div className="flex flex-col gap-1">
            {fullRouteNames.map((city, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full shrink-0 ${i === 0 ? "bg-green-500" : i === fullRouteNames.length - 1 ? "bg-red-500" : "bg-blue-400"}`} />
                <span className="text-[10px] text-gray-700">{city}</span>
                {i < fullRouteNames.length - 1 && (
                  <svg className="w-2.5 h-2.5 text-gray-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions: Pickup + Book with dropdown */}
      <div className="flex gap-1.5">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-1.5 px-2.5 rounded bg-orange-500 text-white text-[10px] font-bold hover:bg-orange-600 active:scale-95 transition-all flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {dict.trips.pickupPoint}
        </a>

        {/* Book button with contact menu */}
        <div className="relative flex-1" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-full py-1.5 rounded bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-700 active:scale-[0.97] transition-all"
          >
            {dict.trips.book}
          </button>

          {menuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-30">
              <a
                href={telUrl}
                className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {dict.trips.call}
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-xs text-green-600 hover:bg-green-50 transition-colors border-t border-gray-100"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href={viberUrl}
                className="flex items-center gap-2 px-3 py-2 text-xs text-purple-600 hover:bg-purple-50 transition-colors border-t border-gray-100"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 0C9.473.028 5.333.344 3.353 2.09 1.89 3.47 1.338 5.54 1.26 8.097c-.078 2.557-.178 7.35 4.504 8.758h.004l-.004 2.013s-.032.815.507.981c.652.2.968-.369 1.555-.958.322-.322.766-.797 1.1-1.16 3.022.254 5.345-.326 5.607-.415.606-.207 4.028-.635 4.586-5.178.575-4.67-.27-7.63-1.779-8.96l-.003-.003c-.46-.432-2.466-2.026-7.04-2.153 0 0-.327-.02-.897-.022z"/>
                </svg>
                Viber
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
