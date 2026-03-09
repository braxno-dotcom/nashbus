"use client";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

export default function SearchForm({ dict }: { dict: Dict }) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert(dict.search.started);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-3 border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder={dict.search.from}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 text-xs focus:outline-none focus:border-blue-500 transition-all"
        />
        <input
          type="text"
          placeholder={dict.search.to}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 text-xs focus:outline-none focus:border-blue-500 transition-all"
        />
        <input
          type="date"
          className="sm:w-36 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 text-xs focus:outline-none focus:border-blue-500 transition-all"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-bold px-5 py-2 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all text-xs"
        >
          {dict.search.submit}
        </button>
      </div>
    </form>
  );
}
