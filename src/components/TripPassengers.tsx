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

export default function TripPassengers({ dict, driverId, refreshKey = 0 }: { dict: Dict; driverId: string; refreshKey?: number }) {
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

  const driverDict = dict.driver as Record<string, string>;

  // Load driver's routes
  useEffect(() => {
    async function load() {
      const data = await sbFetch(`routes?carrier_id=eq.${driverId}&select=id,carrier,from_key,to_key,trip_date,total_seats&order=trip_date.desc`);
      if (data) setRoutes(data);
    }
    if (driverId) load();
  }, [driverId, refreshKey]);

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

  const cities = dict.cities as Record<string, string>;

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
              {cities[r.from_key] || r.from_key} → {cities[r.to_key] || r.to_key} ({r.trip_date})
            </option>
          ))}
        </select>
      ) : (
        <p className="text-[10px] text-gray-400 mb-2">{driverDict.noPassengers}</p>
      )}

      {selectedRoute && (
        <>
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
        </>
      )}
    </div>
  );
}
