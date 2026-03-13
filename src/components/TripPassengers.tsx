"use client";

import { useState, useEffect } from "react";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

const SUPABASE_URL = "https://wxwjsyhrykiexkkoyhoz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2pzeWhyeWtpZXhra295aG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjEwNDcsImV4cCI6MjA4ODczNzA0N30.53Ww3hcMl6xirqELFvgZGe-k_Oxfjx6xyAaEAkcOjJ4";

interface Booking {
  id: string;
  route_id: string;
  passenger_name: string;
  phone: string;
  pickup_point: string;
  dropoff_point: string;
  seats_count: number;
}

interface RouteInfo {
  id: string;
  carrier: string;
  from_key: string;
  to_key: string;
  trip_date: string;
  total_seats: number;
  departure: string;
  arrival: string;
  duration: string;
  price: string;
  phone: string;
  waypoints: string[];
}

async function sbFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
      ...options?.headers,
    },
  });
  if (!res.ok) return null;
  return res.json();
}

export default function TripPassengers({ dict, driverId, refreshKey = 0, companyDriverIds }: { dict: Dict; driverId: string; refreshKey?: number; companyDriverIds?: string[] }) {
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [seatsCount, setSeatsCount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const driverDict = dict.driver as Record<string, string>;
  const cities = dict.cities as Record<string, string>;

  // Load driver's routes (or all company routes for dispatcher)
  useEffect(() => {
    async function load() {
      let url: string;
      if (companyDriverIds && companyDriverIds.length > 0) {
        // Dispatcher: load routes for all company drivers
        const ids = companyDriverIds.map(id => `"${id}"`).join(",");
        url = `routes?carrier_id=in.(${ids})&select=id,carrier,from_key,to_key,trip_date,total_seats,departure,arrival,duration,price,phone,waypoints&order=trip_date.desc`;
      } else {
        url = `routes?carrier_id=eq.${driverId}&select=id,carrier,from_key,to_key,trip_date,total_seats,departure,arrival,duration,price,phone,waypoints&order=trip_date.desc`;
      }
      const data = await sbFetch(url);
      if (data) setRoutes(data);
    }
    if (driverId) load();
  }, [driverId, refreshKey, companyDriverIds]);

  // Load bookings for selected route
  useEffect(() => {
    async function load() {
      if (!selectedRoute) { setBookings([]); return; }
      setLoading(true);
      const data = await sbFetch(`bookings?route_id=eq.${selectedRoute}&order=created_at`);
      if (data) setBookings(data);
      setLoading(false);
    }
    load();
  }, [selectedRoute]);

  const currentRoute = routes.find(r => r.id === selectedRoute);
  const totalBooked = bookings.reduce((sum, b) => sum + b.seats_count, 0);
  const totalSeats = currentRoute?.total_seats || 20;
  const seatsLeft = totalSeats - totalBooked;

  async function handleAddPassenger(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRoute) return;

    const booking = {
      route_id: selectedRoute,
      passenger_name: name,
      phone,
      pickup_point: pickup,
      dropoff_point: dropoff,
      seats_count: parseInt(seatsCount) || 1,
    };

    const data = await sbFetch("bookings", {
      method: "POST",
      body: JSON.stringify(booking),
    });

    if (data && data.length > 0) {
      setBookings([...bookings, data[0]]);
      setName("");
      setPhone("");
      setPickup("");
      setDropoff("");
      setSeatsCount("1");
      setShowForm(false);
    }
  }

  async function handleDeleteRoute(routeId: string) {
    const route = routes.find(r => r.id === routeId);
    if (!route) return;
    const routeName = `${cities[route.from_key] || route.from_key} → ${cities[route.to_key] || route.to_key} (${route.trip_date})`;
    const confirmMsg = (dict.search as Record<string, string>).submit === "Найти"
      ? `Удалить рейс "${routeName}" и всех пассажиров?`
      : (dict.search as Record<string, string>).submit === "Знайти"
        ? `Видалити рейс "${routeName}" та всіх пасажирів?`
        : `Ștergeți cursa "${routeName}" și toți pasagerii?`;
    if (!confirm(confirmMsg)) return;
    // Delete bookings first, then route
    await sbFetch(`bookings?route_id=eq.${routeId}`, { method: "DELETE" });
    await sbFetch(`routes?id=eq.${routeId}`, { method: "DELETE" });
    setRoutes(routes.filter(r => r.id !== routeId));
    setSelectedRoute("");
    setBookings([]);
  }

  async function handleDeleteBooking(id: string, name: string) {
    const confirmMsg = (dict.search as Record<string, string>).submit === "Найти"
      ? `Удалить пассажира "${name}"?`
      : (dict.search as Record<string, string>).submit === "Знайти"
        ? `Видалити пасажира "${name}"?`
        : `Ștergeți pasagerul "${name}"?`;
    if (!confirm(confirmMsg)) return;
    await sbFetch(`bookings?id=eq.${id}`, { method: "DELETE" });
    setBookings(bookings.filter(b => b.id !== id));
  }

  function buildPassengerText() {
    if (!currentRoute || bookings.length === 0) return "";
    const route = currentRoute;
    const header = `${cities[route.from_key] || route.from_key} → ${cities[route.to_key] || route.to_key} (${route.trip_date})`;
    const lines = bookings.map((b, i) => {
      let line = `${i + 1}. ${b.passenger_name} | ${b.phone}`;
      if (b.seats_count > 1) line += ` | x${b.seats_count}`;
      if (b.pickup_point && b.dropoff_point) line += ` | ${b.pickup_point} → ${b.dropoff_point}`;
      return line;
    });
    return `${header}\n${lines.join("\n")}\n${totalBooked}/${totalSeats}`;
  }

  async function handleCopyList() {
    const text = buildPassengerText();
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSendWhatsApp() {
    const text = buildPassengerText();
    if (!text) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-xs font-bold text-gray-800">{driverDict.passengers || "Passengers"}</h3>
        </div>
        {/* Trip counter for subscription control */}
        {routes.length > 0 && (
          <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded">
            {driverDict.totalTrips || "Trips"}: {routes.length}
          </span>
        )}
      </div>

      {/* Route selector */}
      {routes.length > 0 ? (
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue-500 mb-2"
        >
          <option value="">-- {dict.driver.from} → {dict.driver.to} --</option>
          {routes.map((r) => (
            <option key={r.id} value={r.id}>
              {companyDriverIds ? `[${r.carrier}] ` : ""}{cities[r.from_key] || r.from_key} → {cities[r.to_key] || r.to_key} ({r.trip_date})
            </option>
          ))}
        </select>
      ) : (
        <p className="text-[10px] text-gray-400 mb-2">{driverDict.noPassengers}</p>
      )}

      {selectedRoute && currentRoute && (
        <>
          {/* Trip details */}
          <div className="bg-gray-50 rounded-lg p-2.5 mb-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800">
                {cities[currentRoute.from_key] || currentRoute.from_key} → {cities[currentRoute.to_key] || currentRoute.to_key}
              </span>
              <span className="text-[10px] font-semibold text-blue-600">{currentRoute.price ? `${currentRoute.price} €` : ""}</span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-500">
              <span>📅 {currentRoute.trip_date}</span>
              {currentRoute.departure && <span>🕐 {currentRoute.departure}{currentRoute.arrival ? ` → ${currentRoute.arrival}` : ""}</span>}
              {currentRoute.duration && <span>⏱ {currentRoute.duration}</span>}
              {currentRoute.phone && <span>📞 {currentRoute.phone}</span>}
            </div>
            {currentRoute.waypoints && currentRoute.waypoints.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {currentRoute.waypoints.map((wp, i) => (
                  <span key={i} className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{cities[wp] || wp}</span>
                ))}
              </div>
            )}
          </div>

          {/* Seats info + actions */}
          <div className="flex items-center justify-between mb-2">
            {seatsLeft > 0 ? (
              <span className="text-[10px] text-gray-600">
                {(dict.trips as Record<string, string>).seatsLeft
                  ?.replace("{left}", String(seatsLeft))
                  .replace("{total}", String(totalSeats)) || `${seatsLeft}/${totalSeats}`}
              </span>
            ) : (
              <span className="text-[10px] text-red-600 font-bold">
                {(dict.trips as Record<string, string>).noSeats || "No seats"}
              </span>
            )}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleDeleteRoute(selectedRoute)}
                className="text-[10px] bg-red-50 text-red-600 font-bold px-3 py-1.5 rounded-lg hover:bg-red-100 active:scale-[0.98] transition-all flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {(dict.clients as Record<string, string>).delete || "Delete"}
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-[10px] bg-yellow-400 text-gray-900 font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-300 active:scale-[0.98] transition-all flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {driverDict.addPassenger || "Add"}
              </button>
            </div>
          </div>

          {/* Add passenger form */}
          {showForm && (
            <form onSubmit={handleAddPassenger} className="space-y-2 mb-3 bg-gray-50 rounded-lg p-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={driverDict.passengerName || "Name"}
                required
                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={driverDict.passengerPhone || "Phone"}
                required
                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder={driverDict.passengerFrom || "Pickup"}
                  className="px-2 py-2 rounded-lg bg-white border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder={driverDict.passengerTo || "Dropoff"}
                  className="px-2 py-2 rounded-lg bg-white border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  value={seatsCount}
                  onChange={(e) => setSeatsCount(e.target.value)}
                  placeholder={driverDict.passengerSeats || "Seats"}
                  min="1"
                  max="10"
                  className="px-2 py-2 rounded-lg bg-white border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-xs hover:bg-blue-700 active:scale-[0.98] transition-all">
                {driverDict.addPassenger || "Add"}
              </button>
            </form>
          )}

          {/* Passengers list */}
          {loading ? (
            <div className="flex justify-center py-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-center text-[10px] text-gray-400 py-2">{driverDict.noPassengers}</p>
          ) : (
            <div className="space-y-1.5">
              {bookings.map((b, i) => (
                <div key={b.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-gray-400 shrink-0">{i + 1}.</span>
                      <span className="text-xs font-semibold text-gray-800 truncate">{b.passenger_name}</span>
                      <span className="text-[10px] text-gray-400">{b.seats_count > 1 ? `x${b.seats_count}` : ""}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <span className="text-[10px] text-gray-500">{b.phone}</span>
                      {b.pickup_point && b.dropoff_point && (
                        <span className="text-[9px] text-gray-400">({b.pickup_point} → {b.dropoff_point})</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBooking(b.id, b.passenger_name)}
                    className="text-gray-300 hover:text-red-500 transition-colors shrink-0 ml-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="text-right text-[10px] text-gray-500 pt-1">
                {totalBooked} / {totalSeats}
              </div>
            </div>
          )}

          {/* Copy & WhatsApp buttons */}
          {bookings.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <button
                onClick={handleCopyList}
                className="flex-1 text-[10px] bg-gray-100 text-gray-700 font-semibold px-2.5 py-2 rounded-lg hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copied ? (driverDict.copied || "Copied!") : (driverDict.copyList || "Copy list")}
              </button>
              <button
                onClick={handleSendWhatsApp}
                className="flex-1 text-[10px] bg-green-500 text-white font-semibold px-2.5 py-2 rounded-lg hover:bg-green-600 active:scale-[0.98] transition-all flex items-center justify-center gap-1"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {driverDict.sendWhatsApp || "WhatsApp"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
