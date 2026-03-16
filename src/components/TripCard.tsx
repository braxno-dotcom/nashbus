"use client";

import { useState } from "react";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

const SUPABASE_URL = "https://wxwjsyhrykiexkkoyhoz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2pzeWhyeWtpZXhra295aG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjEwNDcsImV4cCI6MjA4ODczNzA0N30.53Ww3hcMl6xirqELFvgZGe-k_Oxfjx6xyAaEAkcOjJ4";

interface Trip {
  id: string;
  carrier: string;
  companyName?: string;
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
  const [paxSeats, setPaxSeats] = useState("");

  const cities = dict.cities as Record<string, string>;
  const t = dict.trips as Record<string, string>;
  const from = cities[trip.fromKey] || trip.fromKey;
  const to = cities[trip.toKey] || trip.toKey;

  const fullRoute = [trip.fromKey, ...(trip.waypoints || []), trip.toKey];
  const fullRouteNames = fullRoute.map((key) => cities[key] || key);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${trip.pickupLat},${trip.pickupLng}`;

  // Parse multiple phones: split by comma, semicolon, or slash
  const phones = trip.phone
    .split(/[,;/]/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const clean = p.replace(/[^0-9+]/g, "");
      const digits = clean.replace(/[^0-9]/g, "");
      return { display: p.trim(), clean, digits };
    })
    .filter((p) => p.digits.length >= 7);

  const mainPhone = phones[0] || { display: trip.phone, clean: trip.phone.replace(/[^0-9+]/g, ""), digits: trip.phone.replace(/[^0-9]/g, "") };

  const messageText = t.bookMessage
    .replace("{from}", from)
    .replace("{to}", to)
    .replace("{date}", trip.date);

  const waUrl = `https://wa.me/${mainPhone.digits}?text=${encodeURIComponent(messageText)}`;
  const viberUrl = `viber://chat?number=${encodeURIComponent(mainPhone.clean)}`;
  const callUrl = `tel:${mainPhone.clean}`;

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
      setFormOpen(false);
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
            <p className="text-xs font-semibold text-gray-800">{trip.companyName || trip.carrier}</p>
            <div className="flex items-center gap-1.5">
              {trip.companyName && (
                <span className="text-[9px] bg-gray-100 text-gray-500 font-medium px-1 py-px rounded">{trip.carrier}</span>
              )}
              <p className="text-[10px] text-gray-400">{trip.date}</p>
            </div>
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

