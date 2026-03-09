"use client";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

export default function SearchForm({ dict }: { dict: Dict }) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert(dict.search.started);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 border border-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        {/* From */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" strokeWidth={2} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={dict.search.from}
            className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-50 border-2 border-transparent text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* To */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={dict.search.to}
            className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-50 border-2 border-transparent text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Date */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            type="date"
            className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-50 border-2 border-transparent text-gray-800 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold px-6 py-4 sm:py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all text-base sm:text-sm shadow-lg shadow-blue-600/25"
      >
        {dict.search.submit}
      </button>
    </form>
  );
}
