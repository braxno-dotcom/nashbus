"use client";

import { useState } from "react";
import TripCard from "./TripCard";
import type { Trip } from "./TripCard";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

const SUPABASE_URL = "https://wxwjsyhrykiexkkoyhoz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2pzeWhyeWtpZXhra295aG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjEwNDcsImV4cCI6MjA4ODczNzA0N30.53Ww3hcMl6xirqELFvgZGe-k_Oxfjx6xyAaEAkcOjJ4";

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function matchesCity(query: string, cityKey: string, cities: Record<string, string>): boolean {
  if (!query) return true;
  const q = normalize(query);
  const translated = cities[cityKey] || "";
  return normalize(cityKey).includes(q) || normalize(translated).includes(q);
}

interface RouteRow {
  id: string;
  carrier: string;
  from_key: string;
  to_key: string;
  trip_date: string;
  departure: string;
  arrival: string;
  duration: string;
  price: string;
  seats: number;
  max_seats: number;
  parcels: boolean;
  pickup_lat: number;
  pickup_lng: number;
  phone: string;
  waypoints: string[];
  logo_url: string;
}

interface BookingCount {
  route_id: string;
  total: number;
}

function rowToTrip(row: RouteRow, bookedSeats: number): Trip {
  return {
    id: row.id,
    carrier: row.carrier,
    fromKey: row.from_key,
    toKey: row.to_key,
    date: row.trip_date,
    departure: row.departure || "",
    arrival: row.arrival || "",
    duration: row.duration || "",
    price: row.price || "",
    seats: row.seats || 0,
    maxSeats: row.max_seats || 20,
    bookedSeats,
    parcels: row.parcels || false,
    pickupLat: row.pickup_lat || 0,
    pickupLng: row.pickup_lng || 0,
    phone: row.phone || "",
    waypoints: row.waypoints || [],
    logoUrl: row.logo_url || "",
  };
}

export default function TripSearch({ dict }: { dict: Dict }) {
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const cities = dict.cities as Record<string, string>;

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchFrom && !searchTo) return;

    setLoading(true);
    setSearched(true);

    try {
      // Fetch all routes
      const res = await fetch(`${SUPABASE_URL}/rest/v1/routes?select=*&order=trip_date`, {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
        },
      });
      const rows: RouteRow[] = res.ok ? await res.json() : [];

      // Fetch booking counts
      const bRes = await fetch(`${SUPABASE_URL}/rest/v1/bookings?select=route_id,seats_count`, {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
        },
      });
      const bookingsRaw: { route_id: string; seats_count: number }[] = bRes.ok ? await bRes.json() : [];

      // Sum seats per route
      const bookedMap: Record<string, number> = {};
      for (const b of bookingsRaw) {
        bookedMap[b.route_id] = (bookedMap[b.route_id] || 0) + b.seats_count;
      }

      // Filter by search
      const filtered = rows
        .map((row) => rowToTrip(row, bookedMap[row.id] || 0))
        .filter((trip) => {
          const fullRoute = [trip.fromKey, ...(trip.waypoints || []), trip.toKey];

          const fromMatch = searchFrom
            ? fullRoute.findIndex((key) => matchesCity(searchFrom, key, cities))
            : 0;

          const toMatch = searchTo
            ? fullRoute.findIndex((key, i) => i > fromMatch && matchesCity(searchTo, key, cities))
            : fullRoute.length - 1;

          const routeMatch = fromMatch !== -1 && toMatch !== -1 && fromMatch < toMatch;

          const dateMatch = !searchDate || trip.date.includes(searchDate.split("-").reverse().join("."));

          return routeMatch && dateMatch;
        });

      setTrips(filtered);
    } catch {
      setTrips([]);
    }

    setLoading(false);
  }

  function handleReset() {
    setSearchFrom("");
    setSearchTo("");
    setSearchDate("");
    setSearched(false);
    setTrips([]);
  }

  return (
    <>
      {/* Search form */}
      <section id="search" className="px-4 -mt-5 relative z-10">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-md p-3 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                placeholder={dict.search.from}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 text-xs focus:outline-none focus:border-blue-500 transition-all"
              />
              <input
                type="text"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                placeholder={dict.search.to}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 text-xs focus:outline-none focus:border-blue-500 transition-all"
              />
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="sm:w-36 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 text-xs focus:outline-none focus:border-blue-500 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white font-bold px-5 py-2 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all text-xs disabled:opacity-50"
              >
                {loading ? "..." : dict.search.submit}
              </button>
            </div>
            {searched && (
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 text-[10px] text-blue-600 hover:underline"
              >
                ✕
              </button>
            )}
          </form>
        </div>
      </section>

      {/* Trip results */}
      <section className="px-4 py-4">
        <div className="max-w-5xl mx-auto">
          {searched && (
            <>
              <h2 className="text-sm font-bold text-gray-800 mb-3">
                {dict.trips.title}
              </h2>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : trips.length === 0 ? (
                <p className="text-center text-xs text-gray-400 py-6">{dict.trips.noResults}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {trips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} dict={dict} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
