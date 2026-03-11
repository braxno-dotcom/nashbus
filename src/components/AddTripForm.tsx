"use client";

import { useState, useRef } from "react";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

const SUPABASE_URL = "https://wxwjsyhrykiexkkoyhoz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2pzeWhyeWtpZXhra295aG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjEwNDcsImV4cCI6MjA4ODczNzA0N30.53Ww3hcMl6xirqELFvgZGe-k_Oxfjx6xyAaEAkcOjJ4";

async function uploadLogo(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const fileName = `logo_${Date.now()}.${ext}`;

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/logos/${fileName}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "apikey": SUPABASE_KEY,
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!res.ok) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/logos/${fileName}`;
}

interface AddTripFormProps {
  dict: Dict;
  driverId: string;
  driverName: string;
  driverLogoUrl?: string;
  onTripAdded?: () => void;
}

export default function AddTripForm({ dict, driverId, driverName, driverLogoUrl, onTripAdded }: AddTripFormProps) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [departure, setDeparture] = useState("");
  const [duration, setDuration] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("");
  const [totalSeats, setMaxSeats] = useState("20");
  const [phone, setPhone] = useState("");
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [address, setAddress] = useState("");
  const [geoStatus, setGeoStatus] = useState("");
  const [geoOk, setGeoOk] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const cities = dict.cities as Record<string, string>;
  const cityKeys = Object.keys(cities).sort((a, b) => cities[a].localeCompare(cities[b]));
  const driverDict = dict.driver as Record<string, string>;
  const selectCity = (dict.clients as Record<string, string>).selectCity || "Select city";

  function addWaypoint() {
    setWaypoints([...waypoints, ""]);
  }

  function updateWaypoint(index: number, value: string) {
    const updated = [...waypoints];
    updated[index] = value;
    setWaypoints(updated);
  }

  function removeWaypoint(index: number) {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  }

  async function geocodeAddress() {
    if (!address.trim()) return;
    setGeoLoading(true);
    setGeoStatus("");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setLat(parseFloat(data[0].lat).toFixed(4));
        setLng(parseFloat(data[0].lon).toFixed(4));
        setGeoOk(true);
        setGeoStatus(data[0].display_name.substring(0, 60));
      } else {
        setGeoOk(false);
        setGeoStatus(driverDict.geoNotFound || "Address not found");
      }
    } catch {
      setGeoOk(false);
      setGeoStatus("Error");
    }
    setGeoLoading(false);
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    const url = await uploadLogo(file);
    setUploading(false);

    if (url) {
      setLogoUrl(url);
    } else {
      alert("Upload error");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const filteredWaypoints = waypoints.filter((w) => w.trim() !== "");

    const route = {
      carrier_id: driverId,
      carrier: driverName,
      from_key: from,
      to_key: to,
      trip_date: date,
      departure: departure || "",
      duration: duration || "",
      price: price || "0",
      seats: parseInt(seats) || 0,
      total_seats: parseInt(totalSeats) || 20,
      phone: phone,
      waypoints: filteredWaypoints,
      logo_url: logoUrl || driverLogoUrl || "",
      pickup_lat: lat ? parseFloat(lat) : null,
      pickup_lng: lng ? parseFloat(lng) : null,
      parcels: false,
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/routes`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation",
        },
        body: JSON.stringify(route),
      });

      if (res.ok) {
        alert(dict.driver.success);
        setOpen(false);
        setFrom(""); setTo(""); setDate(""); setBusNumber("");
        setDeparture(""); setDuration("");
        setPrice(""); setSeats(""); setMaxSeats("20"); setPhone("");
        setWaypoints([]); setLogoUrl(""); setLogoPreview("");
        setAddress(""); setLat(""); setLng(""); setGeoStatus(""); setGeoOk(false);
        onTripAdded?.();
      } else {
        const err = await res.text();
        console.error("Supabase insert error:", err);
        alert("Error saving trip");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Error saving trip");
    }
    setSaving(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-2.5 bg-yellow-400 text-gray-900 font-bold rounded-lg text-xs hover:bg-yellow-300 active:scale-[0.98] transition-all flex items-center justify-center gap-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {dict.driver.title}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-xl p-4 mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800">{dict.driver.title}</h3>
              <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 text-xs">✕</button>
            </div>
            <p className="text-[11px] text-gray-500 mb-3">{dict.driver.subtitle}</p>
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Logo upload */}
              <div className="flex items-center gap-3">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors overflow-hidden shrink-0"
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-gray-600 font-medium">{driverDict.logo || "Logo"}</p>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="mt-1 text-[10px] text-blue-600 hover:underline disabled:text-gray-400"
                  >
                    {uploading ? (driverDict.logoUploading || "...") : (driverDict.logoUpload || "Upload")}
                  </button>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>

              {/* City selectors */}
              <div className="grid grid-cols-2 gap-2">
                <select value={from} onChange={(e) => setFrom(e.target.value)} required className="px-2 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue-500">
                  <option value="">{dict.driver.from}</option>
                  {cityKeys.map((key) => (
                    <option key={key} value={key}>{cities[key]}</option>
                  ))}
                </select>
                <select value={to} onChange={(e) => setTo(e.target.value)} required className="px-2 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue-500">
                  <option value="">{dict.driver.to}</option>
                  {cityKeys.map((key) => (
                    <option key={key} value={key}>{cities[key]}</option>
                  ))}
                </select>
              </div>

              {/* Waypoints */}
              <div className="space-y-1.5">
                {waypoints.length > 0 && (
                  <p className="text-[10px] text-gray-500 font-semibold">{dict.driver.waypoints}:</p>
                )}
                {waypoints.map((wp, i) => (
                  <div key={i} className="flex gap-1.5">
                    <div className="flex items-center gap-1 flex-1">
                      <span className="text-[9px] text-gray-400 shrink-0 w-4 text-center">{i + 1}.</span>
                      <select
                        value={wp}
                        onChange={(e) => updateWaypoint(i, e.target.value)}
                        className="flex-1 px-2 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue-500"
                      >
                        <option value="">{selectCity}</option>
                        {cityKeys.map((key) => (
                          <option key={key} value={key}>{cities[key]}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWaypoint(i)}
                      className="px-2 py-1.5 rounded-lg bg-red-50 text-red-500 text-[10px] hover:bg-red-100 transition-colors shrink-0"
                    >
                      {dict.driver.removeWaypoint}
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addWaypoint}
                  className="w-full py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-500 text-[10px] hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {dict.driver.addWaypoint}
                </button>
              </div>

              {/* Date + price */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-gray-500 mb-0.5">{dict.driver.date}</p>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} required className="w-full px-2 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue-500" />
                </div>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={dict.driver.price} min="1" required className="px-2 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500 self-end" />
              </div>

              {/* Departure, duration */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-gray-500 mb-0.5">{driverDict.departure}</p>
                  <input type="time" value={departure} onChange={(e) => setDeparture(e.target.value)} className="w-full px-2 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue-500" />
                </div>
                <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder={driverDict.duration || "12ч"} className="px-2 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500 self-end" />
              </div>

              {/* Bus number, seats */}
              <div className="grid grid-cols-3 gap-2">
                <input type="text" value={busNumber} onChange={(e) => setBusNumber(e.target.value)} placeholder={dict.clients.busNumber} className="px-2 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500" />
                <input type="number" value={seats} onChange={(e) => setSeats(e.target.value)} placeholder={dict.driver.seats} min="1" max="60" required className="px-2 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500" />
                <input type="number" value={totalSeats} onChange={(e) => setMaxSeats(e.target.value)} placeholder={driverDict.totalSeats || "Max"} min="1" max="60" className="px-2 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              </div>

              {/* Pickup address with geocoding */}
              <div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={driverDict.pickupAddress || "Pickup address"}
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={geocodeAddress}
                    disabled={geoLoading}
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 shrink-0"
                  >
                    {geoLoading ? "..." : (driverDict.geoFind || "Find")}
                  </button>
                </div>
                {geoStatus && (
                  <p className={`text-[9px] mt-0.5 ${geoOk ? "text-green-600" : "text-red-500"}`}>
                    {geoOk ? "✓ " : ""}{geoStatus}
                  </p>
                )}
              </div>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={dict.driver.phone} required className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500" />
              <button type="submit" disabled={saving} className="w-full bg-yellow-400 text-gray-900 font-bold py-2.5 rounded-lg text-xs hover:bg-yellow-300 active:scale-[0.98] transition-all disabled:opacity-50">
                {dict.driver.submit}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
