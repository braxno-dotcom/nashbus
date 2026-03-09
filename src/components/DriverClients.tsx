"use client";

import { useState, useEffect } from "react";
import {
  getClients,
  saveClient,
  deleteClient,
  findClientByName,
  type ClientRecord,
} from "@/lib/clients-storage";
import { getActiveTrip } from "@/components/AddTripForm";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

export default function DriverClients({ dict, driverId }: { dict: Dict; driverId: string }) {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<ClientRecord[]>([]);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [addressWarning, setAddressWarning] = useState<{ current: string; previous: string } | null>(null);
  const [receiptClient, setReceiptClient] = useState<ClientRecord | null>(null);
  const [busNumber, setBusNumber] = useState("");
  const [routeFrom, setRouteFrom] = useState("");
  const [routeTo, setRouteTo] = useState("");
  const [routeDate, setRouteDate] = useState("");
  const [routeCities, setRouteCities] = useState<string[]>([]);

  useEffect(() => {
    setClients(getClients(driverId));
  }, [driverId]);

  function handleNameChange(value: string) {
    setName(value);
    setAddressWarning(null);
    if (value.length >= 2) {
      setSuggestions(findClientByName(driverId, value));
    } else {
      setSuggestions([]);
    }
  }

  function selectSuggestion(client: ClientRecord) {
    setName(client.name);
    setPhone(client.phone);
    setAddress(client.address);
    setSuggestions([]);
    if (client.addressHistory.length > 0) {
      setAddressWarning({
        current: client.address,
        previous: client.addressHistory[client.addressHistory.length - 1],
      });
    }
  }

  function selectHistoryAddress(addr: string) {
    setAddress(addr);
    setShowHistory(null);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone || !address) return;
    const result = saveClient(driverId, name, phone, address);
    setClients(getClients(driverId));
    setName("");
    setPhone("");
    setAddress("");
    setAddressWarning(null);
    setSuggestions([]);
    if (result.addressChanged) {
      alert(dict.clients.addressChanged);
    } else {
      alert(dict.clients.saved);
    }
  }

  function handleDelete(id: string) {
    deleteClient(driverId, id);
    setClients(getClients(driverId));
  }

  function sendReceipt(via: "whatsapp" | "viber") {
    if (!receiptClient) return;
    const text = dict.clients.receiptMessage
      .replace("{from}", routeFrom)
      .replace("{to}", routeTo)
      .replace("{date}", routeDate)
      .replace("{bus}", busNumber)
      .replace("{client}", receiptClient.name)
      .replace("{address}", receiptClient.address);
    const phoneClean = receiptClient.phone.replace(/[^0-9]/g, "");
    if (via === "whatsapp") {
      window.open(`https://wa.me/${phoneClean}?text=${encodeURIComponent(text)}`, "_blank");
    } else {
      window.open(`viber://chat?number=${encodeURIComponent(receiptClient.phone)}&draft=${encodeURIComponent(text)}`, "_blank");
    }
    setReceiptClient(null);
  }

  return (
    <div className="space-y-3">
      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="text-xs font-bold text-gray-800">{dict.clients.title}</h3>
        </div>
        <p className="text-[10px] text-gray-400 mb-3">{dict.clients.subtitle}</p>

        <form onSubmit={handleSave} className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={dict.clients.name}
              required
              className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            {suggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectSuggestion(s)}
                    className="block w-full text-left px-3 py-2 text-xs hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <span className="font-semibold text-gray-800">{s.name}</span>
                    <span className="text-gray-400 ml-2">{s.phone}</span>
                    <span className="block text-[10px] text-gray-400 truncate">{s.address}</span>
                    {s.addressHistory.length > 0 && (
                      <span className="text-[9px] text-orange-500">{s.addressHistory.length + 1} {dict.clients.addressHistory.toLowerCase()}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Address change warning */}
          {addressWarning && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
              <div className="flex items-start gap-1.5">
                <svg className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-[10px] font-bold text-orange-700">{dict.clients.addressChanged}</p>
                  <p className="text-[10px] text-orange-600">{dict.clients.previousAddress}: {addressWarning.previous}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={dict.clients.phone}
              required
              className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={dict.clients.address}
              required
              className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-xs hover:bg-blue-700 active:scale-[0.98] transition-all">
            {dict.clients.save}
          </button>
        </form>
      </div>

      {/* Clients list */}
      {clients.length === 0 ? (
        <p className="text-center text-xs text-gray-400 py-3">{dict.clients.noClients}</p>
      ) : (
        <div className="space-y-2">
          {clients.map((client) => (
            <div key={client.id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-3">
              <div className="flex items-start justify-between mb-1">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{client.name}</p>
                  <p className="text-[10px] text-gray-400">{client.phone}</p>
                </div>
                <button onClick={() => handleDelete(client.id)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0 ml-2" title={dict.clients.delete}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <p className="text-[10px] text-gray-600 mb-1 truncate">{client.address}</p>

              {/* Address history */}
              {client.addressHistory.length > 0 && (
                <>
                  <button
                    onClick={() => setShowHistory(showHistory === client.id ? null : client.id)}
                    className="text-[9px] text-blue-600 font-semibold hover:underline mb-1"
                  >
                    {dict.clients.addressHistory} ({client.addressHistory.length})
                  </button>
                  {showHistory === client.id && (
                    <div className="bg-gray-50 rounded p-2 mb-1 space-y-1">
                      {client.addressHistory.map((addr, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-[9px] text-gray-500 truncate flex-1">{addr}</span>
                          <button
                            onClick={() => selectHistoryAddress(addr)}
                            className="text-[9px] text-blue-600 font-semibold ml-2 shrink-0 hover:underline"
                          >
                            {dict.clients.useThisAddress}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {client.addressHistory[client.addressHistory.length - 1] !== client.address && (
                    <div className="bg-orange-50 rounded px-2 py-1 mb-1">
                      <p className="text-[9px] text-orange-600 font-semibold">{dict.clients.addressChanged}</p>
                    </div>
                  )}
                </>
              )}

              <button
                onClick={() => { const trip = getActiveTrip(); setReceiptClient(client); setRouteFrom(trip?.from ?? ""); setRouteTo(trip?.to ?? ""); setRouteDate(trip?.date ?? ""); setBusNumber(trip?.busNumber ?? ""); setRouteCities(trip ? [trip.from, ...(trip.waypoints || []), trip.to].filter(Boolean) : []); }}
                className="w-full py-1.5 rounded bg-green-500 text-white text-[10px] font-bold hover:bg-green-600 active:scale-[0.98] transition-all flex items-center justify-center gap-1 mt-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {dict.clients.sendReceipt}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Receipt modal */}
      {receiptClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setReceiptClient(null)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-xl p-4 mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-800">{dict.clients.generateReceipt}</h3>
              <button onClick={() => setReceiptClient(null)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 text-xs">✕</button>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 mb-3">
              <p className="text-xs font-semibold text-gray-800">{receiptClient.name}</p>
              <p className="text-[10px] text-gray-500">{receiptClient.phone}</p>
              <p className="text-[10px] text-gray-500">{receiptClient.address}</p>
            </div>
            <div className="space-y-2 mb-3">
              <div className="grid grid-cols-2 gap-2">
                {routeCities.length > 0 ? (
                  <>
                    <select value={routeFrom} onChange={(e) => setRouteFrom(e.target.value)} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue-500">
                      <option value="">{dict.clients.routeFrom}</option>
                      {routeCities.map((city) => (
                        <option key={`from-${city}`} value={city}>{city}</option>
                      ))}
                    </select>
                    <select value={routeTo} onChange={(e) => setRouteTo(e.target.value)} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue-500">
                      <option value="">{dict.clients.routeTo}</option>
                      {routeCities.map((city) => (
                        <option key={`to-${city}`} value={city}>{city}</option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <input type="text" value={routeFrom} onChange={(e) => setRouteFrom(e.target.value)} placeholder={dict.clients.routeFrom} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500" />
                    <input type="text" value={routeTo} onChange={(e) => setRouteTo(e.target.value)} placeholder={dict.clients.routeTo} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500" />
                  </>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={routeDate} onChange={(e) => setRouteDate(e.target.value)} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue-500" />
                <input type="text" value={busNumber} onChange={(e) => setBusNumber(e.target.value)} placeholder={dict.clients.busNumber} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mb-2">{dict.clients.via}:</p>
            <div className="flex gap-2">
              <button onClick={() => sendReceipt("whatsapp")} className="flex-1 py-2 rounded-lg bg-green-500 text-white text-[10px] font-bold hover:bg-green-600 transition-all">WhatsApp</button>
              <button onClick={() => sendReceipt("viber")} className="flex-1 py-2 rounded-lg bg-purple-500 text-white text-[10px] font-bold hover:bg-purple-600 transition-all">Viber</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
