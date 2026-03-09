"use client";

import { useState } from "react";

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
  parcels: boolean;
  pickupLat: number;
  pickupLng: number;
  phone: string;
}

export default function TripCard({ trip, dict }: { trip: Trip; dict: Dict }) {
  const [fav, setFav] = useState(false);

  const from = (dict.cities as Record<string, string>)[trip.fromKey] || trip.fromKey;
  const to = (dict.cities as Record<string, string>)[trip.toKey] || trip.toKey;

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

  function toggleFav() {
    setFav(!fav);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow transition-shadow relative">
      {/* Favorite */}
      <button
        onClick={toggleFav}
        className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        title={fav ? dict.trips.removed : dict.trips.saved}
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
          <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center shrink-0">
            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17a2 2 0 002 2h4a2 2 0 002-2M8 17H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3M8 17v2m8-2v2M3 11h18M7 7h.01M17 7h.01" />
            </svg>
          </div>
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
          <span className="text-gray-300 text-xs">→</span>
          <span className="text-[9px] text-gray-400">{trip.duration}</span>
        </div>
        <div className="flex-1 min-w-0 text-right">
          <p className="text-[10px] text-gray-400">{trip.arrival}</p>
          <p className="text-xs font-bold text-gray-900 truncate">{to}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-1 mb-2">
        <span className="bg-gray-50 text-gray-500 px-1.5 py-px rounded text-[10px]">
          {trip.seats} {dict.trips.seats}
        </span>
        {trip.parcels && (
          <span className="bg-green-50 text-green-600 px-1.5 py-px rounded text-[10px]">
            {dict.trips.parcels}
          </span>
        )}
      </div>

      {/* Contact buttons: Phone, WhatsApp, Viber */}
      <div className="flex gap-1.5 mb-2">
        <a
          href={telUrl}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded bg-gray-100 text-gray-700 text-[10px] font-medium hover:bg-gray-200 transition-colors"
          title={dict.trips.call}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {dict.trips.call}
        </a>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded bg-green-500 text-white text-[10px] font-bold hover:bg-green-600 transition-colors"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
          WhatsApp
        </a>
        <a
          href={viberUrl}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded bg-purple-500 text-white text-[10px] font-bold hover:bg-purple-600 transition-colors"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.4 0C9.473.028 5.333.344 3.353 2.09 1.89 3.47 1.338 5.54 1.26 8.097c-.078 2.557-.178 7.35 4.504 8.758h.004l-.004 2.013s-.032.815.507 .981c.652.2.968-.369 1.555-.958.322-.322.766-.797 1.1-1.16 3.022.254 5.345-.326 5.607-.415.606-.207 4.028-.635 4.586-5.178.575-4.67-.27-7.63-1.779-8.96l-.003-.003c-.46-.432-2.466-2.026-7.04-2.153 0 0-.327-.02-.897-.022zM11.5 1.27h.748c3.882.104 5.636 1.398 6.037 1.762 1.273 1.12 2.012 3.77 1.506 7.834-.471 3.834-3.28 4.16-3.8 4.337-.22.075-2.24.574-4.88.393 0 0-1.933 2.332-2.537 2.94-.094.094-.208.137-.283.117-.105-.027-.134-.155-.133-.342l.018-3.17c-4.035-1.176-3.8-5.195-3.735-7.323.066-2.128.494-3.9 1.723-5.104C7.59 1.542 9.482 1.3 11.5 1.27zm.496 2.674c-.123 0-.247.1-.245.247.002.147.122.245.245.245.676.012 1.325.205 1.86.6.536.394.972.972 1.17 1.727.03.12.058.252.08.384.02.13.036.26.042.397.01.144.13.252.274.242a.257.257 0 00.241-.274c-.007-.155-.025-.303-.047-.45a5.038 5.038 0 00-.091-.436c-.234-.893-.77-1.59-1.42-2.068a3.633 3.633 0 00-2.109-.614zm-3.463.748c-.168-.023-.35.06-.488.182L7.58 5.363c-.173.168-.274.397-.274.637 0 .12.033.248.09.37.48 1.02 1.12 1.98 1.903 2.84l.02.024.023.02c.86.783 1.82 1.424 2.84 1.904.227.107.51.08.722-.068l.498-.465c.2-.187.27-.47.175-.72-.234-.61-.5-1.095-.5-1.095a.338.338 0 00-.332-.172c-.11.015-.235.07-.395.2l-.38.36c-.128.095-.275.09-.275.09l-.035-.007c-.562-.178-1.39-.762-1.996-1.37-.605-.607-1.19-1.434-1.37-1.996l-.006-.035s-.006-.147.09-.275l.36-.38c.127-.16.184-.284.199-.394a.338.338 0 00-.172-.332s-.483-.266-1.095-.5a.412.412 0 00-.14-.027zm4.093.47c-.135 0-.254.1-.258.24-.005.15.108.254.244.26.36.02.658.16.893.385.234.225.384.53.403.89.005.135.11.24.248.24h.01c.14-.008.247-.124.24-.264a2.006 2.006 0 00-.588-1.297c-.34-.33-.79-.53-1.192-.554z"/>
          </svg>
          Viber
        </a>
      </div>

      {/* Pickup + Book */}
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
        <button
          onClick={() => window.open(waUrl, "_blank")}
          className="flex-1 py-1.5 rounded bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-700 active:scale-[0.97] transition-all"
        >
          {dict.trips.book}
        </button>
      </div>
    </div>
  );
}
