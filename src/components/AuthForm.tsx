"use client";

import { useState } from "react";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

const DRIVER_PASS = "driver2026";
const AUTH_KEY = "nashbus_driver_auth";
const AUTH_SESSION_KEY = "nashbus_driver_auth_session";
const DRIVER_INFO_KEY = "nashbus_driver_info";

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
}

export function getDriverAuth(): DriverInfo | null {
  if (typeof window === "undefined") return null;
  const remembered = localStorage.getItem(AUTH_KEY);
  const session = sessionStorage.getItem(AUTH_SESSION_KEY);
  if (remembered !== DRIVER_PASS && session !== DRIVER_PASS) return null;
  const info = localStorage.getItem(DRIVER_INFO_KEY);
  if (!info) return null;
  try { return JSON.parse(info); } catch { return null; }
}

export function driverLogout() {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}

export default function AuthForm({ dict, onLogin }: { dict: Dict; onLogin: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== DRIVER_PASS) {
      setError(dict.auth.wrongPassword);
      return;
    }

    // Save auth
    if (remember) {
      localStorage.setItem(AUTH_KEY, DRIVER_PASS);
    } else {
      sessionStorage.setItem(AUTH_SESSION_KEY, DRIVER_PASS);
    }

    // Save/update driver info
    const existing = localStorage.getItem(DRIVER_INFO_KEY);
    let info: DriverInfo;
    if (existing) {
      try {
        info = JSON.parse(existing);
        if (name) info.name = name;
        if (phone) info.phone = phone;
      } catch {
        info = { id: Date.now().toString(), name, phone };
      }
    } else {
      info = { id: Date.now().toString(), name, phone };
    }
    localStorage.setItem(DRIVER_INFO_KEY, JSON.stringify(info));

    onLogin();
  }

  // Check if we have saved info to pre-fill
  const savedInfo = typeof window !== "undefined" ? localStorage.getItem(DRIVER_INFO_KEY) : null;
  const hasSavedInfo = !!savedInfo;

  return (
    <div className="max-w-sm mx-auto py-8">
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
        <div className="text-center mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-gray-800">{dict.auth.title}</h2>
          <p className="text-[10px] text-gray-400">{dict.auth.subtitle}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded px-3 py-1.5 mb-3">
            <p className="text-[10px] text-red-600 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">
          {!hasSavedInfo && (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={dict.auth.name}
                required
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={dict.auth.phone}
                required
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={dict.auth.password}
            required
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-[10px] text-gray-500">{(dict.auth as Record<string, string>).remember || "Remember me"}</span>
          </label>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            {dict.auth.login}
          </button>
        </form>
      </div>
    </div>
  );
}
