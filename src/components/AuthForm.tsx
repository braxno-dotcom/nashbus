"use client";

import { useState } from "react";
import { login, register } from "@/lib/auth-storage";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

export default function AuthForm({ dict, onLogin }: { dict: Dict; onLogin: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "register") {
      const result = register(name, phone, password);
      if (result.ok) {
        setSuccess(dict.auth.registered);
        setMode("login");
      } else {
        setError(dict.auth.notFound);
      }
    } else {
      const result = login(phone, password);
      if (result.ok) {
        onLogin();
      } else {
        setError(result.error === "notFound" ? dict.auth.notFound : dict.auth.wrongPassword);
      }
    }
  }

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
        {success && (
          <div className="bg-green-50 border border-green-200 rounded px-3 py-1.5 mb-3">
            <p className="text-[10px] text-green-600 font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">
          {mode === "register" && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={dict.auth.name}
              required
              className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          )}
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={dict.auth.phone}
            required
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={dict.auth.password}
            required
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            {mode === "login" ? dict.auth.login : dict.auth.register}
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-400 mt-3">
          {mode === "login" ? dict.auth.noAccount : dict.auth.hasAccount}{" "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setSuccess(""); }}
            className="text-blue-600 font-semibold hover:underline"
          >
            {mode === "login" ? dict.auth.register : dict.auth.login}
          </button>
        </p>
      </div>
    </div>
  );
}
