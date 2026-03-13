"use client";

import { useState } from "react";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

const SUPABASE_URL = "https://wxwjsyhrykiexkkoyhoz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2pzeWhyeWtpZXhra295aG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjEwNDcsImV4cCI6MjA4ODczNzA0N30.53Ww3hcMl6xirqELFvgZGe-k_Oxfjx6xyAaEAkcOjJ4";

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
  const [routeOpen, setRouteOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paxName, setPaxName] = useState("");
  const [paxPhone, setPaxPhone] = useState("");
  const [paxSeats, setPaxSeats] = useState("1");

  const cities = dict.cities as Record<string, string>;
  const t = dict.trips as Record<string, string>;
  const from = cities[trip.fromKey] || trip.fromKey;
  const to = cities[trip.toKey] || trip.toKey;

  const fullRoute = [trip.fromKey, ...(trip.waypoints || []), trip.toKey];
  const fullRouteNames = fullRoute.map((key) => cities[key] || key);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${trip.pickupLat},${trip.pickupLng}`;
  const phone = trip.phone.replace(/[^0-9+]/g, "");
  const phoneClean = phone.replace(/[^0-9]/g, "");

  const messageText = t.bookMessage
    .replace("{from}", from)
    .replace("{to}", to)
    .replace("{date}", trip.date);

  const waUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(messageText)}`;

  const totalSeats = trip.maxSeats || trip.seats || 20;
  const booked = trip.bookedSeats || 0;
  const seatsLeft = totalSeats - booked;

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          route_id: trip.id,
          passenger_name: paxName,
          phone: paxPhone,
          pickup_point: "",
          dropoff_point: "",
          seats_count: parseInt(paxSeats) || 1,
        }),
      });
      if (!res.ok) throw new Error();
      setConfirmed(true);
      // Telegram notification is sent by database trigger (notify_booking)
    } catch {
      alert(t.bookError || "Error");
    }
    setSubmitting(false);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow transition-shadow relative">
      {/* Carrier + price */}
      <div className="flex items-center justify-between mb-2">
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
          {trip.duration && <span className="text-[9px] text-gray-400">{(dict.trips as Record<string, string>).duration || "В пути"}: {trip.duration}</span>}
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
            {t.seatsLeft
              ?.replace("{left}", String(seatsLeft))
              .replace("{total}", String(totalSeats)) || `${seatsLeft}/${totalSeats}`}
          </span>
        ) : (
          <span className="bg-red-50 text-red-600 px-1.5 py-px rounded text-[10px] font-bold">
            {t.noSeats || "No seats"}
          </span>
        )}
        {trip.parcels && (
          <span className="bg-green-50 text-green-600 px-1.5 py-px rounded text-[10px]">
            {t.parcels}
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
            {t.route} ({fullRoute.length})
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

      {/* Booking form */}
      {formOpen && !confirmed && (
        <form onSubmit={handleBooking} className="bg-gray-50 rounded-lg p-2.5 mb-2 space-y-1.5">
          <input
            type="text"
            value={paxName}
            onChange={(e) => setPaxName(e.target.value)}
            placeholder={t.bookName || "Name"}
            required
            className="w-full px-2.5 py-2 rounded-lg bg-white border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="tel"
            value={paxPhone}
            onChange={(e) => setPaxPhone(e.target.value)}
            placeholder={t.bookPhone || "Phone"}
            required
            className="w-full px-2.5 py-2 rounded-lg bg-white border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-1.5">
            <div className="w-20">
              <p className="text-[9px] text-gray-400 mb-0.5">{t.bookSeats || "Seats"}</p>
              <input
                type="number"
                value={paxSeats}
                onChange={(e) => setPaxSeats(e.target.value)}
                min="1"
                max={seatsLeft > 0 ? seatsLeft : 1}
                className="w-full px-2 py-2 rounded-lg bg-white border border-gray-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex-1 flex gap-1.5 items-end">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg text-[10px] hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {submitting ? "..." : t.bookSubmit || "Confirm"}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="py-2 px-2.5 bg-gray-200 text-gray-600 font-medium rounded-lg text-[10px] hover:bg-gray-300 transition-all"
              >
                {t.bookCancel || "Cancel"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Booking confirmation */}
      {confirmed && (
        <div className="bg-green-50 rounded-lg p-3 mb-2 text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-green-700 mb-1">{t.bookSuccess}</p>
          <p className="text-[10px] text-green-600 mb-2">{from} → {to}, {trip.date}</p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-[10px] font-bold rounded-lg hover:bg-green-600 transition-all"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
            {t.bookWhatsApp || "WhatsApp"}
          </a>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-1.5">
        {trip.pickupLat !== 0 && (
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
            {t.pickupPoint}
          </a>
        )}

        {!confirmed && (
          <button
            onClick={() => setFormOpen(!formOpen)}
            disabled={seatsLeft <= 0}
            className="flex-1 py-1.5 rounded bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-700 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.book}
          </button>
        )}
      </div>
    </div>
  );
}
