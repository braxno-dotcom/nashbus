"use client";

import { useState, useEffect, useRef } from "react";
import { getSession, logout } from "@/lib/auth-storage";
import AuthForm from "./AuthForm";
import AddTripForm from "./AddTripForm";
import DriverClients from "./DriverClients";
import TripPassengers from "./TripPassengers";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

const SUPABASE_URL = "https://wxwjsyhrykiexkkoyhoz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2pzeWhyeWtpZXhra295aG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjEwNDcsImV4cCI6MjA4ODczNzA0N30.53Ww3hcMl6xirqELFvgZGe-k_Oxfjx6xyAaEAkcOjJ4";
const LOGO_KEY = "nashbus_driver_logo";

async function uploadLogo(file: File, driverId: string): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const fileName = `driver_${driverId}_${Date.now()}.${ext}`;

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/logos/${fileName}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "apikey": SUPABASE_KEY,
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!res.ok) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/logos/${fileName}`;
}

export default function DriverPageClient({ dict }: { dict: Dict }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [driverId, setDriverId] = useState("");
  const [driverName, setDriverName] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [tripRefresh, setTripRefresh] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { account, expired } = getSession();
    if (account) {
      setLoggedIn(true);
      setDriverId(account.id);
      setDriverName(account.name);
      // Load saved logo
      const saved = localStorage.getItem(`${LOGO_KEY}_${account.id}`);
      if (saved) setLogoUrl(saved);
    } else if (expired) {
      setSessionExpired(true);
    }
    setLoading(false);
  }, []);

  function handleLogin() {
    const { account } = getSession();
    if (account) {
      setLoggedIn(true);
      setDriverId(account.id);
      setDriverName(account.name);
      setSessionExpired(false);
      const saved = localStorage.getItem(`${LOGO_KEY}_${account.id}`);
      if (saved) setLogoUrl(saved);
    }
  }

  function handleLogout() {
    logout();
    setLoggedIn(false);
    setDriverId("");
    setDriverName("");
    setLogoUrl("");
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadLogo(file, driverId);
    setUploading(false);

    if (url) {
      setLogoUrl(url);
      localStorage.setItem(`${LOGO_KEY}_${driverId}`, url);
    } else {
      alert("Upload error");
    }
  }

  function handleLogoDelete() {
    setLogoUrl("");
    localStorage.removeItem(`${LOGO_KEY}_${driverId}`);
    if (fileRef.current) fileRef.current.value = "";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!loggedIn) {
    return <AuthForm dict={dict} onLogin={handleLogin} sessionExpired={sessionExpired} />;
  }

  return (
    <div className="space-y-4">
      {/* Welcome + logo + logout */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo / avatar */}
            <div
              onClick={() => fileRef.current?.click()}
              className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors overflow-hidden shrink-0"
            >
              {logoUrl ? (
                <img src={logoUrl} alt="logo" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
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

        {/* Logo actions */}
        <div className="flex items-center gap-2 mt-2 ml-12">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="text-[10px] text-blue-600 hover:underline disabled:text-gray-400"
          >
            {uploading ? dict.driver.logoUploading : dict.driver.logoUpload}
          </button>
          {logoUrl && (
            <button
              type="button"
              onClick={handleLogoDelete}
              className="text-[10px] text-red-500 hover:underline"
            >
              {dict.driver.logoDelete}
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="hidden"
        />
      </div>

      <AddTripForm dict={dict} driverId={driverId} driverName={driverName} driverLogoUrl={logoUrl} onTripAdded={() => setTripRefresh(prev => prev + 1)} />
      <TripPassengers dict={dict} driverId={driverId} refreshKey={tripRefresh} />
      <DriverClients dict={dict} driverId={driverId} />
    </div>
  );
}
