export interface FreightListing {
  id: string;
  listingType: "seek_carrier" | "offer_carrier";
  fromCity: string;
  toCity: string;
  tripDate: string;
  description: string;
  weightSize: string;
  vehicleType: string;
  availableSpace: string;
  price: string;
  phone: string;
  contactName: string;
  createdAt: string;
}

const SUPABASE_URL = "https://wxwjsyhrykiexkkoyhoz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2pzeWhyeWtpZXhra295aG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjEwNDcsImV4cCI6MjA4ODczNzA0N30.53Ww3hcMl6xirqELFvgZGe-k_Oxfjx6xyAaEAkcOjJ4";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation",
};

export async function getFreightListings(): Promise<FreightListing[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/freight_listings?select=*&order=created_at.desc&limit=50`,
      { headers }
    );
    if (!res.ok) return [];
    const rows = await res.json();
    return rows.map((r: Record<string, unknown>) => ({
      id: String(r.id),
      listingType: r.listing_type || "seek_carrier",
      fromCity: r.from_city || "",
      toCity: r.to_city || "",
      tripDate: String(r.trip_date || ""),
      description: r.description || "",
      weightSize: r.weight_size || "",
      vehicleType: r.vehicle_type || "",
      availableSpace: r.available_space || "",
      price: r.price || "",
      phone: r.phone || "",
      contactName: r.contact_name || "",
      createdAt: String(r.created_at || ""),
    }));
  } catch {
    return [];
  }
}

export async function addFreightListing(
  data: Omit<FreightListing, "id" | "createdAt">
): Promise<FreightListing | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/freight_listings`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        listing_type: data.listingType,
        from_city: data.fromCity,
        to_city: data.toCity,
        trip_date: data.tripDate,
        description: data.description,
        weight_size: data.weightSize,
        vehicle_type: data.vehicleType,
        available_space: data.availableSpace,
        price: data.price,
        phone: data.phone,
        contact_name: data.contactName,
      }),
    });
    if (!res.ok) return null;
    const [row] = await res.json();
    return {
      id: String(row.id),
      listingType: row.listing_type,
      fromCity: row.from_city,
      toCity: row.to_city,
      tripDate: row.trip_date,
      description: row.description || "",
      weightSize: row.weight_size || "",
      vehicleType: row.vehicle_type || "",
      availableSpace: row.available_space || "",
      price: row.price || "",
      phone: row.phone,
      contactName: row.contact_name || "",
      createdAt: row.created_at,
    };
  } catch {
    return null;
  }
}