      {/* Booking modal */}
      {formOpen && !confirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white w-full max-w-sm rounded-xl p-4 mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800">{t.book}</h3>
              <button onClick={() => setFormOpen(false)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 text-xs">✕</button>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 mb-3">
              <p className="text-xs font-bold text-gray-800">{from} → {to}</p>
              <p className="text-[10px] text-gray-500">{trip.date}{trip.departure ? `, ${trip.departure}` : ""} · {trip.carrier}</p>
            </div>
            <form onSubmit={handleBooking} className="space-y-2">
              <input
                type="text"
                value={paxName}
                onChange={(e) => setPaxName(e.target.value)}
                placeholder={t.bookName || "Name"}
                required
                className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <input
                type="tel"
                value={paxPhone}
                onChange={(e) => setPaxPhone(e.target.value)}
                placeholder={t.bookPhone || "Phone"}
                required
                className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <div>
                <p className="text-[10px] text-gray-500 mb-0.5">{t.bookSeats || "Seats"}</p>
                <input
                  type="number"
                  value={paxSeats}
                  onChange={(e) => setPaxSeats(e.target.value)}
                  min="1"
                  max={seatsLeft > 0 ? seatsLeft : 1}
                  placeholder="1"
                  required
                  className="w-20 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg text-xs hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {submitting ? "..." : t.bookSubmit || "Confirm"}
              </button>
            </form>
          </div>
        </div>
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

      {/* Contact buttons */}
      <div className="flex gap-1 mb-1.5 flex-wrap">
        <a href={callUrl} className="py-1.5 px-2.5 rounded bg-gray-700 text-white text-[10px] font-bold hover:bg-gray-800 active:scale-95 transition-all flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          {mainPhone.display}
        </a>
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="py-1.5 px-2.5 rounded bg-green-500 text-white text-[10px] font-bold hover:bg-green-600 active:scale-95 transition-all flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
          WhatsApp
        </a>
        <a href={viberUrl} className="py-1.5 px-2.5 rounded text-white text-[10px] font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1" style={{background: "#7360f2"}}>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.6 6.7.52 9.867c-.08 3.167-.18 9.093 5.56 10.573h.007l-.007 2.427s-.04.98.607 1.18c.778.24 1.236-.5 1.98-1.3.407-.44.967-1.087 1.387-1.58 3.82.32 6.76-.413 7.093-.527.773-.26 5.14-.807 5.853-6.587.74-5.953-.353-9.72-2.22-11.4 0 0 0-.003 0-.003-.56-.533-2.8-2.013-7.38-2.187 0 0-.36-.02-.853-.04-.16-.007-.327-.007-.507-.007v.004zM11.52 1.6h.413c.4.013.76.033.76.033 4.14.16 6.12 1.387 6.6 1.84h.007c1.567 1.4 2.467 4.78 1.82 9.96-.6 4.78-4.087 5.147-4.74 5.367-.28.093-2.88.727-6.2.533 0 0-2.453 2.96-3.22 3.733-.12.12-.26.167-.353.147-.133-.027-.167-.18-.167-.393l.027-4.093c-4.88-1.253-4.593-6.28-4.527-8.947.067-2.667.633-4.867 2.107-6.327 1.96-1.807 5.56-2.073 7.473-2.1v.247zM12 5.06c-.2 0-.2.307 0 .313 1.513.073 2.793.587 3.773 1.467 1.08.973 1.593 2.227 1.653 3.88.007.2.313.193.307 0-.067-1.773-.627-3.14-1.813-4.2-1.06-.96-2.453-1.533-4.107-1.46h.187zm-3.46.98c-.36-.007-.74.12-1.04.367-.56.453-.607 1.08-.447 1.347.533 1.053 1.107 1.56 1.8 2.413.76.94 1.72 1.867 2.867 2.693.253.18.5.347.74.5 0 0 .013.007.04.02l.013.007h.007c.893.553 1.633.753 2.327.973l.073.02c.133.04.267.047.4.04.627-.047 1.087-.44 1.2-.927.047-.2.013-.407-.06-.587-.353-.727-.78-.98-1.347-1.333l-.2-.127c-.413-.28-.607-.307-.953-.087l-.46.367c-.32.233-.627.173-.627.173l-.013.007c-2-.513-3.307-2.06-3.573-2.4l-.007-.007s-.06-.313.18-.627l.293-.527c.173-.373.107-.553-.22-.927l-.16-.2c-.407-.5-.7-.84-1.22-1.413-.16-.173-.373-.26-.593-.267zM12.72 6c-.2-.02-.22.287-.02.307 1.053.127 1.88.573 2.533 1.253.64.66.96 1.467 1.007 2.473.007.2.32.18.307-.02-.047-1.093-.407-2.013-1.12-2.74-.72-.74-1.627-1.2-2.793-1.34h.087v.067zm.107 1.04c-.207-.013-.227.28-.02.307.767.127 1.4.427 1.847.947.447.52.647 1.1.627 1.84-.007.2.3.207.307.007.027-.84-.2-1.52-.72-2.113-.52-.587-1.253-.92-2.12-1.047h.08v.06z"/></svg>
          Viber
        </a>
      </div>
      {/* Extra phones */}
      {phones.length > 1 && (
        <div className="flex gap-1 mb-1.5 flex-wrap">
          {phones.slice(1).map((p, i) => (
            <a key={i} href={`tel:${p.clean}`} className="py-1 px-2 rounded bg-gray-100 text-gray-700 text-[9px] font-semibold hover:bg-gray-200 transition-all flex items-center gap-1">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              {p.display}
            </a>
          ))}
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
