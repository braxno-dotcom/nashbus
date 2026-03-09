"use client";

import { useState, useEffect } from "react";
import { addComplaint, getComplaints, type Complaint } from "@/lib/complaints-storage";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

const typeColors = {
  review: "bg-blue-50 text-blue-600 border-blue-200",
  complaint: "bg-red-50 text-red-600 border-red-200",
  idea: "bg-green-50 text-green-600 border-green-200",
};

export default function ComplaintsForm({ dict }: { dict: Dict }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"review" | "complaint" | "idea">("review");
  const [route, setRoute] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Complaint[]>([]);

  useEffect(() => {
    setHistory(getComplaints().slice(0, 5));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addComplaint({ name, email, type, route, message });
    alert(dict.complaints.success);
    setName("");
    setEmail("");
    setRoute("");
    setMessage("");
    setHistory(getComplaints().slice(0, 5));
  }

  const typeLabels = {
    review: dict.complaints.typeReview,
    complaint: dict.complaints.typeComplaint,
    idea: dict.complaints.typeIdea,
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3">
        <h3 className="text-xs font-bold text-gray-800 mb-1">{dict.complaints.title}</h3>
        <p className="text-[10px] text-gray-400 mb-3">{dict.complaints.subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={dict.complaints.name}
              required
              className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={dict.complaints.email}
              className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Type selector */}
          <div className="flex gap-1.5">
            {(["review", "complaint", "idea"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-1.5 rounded text-[10px] font-semibold border transition-all ${
                  type === t ? typeColors[t] : "bg-gray-50 text-gray-400 border-gray-200"
                }`}
              >
                {typeLabels[t]}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            placeholder={dict.complaints.route}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={dict.complaints.message}
            required
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-xs hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            {dict.complaints.submit}
          </button>
        </form>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">{dict.complaints.history}</h4>
          <div className="space-y-2">
            {history.map((c) => (
              <div key={c.id} className={`rounded p-2 border ${typeColors[c.type]}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold">{c.name}</span>
                  <span className="text-[9px] opacity-70">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                {c.route && <p className="text-[9px] opacity-70 mb-0.5">{c.route}</p>}
                <p className="text-[10px]">{c.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
