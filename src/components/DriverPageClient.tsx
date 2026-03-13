"use client";

import { useState, useEffect, useRef } from "react";
import AuthForm, { getDriverAuth, driverLogout } from "./AuthForm";
import AddTripForm from "./AddTripForm";
import DriverClients from "./DriverClients";
import TripPassengers from "./TripPassengers";
import StatsModal from "./StatsModal";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

const SUPABASE_URL = "https://wxwjsyhrykiexkkoyhoz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2pzeWhyeWtpZXhra295aG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjEwNDcsImV4cCI6MjA4ODczNzA0N30.53Ww3hcMl6xirqELFvgZGe-k_Oxfjx6xyAaEAkcOjJ4";
const LOGO_KEY = "nashbus_driver_logo";
const TG_BOT_USERNAME = "nashbus_notify_bot";

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

export default function DriverPageClient({ dict, lang }: { dict: Dict; lang?: string }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [driverId, setDriverId] = useState("");
  const [driverName, setDriverName] = useState("");
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [tripRefresh, setTripRefresh] = useState(0);
  const [tgStatus, setTgStatus] = useState<"idle" | "checking" | "connected" | "not_found">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const info = getDriverAuth();
    if (info) {
      setLoggedIn(true);
      setDriverId(info.id);
      setDriverName(info.name);
      const saved = localStorage.getItem(`${LOGO_KEY}_${info.id}`);
      if (saved) setLogoUrl(saved);
    }
    setLoading(false);
  }, []);

  function handleLogin() {
    const info = getDriverAuth();
    if (info) {
      setLoggedIn(true);
      setDriverId(info.id);
      setDriverName(info.name);
      const saved = localStorage.getItem(`${LOGO_KEY}_${info.id}`);
      if (saved) setLogoUrl(saved);
    }
  }

  function handleLogout() {
    driverLogout();
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
    if (!confirm(dict.driver.logoDelete + "?")) return;
    setLogoUrl("");
    localStorage.removeItem(`${LOGO_KEY}_${driverId}`);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleConnectTelegram() {
    setTgStatus("checking");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/connect_driver_telegram`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ p_driver_id: driverId }),
      });
      const result = await res.json();
      setTgStatus(result === "ok" ? "connected" : "not_found");
    } catch {
      setTgStatus("not_found");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!loggedIn) {
    return <AuthForm dict={dict} onLogin={handleLogin} />;
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

      {/* Telegram connection */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          <span className="text-xs font-bold text-gray-800">Telegram</span>
        </div>
        {tgStatus === "connected" ? (
          <p className="text-[10px] text-green-600 font-medium">✅ Подключено! Уведомления о бронях будут приходить в Telegram.</p>
        ) : (
          <div className="space-y-2">
            <p className="text-[10px] text-gray-500">Получайте уведомления о новых бронях в Telegram</p>
            <div className="flex gap-1.5">
              <a
                href={`https://t.me/${TG_BOT_USERNAME}?start=${driverId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 bg-blue-500 text-white font-bold rounded-lg text-[10px] text-center hover:bg-blue-600 active:scale-[0.98] transition-all"
              >
                1. Открыть бот
              </a>
              <button
                onClick={handleConnectTelegram}
                disabled={tgStatus === "checking"}
                className="flex-1 py-2 bg-green-500 text-white font-bold rounded-lg text-[10px] hover:bg-green-600 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {tgStatus === "checking" ? "..." : tgStatus === "not_found" ? "Попробовать снова" : "2. Подтвердить"}
              </button>
            </div>
            {tgStatus === "not_found" && (
              <p className="text-[10px] text-red-500">Не найдено. Нажмите "Открыть бот", отправьте Start, затем "Подтвердить".</p>
            )}
          </div>
        )}
      </div>

      <StatsModal dict={dict} driverId={driverId} lang={lang} />
      <AddTripForm dict={dict} driverId={driverId} driverName={driverName} driverLogoUrl={logoUrl} onTripAdded={() => setTripRefresh(prev => prev + 1)} />
      <TripPassengers dict={dict} driverId={driverId} refreshKey={tripRefresh} />

      {/* Divider */}
      <div className="border-t-2 border-dashed border-gray-200 my-2"></div>

      <DriverClients dict={dict} driverId={driverId} />
    </div>
  );
}
