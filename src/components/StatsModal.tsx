"use client";

import { useState, useEffect } from "react";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

const SUPABASE_URL = "https://wxwjsyhrykiexkkoyhoz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2pzeWhyeWtpZXhra295aG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjEwNDcsImV4cCI6MjA4ODczNzA0N30.53Ww3hcMl6xirqELFvgZGe-k_Oxfjx6xyAaEAkcOjJ4";

interface Stats {
  tripsThisMonth: number;
  passengersThisMonth: number;
  passengersTotal: number;
}

async function fetchStats(driverId?: string): Promise<Stats> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const monthStart = `${year}-${month}-01`;
  const nextMonth = now.getMonth() === 11 ? `${year + 1}-01-01` : `${year}-${String(now.getMonth() + 2).padStart(2, "0")}-01`;

  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
  };

  // Fetch routes
  const routeFilter = driverId ? `&carrier_id=eq.${driverId}` : "";
  const routesRes = await fetch(`${SUPABASE_URL}/rest/v1/routes?select=id,trip_date${routeFilter}`, { headers });
  const routes: { id: string; trip_date: string }[] = routesRes.ok ? await routesRes.json() : [];

  const allRouteIds = routes.map(r => r.id);
  const monthRoutes = routes.filter(r => r.trip_date >= monthStart && r.trip_date < nextMonth);
  const monthRouteIds = new Set(monthRoutes.map(r => r.id));

  // Fetch bookings only for this driver's routes
  let relevantBookings: { route_id: string; seats_count: number }[] = [];
  if (allRouteIds.length > 0) {
    const idsParam = `(${allRouteIds.join(",")})`;
    const bookingsRes = await fetch(`${SUPABASE_URL}/rest/v1/bookings?select=route_id,seats_count&route_id=in.${idsParam}`, { headers });
    relevantBookings = bookingsRes.ok ? await bookingsRes.json() : [];
  } else if (!driverId) {
    const bookingsRes = await fetch(`${SUPABASE_URL}/rest/v1/bookings?select=route_id,seats_count`, { headers });
    relevantBookings = bookingsRes.ok ? await bookingsRes.json() : [];
  }

  const passengersTotal = relevantBookings.reduce((sum, b) => sum + (b.seats_count || 1), 0);
  const passengersThisMonth = relevantBookings
    .filter(b => monthRouteIds.has(b.route_id))
    .reduce((sum, b) => sum + (b.seats_count || 1), 0);

  return {
    tripsThisMonth: monthRoutes.length,
    passengersThisMonth,
    passengersTotal,
  };
}

const MONTH_NAMES: Record<string, string[]> = {
  uk: ["Січень","Лютий","Березень","Квітень","Травень","Червень","Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"],
  ru: ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
  ro: ["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"],
};

export default function StatsModal({ dict, driverId, lang }: { dict: Dict; driverId?: string; lang?: string }) {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  const d = dict.driver as Record<string, string>;
  const statLabel = d.statistics || "Statistics";
  const tripsLabel = d.statsTrips || "Trips this month";
  const paxMonthLabel = d.statsPaxMonth || "Passengers this month";
  const paxTotalLabel = d.statsPaxTotal || "Total passengers (platform)";

  const monthIdx = new Date().getMonth();
  const l = lang || "ru";
  const monthName = (MONTH_NAMES[l] || MONTH_NAMES.ru)[monthIdx];

  async function handleOpen() {
    setOpen(true);
    setLoading(true);
    const data = await fetchStats(driverId);
    setStats(data);
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-lg text-xs hover:bg-blue-100 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        {statLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-xl p-4 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800">{statLabel} — {monthName}</h3>
              <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 text-xs">✕</button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : stats ? (
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.tripsThisMonth}</p>
                  <p className="text-[10px] text-blue-500 font-medium">{tripsLabel}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.passengersThisMonth}</p>
                    <p className="text-[10px] text-green-500 font-medium">{paxMonthLabel}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-purple-600">{stats.passengersTotal}</p>
                    <p className="text-[10px] text-purple-500 font-medium">{paxTotalLabel}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
