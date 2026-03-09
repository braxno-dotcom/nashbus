"use client";

import { useState } from "react";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

export interface ActiveTrip {
  from: string;
  to: string;
  date: string;
  busNumber: string;
  waypoints: string[];
}

const ACTIVE_TRIP_KEY = "nashbus_active_trip";

export function getActiveTrip(): ActiveTrip | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(ACTIVE_TRIP_KEY);
  if (!data) return null;
  const parsed = JSON.parse(data);
  // Migration: old format without waypoints
  if (!parsed.waypoints) parsed.waypoints = [];
  return parsed;
}

export default function AddTripForm({ dict }: { dict: Dict }) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [waypoints, setWaypoints] = useState<string[]>([]);

  function addWaypoint() {
    setWaypoints([...waypoints, ""]);
  }

  function updateWaypoint(index: number, value: string) {
    const updated = [...waypoints];
    updated[index] = value;
    setWaypoints(updated);
  }

  function removeWaypoint(index: number) {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const filteredWaypoints = waypoints.filter((w) => w.trim() !== "");
    const trip: ActiveTrip = { from, to, date, busNumber, waypoints: filteredWaypoints };
    localStorage.setItem(ACTIVE_TRIP_KEY, JSON.stringify(trip));
    alert(dict.driver.success);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-2.5 bg-yellow-400 text-gray-900 font-bold rounded-lg text-xs hover:bg-yellow-300 active:scale-[0.98] transition-all flex items-center justify-center gap-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {dict.driver.title}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-xl p-4 mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800">{dict.driver.title}</h3>
              <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 text-xs">✕</button>
            </div>
            <p className="text-[11px] text-gray-500 mb-3">{dict.driver.subtitle}</p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} placeholder={dict.driver.from} required className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500" />
                <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder={dict.driver.to} required className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              </div>

              {/* Waypoints */}
              <div className="space-y-1.5">
                {waypoints.length > 0 && (
                  <p className="text-[10px] text-gray-500 font-semibold">{dict.driver.waypoints}:</p>
                )}
                {waypoints.map((wp, i) => (
                  <div key={i} className="flex gap-1.5">
                    <div className="flex items-center gap-1 flex-1">
                      <span className="text-[9px] text-gray-400 shrink-0 w-4 text-center">{i + 1}.</span>
                      <input
                        type="text"
                        value={wp}
                        onChange={(e) => updateWaypoint(i, e.target.value)}
                        placeholder={`${dict.driver.waypoints} ${i + 1}`}
                        className="flex-1 px-2 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWaypoint(i)}
                      className="px-2 py-1.5 rounded-lg bg-red-50 text-red-500 text-[10px] hover:bg-red-100 transition-colors shrink-0"
                    >
                      {dict.driver.removeWaypoint}
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addWaypoint}
                  className="w-full py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-500 text-[10px] hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {dict.driver.addWaypoint}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="px-2 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue-500" />
                <input type="number" placeholder={dict.driver.price} min="1" required className="px-2 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500" />
                <input type="text" value={busNumber} onChange={(e) => setBusNumber(e.target.value)} placeholder={dict.clients.busNumber} className="px-2 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              </div>
              <input type="number" placeholder={dict.driver.seats} min="1" max="60" required className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              <input type="url" placeholder={dict.driver.pickupMap} className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              <input type="tel" placeholder={dict.driver.phone} required className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              <button type="submit" className="w-full bg-yellow-400 text-gray-900 font-bold py-2.5 rounded-lg text-xs hover:bg-yellow-300 active:scale-[0.98] transition-all">
                {dict.driver.submit}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
