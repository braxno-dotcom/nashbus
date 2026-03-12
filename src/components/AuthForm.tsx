"use client";

import { useState } from "react";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

const SUPABASE_URL = "https://wxwjsyhrykiexkkoyhoz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2pzeWhyeWtpZXhra295aG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjEwNDcsImV4cCI6MjA4ODczNzA0N30.53Ww3hcMl6xirqELFvgZGe-k_Oxfjx6xyAaEAkcOjJ4";

const AUTH_KEY = "nashbus_driver_code";
const DRIVER_INFO_KEY = "nashbus_driver_info";

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
}

export function getDriverAuth(): DriverInfo | null {
  if (typeof window === "undefined") return null;
  const code = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
  if (!code) return null;
  const info = localStorage.getItem(DRIVER_INFO_KEY);
  if (!info) return null;
  try { return JSON.parse(info); } catch { return null; }
}

export function driverLogout() {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(DRIVER_INFO_KEY);
}

async function checkCode(code: string): Promise<{ ok: boolean; driver?: DriverInfo; error?: string }> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/driver_codes?code=eq.${encodeURIComponent(code)}&is_active=eq.true&select=id,code,driver_name,phone,expires_at`,
    {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  if (!res.ok) return { ok: false, error: "network" };
  const data = await res.json();
  if (!data || data.length === 0) return { ok: false, error: "notFound" };

  const row = data[0];
  if (new Date(row.expires_at) < new Date()) return { ok: false, error: "expired" };

  return {
    ok: true,
    driver: { id: row.id, name: row.driver_name, phone: row.phone || "" },
  };
}

export default function AuthForm({ dict, onLogin }: { dict: Dict; onLogin: () => void }) {
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const authDict = dict.auth as Record<string, string>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await checkCode(code.trim());
    setLoading(false);

    if (!result.ok || !result.driver) {
      if (result.error === "expired") {
        setError(authDict.codeExpired || "Code expired");
      } else {
        setError(authDict.wrongPassword);
      }
      return;
    }

    // Save auth
    if (remember) {
      localStorage.setItem(AUTH_KEY, code.trim());
    } else {
      sessionStorage.setItem(AUTH_KEY, code.trim());
    }
    localStorage.setItem(DRIVER_INFO_KEY, JSON.stringify(result.driver));

    onLogin();
  }

  return (
    <div className="max-w-sm mx-auto py-8">
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
        <div className="text-center mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-gray-800">{dict.auth.title}</h2>
          <p className="text-[10px] text-gray-400">{authDict.codeHint || "Enter access code"}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded px-3 py-1.5 mb-3">
            <p className="text-[10px] text-red-600 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={authDict.codePlaceholder || "Access code"}
            required
            autoComplete="off"
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500 text-center tracking-widest font-mono"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-[10px] text-gray-500">{authDict.remember || "Remember me"}</span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "..." : dict.auth.login}
          </button>
        </form>
      </div>
    </div>
  );
}
