"use client";

import { useState, useEffect } from "react";
import { getSession, logout } from "@/lib/auth-storage";
import AuthForm from "./AuthForm";
import AddTripForm from "./AddTripForm";
import DriverClients from "./DriverClients";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

export default function DriverPageClient({ dict }: { dict: Dict }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [driverId, setDriverId] = useState("");
  const [driverName, setDriverName] = useState("");

  useEffect(() => {
    const session = getSession();
    if (session) {
      setLoggedIn(true);
      setDriverId(session.id);
      setDriverName(session.name);
    }
  }, []);

  function handleLogin() {
    const session = getSession();
    if (session) {
      setLoggedIn(true);
      setDriverId(session.id);
      setDriverName(session.name);
    }
  }

  function handleLogout() {
    logout();
    setLoggedIn(false);
    setDriverId("");
    setDriverName("");
  }

  if (!loggedIn) {
    return <AuthForm dict={dict} onLogin={handleLogin} />;
  }

  return (
    <div className="space-y-4">
      {/* Welcome + logout */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-100 shadow-sm p-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">{dict.auth.welcome}, {driverName}!</p>
            <p className="text-[10px] text-gray-400">{dict.nav.driverPanel}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-[10px] text-red-500 font-medium hover:underline"
        >
          {dict.nav.logout}
        </button>
      </div>

      <AddTripForm dict={dict} />
      <DriverClients dict={dict} driverId={driverId} />
    </div>
  );
}
