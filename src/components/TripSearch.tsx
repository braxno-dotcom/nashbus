"use client";

import { useState } from "react";
import TripCard from "./TripCard";
import type { Trip } from "./TripCard";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function matchesCity(query: string, cityKey: string, cities: Record<string, string>): boolean {
  if (!query) return true;
  const q = normalize(query);
  const translated = cities[cityKey] || "";
  return normalize(cityKey).includes(q) || normalize(translated).includes(q);
}

export default function TripSearch({ trips, dict }: { trips: Trip[]; dict: Dict }) {
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searched, setSearched] = useState(false);

  const cities = dict.cities as Record<string, string>;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearched(true);
  }

  function handleReset() {
    setSearchFrom("");
    setSearchTo("");
    setSearchDate("");
    setSearched(false);
  }

  // Smart search: check if from/to match any city in the full route
  const filtered = searched
    ? trips.filter((trip) => {
        const fullRoute = [trip.fromKey, ...(trip.waypoints || []), trip.toKey];

        // Find if "from" matches any city in route
        const fromMatch = searchFrom
          ? fullRoute.findIndex((key) => matchesCity(searchFrom, key, cities))
          : 0;

        // Find if "to" matches any city in route (must be after fromMatch)
        const toMatch = searchTo
          ? fullRoute.findIndex((key, i) => i > fromMatch && matchesCity(searchTo, key, cities))
          : fullRoute.length - 1;

        const routeMatch = fromMatch !== -1 && toMatch !== -1 && fromMatch < toMatch;

        // Date filter (optional)
        const dateMatch = !searchDate || trip.date.includes(searchDate.split("-").reverse().join("."));

        return routeMatch && dateMatch;
      })
    : trips;

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
                className="bg-blue-600 text-white font-bold px-5 py-2 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all text-xs"
              >
                {dict.search.submit}
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
          <h2 className="text-sm font-bold text-gray-800 mb-3">
            {dict.trips.title}
          </h2>
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-6">{dict.trips.noResults}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((trip) => (
                <TripCard key={trip.id} trip={trip} dict={dict} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
