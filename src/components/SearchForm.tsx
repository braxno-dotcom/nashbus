"use client";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

export default function SearchForm({ dict }: { dict: Dict }) {
  return (
    <form className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder={dict.search.from}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder={dict.search.to}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-3">
        <input
          type="date"
          className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all text-sm"
        >
          {dict.search.submit}
        </button>
      </div>
    </form>
  );
}
