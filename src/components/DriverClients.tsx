"use client";

import { useState, useEffect, useRef } from "react";
import {
  getClients,
  saveClient,
  deleteClient,
  findClientByName,
  type ClientRecord,
} from "@/lib/clients-storage";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

export default function DriverClients({ dict }: { dict: Dict }) {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<ClientRecord[]>([]);
  const [addressWarning, setAddressWarning] = useState<string | null>(null);
  const [receiptClient, setReceiptClient] = useState<ClientRecord | null>(null);
  const [busNumber, setBusNumber] = useState("");
  const [routeFrom, setRouteFrom] = useState("");
  const [routeTo, setRouteTo] = useState("");
  const [routeDate, setRouteDate] = useState("");
  const suggestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setClients(getClients());
  }, []);

  function handleNameChange(value: string) {
    setName(value);
    setAddressWarning(null);
    if (value.length >= 2) {
      const found = findClientByName(value);
      setSuggestions(found);
    } else {
      setSuggestions([]);
    }
  }

  function selectSuggestion(client: ClientRecord) {
    setName(client.name);
    setPhone(client.phone);
    setAddress(client.address);
    setSuggestions([]);
    if (client.previousAddress && client.previousAddress !== client.address) {
      setAddressWarning(client.previousAddress);
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone || !address) return;
    saveClient(name, phone, address);
    setClients(getClients());
    setName("");
    setPhone("");
    setAddress("");
    setAddressWarning(null);
    setSuggestions([]);
    alert(dict.clients.saved);
  }

  function handleDelete(id: string) {
    deleteClient(id);
    setClients(getClients());
  }

  function openReceipt(client: ClientRecord) {
    setReceiptClient(client);
    setBusNumber("");
    setRouteFrom("");
    setRouteTo("");
    setRouteDate("");
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
    <div className="space-y-4">
      {/* Add / search client form */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3">
        <h3 className="text-xs font-bold text-gray-800 mb-1">{dict.clients.title}</h3>
        <p className="text-[10px] text-gray-400 mb-3">{dict.clients.subtitle}</p>

        <form onSubmit={handleSave} className="space-y-2">
          {/* Name with autocomplete */}
          <div className="relative" ref={suggestRef}>
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
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Address change warning */}
          {addressWarning && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 flex items-start gap-2">
              <svg className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-[10px] font-bold text-orange-700">{dict.clients.addressChanged}</p>
                <p className="text-[10px] text-orange-600">{dict.clients.previousAddress}: {addressWarning}</p>
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-xs hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            {dict.clients.save}
          </button>
        </form>
      </div>

      {/* Clients list */}
      {clients.length === 0 ? (
        <p className="text-center text-xs text-gray-400 py-4">{dict.clients.noClients}</p>
      ) : (
        <div className="space-y-2">
          {clients.map((client) => (
            <div key={client.id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-3">
              <div className="flex items-start justify-between mb-1.5">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{client.name}</p>
                  <p className="text-[10px] text-gray-400">{client.phone}</p>
                </div>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors shrink-0 ml-2"
                  title={dict.clients.delete}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <p className="text-[10px] text-gray-600 mb-1.5 truncate">{client.address}</p>

              {client.previousAddress && client.previousAddress !== client.address && (
                <div className="bg-orange-50 rounded px-2 py-1 mb-1.5">
                  <p className="text-[9px] text-orange-600 font-semibold">{dict.clients.addressChanged}</p>
                  <p className="text-[9px] text-orange-500">{dict.clients.previousAddress}: {client.previousAddress}</p>
                </div>
              )}

              <button
                onClick={() => openReceipt(client)}
                className="w-full py-1.5 rounded bg-green-500 text-white text-[10px] font-bold hover:bg-green-600 active:scale-[0.98] transition-all flex items-center justify-center gap-1"
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
              <button onClick={() => setReceiptClient(null)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 text-xs">
                ✕
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-2 mb-3">
              <p className="text-xs font-semibold text-gray-800">{receiptClient.name}</p>
              <p className="text-[10px] text-gray-500">{receiptClient.phone}</p>
              <p className="text-[10px] text-gray-500">{receiptClient.address}</p>
            </div>

            <div className="space-y-2 mb-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={routeFrom}
                  onChange={(e) => setRouteFrom(e.target.value)}
                  placeholder={dict.clients.routeFrom}
                  className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={routeTo}
                  onChange={(e) => setRouteTo(e.target.value)}
                  placeholder={dict.clients.routeTo}
                  className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={routeDate}
                  onChange={(e) => setRouteDate(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  placeholder={dict.clients.busNumber}
                  className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <p className="text-[10px] text-gray-400 mb-2">{dict.clients.via}:</p>
            <div className="flex gap-2">
              <button
                onClick={() => sendReceipt("whatsapp")}
                className="flex-1 py-2 rounded-lg bg-green-500 text-white text-[10px] font-bold hover:bg-green-600 active:scale-[0.97] transition-all flex items-center justify-center gap-1"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                WhatsApp
              </button>
              <button
                onClick={() => sendReceipt("viber")}
                className="flex-1 py-2 rounded-lg bg-purple-500 text-white text-[10px] font-bold hover:bg-purple-600 active:scale-[0.97] transition-all flex items-center justify-center gap-1"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 0C9.473.028 5.333.344 3.353 2.09 1.89 3.47 1.338 5.54 1.26 8.097c-.078 2.557-.178 7.35 4.504 8.758h.004l-.004 2.013s-.032.815.507.981c.652.2.968-.369 1.555-.958.322-.322.766-.797 1.1-1.16 3.022.254 5.345-.326 5.607-.415.606-.207 4.028-.635 4.586-5.178.575-4.67-.27-7.63-1.779-8.96l-.003-.003c-.46-.432-2.466-2.026-7.04-2.153 0 0-.327-.02-.897-.022z"/>
                </svg>
                Viber
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
