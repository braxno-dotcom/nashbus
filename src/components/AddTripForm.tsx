"use client";

import { useState } from "react";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

export default function AddTripForm({ dict }: { dict: Dict }) {
  const [open, setOpen] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert(dict.driver.success);
    setOpen(false);
  }

  return (
    <>
      {/* Trigger button — visible on mobile */}
      <button
        onClick={() => setOpen(true)}
        className="w-full py-4 sm:py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl text-base sm:text-sm hover:bg-yellow-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {dict.driver.title}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          ></div>
          <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {dict.driver.title}
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">{dict.driver.subtitle}</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={dict.driver.from}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
                <input
                  type="text"
                  placeholder={dict.driver.to}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="date"
                  required
                  className="w-full px-3 py-3 rounded-xl bg-gray-50 border-2 border-transparent text-gray-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
                <input
                  type="number"
                  placeholder={dict.driver.price}
                  min="1"
                  required
                  className="w-full px-3 py-3 rounded-xl bg-gray-50 border-2 border-transparent text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
                <input
                  type="number"
                  placeholder={dict.driver.seats}
                  min="1"
                  max="60"
                  required
                  className="w-full px-3 py-3 rounded-xl bg-gray-50 border-2 border-transparent text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <input
                type="url"
                placeholder={dict.driver.pickupMap}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />

              <input
                type="tel"
                placeholder={dict.driver.phone}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />

              <button
                type="submit"
                className="w-full bg-yellow-400 text-gray-900 font-bold py-4 sm:py-3 rounded-xl text-base sm:text-sm hover:bg-yellow-300 active:scale-[0.98] transition-all mt-2"
              >
                {dict.driver.submit}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
