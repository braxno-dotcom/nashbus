"use client";

import { useState, useEffect } from "react";
import { getFreightListings, addFreightListing, logFreightClick, reportFreightListing, type FreightListing } from "@/lib/freight-storage";

type Dict = Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;

export default function FreightBoard({ dict }: { dict: Dict }) {
  const f = dict.freight as Record<string, string>;
  const cities = dict.cities as Record<string, string>;

  const [activeTab, setActiveTab] = useState<"seek_carrier" | "offer_carrier">("seek_carrier");
  const [listings, setListings] = useState<FreightListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [description, setDescription] = useState("");
  const [weightSize, setWeightSize] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [availableSpace, setAvailableSpace] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [contactName, setContactName] = useState("");

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    setLoading(true);
    const data = await getFreightListings();
    setListings(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setSuccess(false);

    const result = await addFreightListing({
      listingType: activeTab,
      fromCity,
      toCity,
      tripDate,
      description,
      weightSize,
      vehicleType,
      availableSpace,
      price,
      phone,
      contactName,
    });

    if (result) {
      setSuccess(true);
      setFromCity("");
      setToCity("");
      setTripDate("");
      setDescription("");
      setWeightSize("");
      setVehicleType("");
      setAvailableSpace("");
      setPrice("");
      setPhone("");
      setContactName("");
      await loadListings();
      setTimeout(() => setSuccess(false), 3000);
    }

    setSending(false);
  }

  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all";

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-base font-bold text-gray-800">{f.title}</h1>
        <p className="text-[11px] text-gray-500 mt-0.5">{f.subtitle}</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1.5">
        <button
          onClick={() => setActiveTab("seek_carrier")}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "seek_carrier"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {f.tabSeek}
        </button>
        <button
          onClick={() => setActiveTab("offer_carrier")}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "offer_carrier"
              ? "bg-green-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {f.tabOffer}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
        <datalist id="freight-cities">
          {Object.entries(cities).sort((a, b) => a[1].localeCompare(b[1])).map(([, name]) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="text"
              list="freight-cities"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              placeholder={activeTab === "offer_carrier" ? f.fromHint : f.from}
              required
              autoComplete="off"
              className={inputClass}
            />
          </div>
          <div>
            <input
              type="text"
              list="freight-cities"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              placeholder={activeTab === "offer_carrier" ? f.toHint : f.to}
              required={activeTab === "seek_carrier"}
              autoComplete="off"
              className={inputClass}
            />
            {activeTab === "offer_carrier" && (
              <p className="text-[9px] text-gray-400 mt-0.5 ml-1">{f.dateOptional}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="date"
              value={tripDate}
              onChange={(e) => setTripDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required={activeTab === "seek_carrier"}
              className={inputClass}
            />
            {activeTab === "offer_carrier" && (
              <p className="text-[9px] text-gray-400 mt-0.5 ml-1">{f.dateOptional}</p>
            )}
          </div>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder={f.contactName}
            required
            className={inputClass}
          />
        </div>

        {/* Seek-specific fields */}
        {activeTab === "seek_carrier" && (
          <>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={f.description}
              required
              className={inputClass}
            />
            <input
              type="text"
              value={weightSize}
              onChange={(e) => setWeightSize(e.target.value)}
              placeholder={f.weightSize}
              className={inputClass}
            />
          </>
        )}

        {/* Offer-specific fields */}
        {activeTab === "offer_carrier" && (
          <>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">{f.vehicleType}</option>
              <option value="bus">{f.vehicleBus}</option>
              <option value="truck">{f.vehicleTruck}</option>
              <option value="car">{f.vehicleCar}</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={availableSpace}
                onChange={(e) => setAvailableSpace(e.target.value)}
                placeholder={f.availableSpace}
                className={inputClass}
              />
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={f.price}
                className={inputClass}
              />
            </div>
          </>
        )}

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={f.phone}
          required
          className={inputClass}
        />

        <button
          type="submit"
          disabled={sending}
          className={`w-full py-2.5 font-bold rounded-lg text-xs transition-all active:scale-[0.98] disabled:opacity-50 ${
            activeTab === "seek_carrier"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {sending ? "..." : f.submit}
        </button>

        {success && (
          <p className="text-xs text-green-600 font-semibold text-center">{f.success}</p>
        )}
      </form>

      {/* Listings */}
      <div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : listings.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-6">{f.noListings}</p>
        ) : (
          <div className="space-y-2">
            {listings.map((item) => {
              const isSeek = item.listingType === "seek_carrier";
              const phoneClean = item.phone.replace(/[^0-9]/g, "");
              const phonePlus = item.phone.replace(/[^0-9+]/g, "") || `+${phoneClean}`;
              const waUrl = `https://wa.me/${phoneClean}`;
              const viberUrl = `viber://chat?number=${encodeURIComponent(phonePlus)}`;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg shadow-sm border p-3 ${
                    isSeek ? "border-l-4 border-l-blue-400 border-gray-100" : "border-l-4 border-l-green-400 border-gray-100"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isSeek ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
                      }`}>
                        {isSeek ? f.seekLabel : f.offerLabel}
                      </span>
                      {item.verified && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                          ✓ {f.verified}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">{item.tripDate}</span>
                  </div>

                  {/* Route */}
                  <p className="text-xs font-bold text-gray-800 mb-1">
                    {item.fromCity} &rarr; {item.toCity}
                  </p>

                  {/* Details */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.contactName && (
                      <span className="text-[10px] text-gray-500">{item.contactName}</span>
                    )}
                    {isSeek && item.description && (
                      <span className="text-[10px] bg-gray-50 text-gray-600 px-1.5 py-px rounded">{item.description}</span>
                    )}
                    {isSeek && item.weightSize && (
                      <span className="text-[10px] bg-gray-50 text-gray-600 px-1.5 py-px rounded">{item.weightSize}</span>
                    )}
                    {!isSeek && item.vehicleType && (
                      <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-px rounded">
                        {item.vehicleType === "bus" ? f.vehicleBus : item.vehicleType === "truck" ? f.vehicleTruck : item.vehicleType === "car" ? f.vehicleCar : item.vehicleType}
                      </span>
                    )}
                    {!isSeek && item.availableSpace && (
                      <span className="text-[10px] bg-gray-50 text-gray-600 px-1.5 py-px rounded">{item.availableSpace}</span>
                    )}
                    {!isSeek && item.price && (
                      <span className="text-[10px] font-bold text-blue-600">{item.price}</span>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="flex gap-1.5">
                    <a
                      href={`tel:${item.phone}`}
                      onClick={() => logFreightClick(item.id, "call")}
                      className="py-1.5 px-3 rounded bg-gray-100 text-gray-700 text-[10px] font-bold hover:bg-gray-200 transition-all flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {item.phone}
                    </a>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => logFreightClick(item.id, "whatsapp")}
                      className="py-1.5 px-3 rounded bg-green-500 text-white text-[10px] font-bold hover:bg-green-600 transition-all flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                      {f.writeWhatsApp}
                    </a>
                    <a
                      href={viberUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => logFreightClick(item.id, "viber")}
                      className="py-1.5 px-3 rounded bg-purple-500 text-white text-[10px] font-bold hover:bg-purple-600 transition-all flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.5 6.854.5 10.39v.052c0 3.537.802 6.204 2.52 7.924 0 0 0 0 0 0l-.015 3.622s-.1.88.547 1.058c.782.215 1.244-.504 1.993-1.31.41-.44.975-1.087 1.4-1.581 3.856.322 6.822-.418 7.162-.534.783-.267 5.207-.82 5.926-6.69.742-6.042-.36-9.863-2.36-11.583C16.074.825 13.53.05 11.4 0zm.523 1.81c1.833.04 3.955.648 5.384 1.834 1.655 1.424 2.49 4.644 1.867 9.716-.578 4.717-3.946 5.2-4.6 5.424-.282.096-2.886.735-6.158.517 0 0-2.44 2.94-3.202 3.705-.12.12-.26.166-.352.145-.13-.03-.166-.178-.165-.393l.022-4.022C2.98 17.14 2.31 14.94 2.31 10.44v-.044c0-2.98.62-5.207 2.04-6.617C5.88 2.322 9.39 1.867 11.4 1.81h.023zM11.94 4.467a.357.357 0 00-.357.357.357.357 0 00.357.357c1.396 0 2.613.463 3.517 1.292.904.83 1.467 2.027 1.576 3.506a.357.357 0 00.71-.05c-.124-1.68-.772-3.06-1.838-4.038-1.066-.978-2.484-1.524-4.066-1.524h.1zm.12 1.588a.357.357 0 00-.357.358.357.357 0 00.356.357c.879 0 1.573.27 2.068.73.496.46.79 1.113.856 1.883a.357.357 0 00.712-.064c-.08-.93-.44-1.753-1.072-2.34-.632-.587-1.502-.924-2.563-.924zm.12 1.6a.357.357 0 00-.357.357.357.357 0 00.358.357c.381 0 .627.11.79.266.165.156.27.395.298.714a.357.357 0 00.712-.06c-.04-.477-.2-.896-.505-1.184-.304-.288-.72-.45-1.296-.45z"/>
                      </svg>
                      Viber
                    </a>
                    <button
                      onClick={() => handleReport(item.id)}
                      className="py-1.5 px-2 rounded bg-red-50 text-red-500 text-[10px] font-bold hover:bg-red-100 transition-all ml-auto"
                      title={f.report}
                    >
                      ⚠
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  async function handleReport(listingId: string) {
    const reason = prompt(f.reportReason);
    if (!reason) return;
    const userPhone = prompt(f.reportPhone) || "";
    const ok = await reportFreightListing(listingId, reason, userPhone);
    if (ok) alert(f.reportSuccess);
  }
}
