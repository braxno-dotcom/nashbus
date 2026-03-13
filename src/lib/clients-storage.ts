const SUPABASE_URL = "https://wxwjsyhrykiexkkoyhoz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2pzeWhyeWtpZXhra295aG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjEwNDcsImV4cCI6MjA4ODczNzA0N30.53Ww3hcMl6xirqELFvgZGe-k_Oxfjx6xyAaEAkcOjJ4";

export interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  address: string;
  addressHistory: string[];
  createdAt: string;
  updatedAt: string;
}

interface DbRow {
  id: string;
  driver_id: string;
  name: string;
  phone: string;
  address: string;
  address_history: string[];
  created_at: string;
  updated_at: string;
}

function rowToClient(row: DbRow): ClientRecord {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    address: row.address,
    addressHistory: row.address_history || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function sbFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
      ...options?.headers,
    },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getClients(driverId: string): Promise<ClientRecord[]> {
  const data = await sbFetch(`driver_clients?driver_id=eq.${driverId}&order=name`);
  if (!data) return [];
  return data.map(rowToClient);
}

export async function saveClient(
  driverId: string,
  name: string,
  phone: string,
  address: string
): Promise<{ client: ClientRecord; isNew: boolean; addressChanged: boolean }> {
  // Check if client with this name already exists for this driver
  const existing = await sbFetch(
    `driver_clients?driver_id=eq.${driverId}&name=ilike.${encodeURIComponent(name)}&limit=1`
  );

  if (existing && existing.length > 0) {
    const row: DbRow = existing[0];
    const addressChanged = row.address !== address;
    const newHistory = [...(row.address_history || [])];
    if (addressChanged && !newHistory.includes(row.address)) {
      newHistory.push(row.address);
    }

    const updated = await sbFetch(`driver_clients?id=eq.${row.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        phone,
        address,
        address_history: newHistory,
        updated_at: new Date().toISOString(),
      }),
    });

    const client = updated && updated.length > 0 ? rowToClient(updated[0]) : rowToClient(row);
    return { client, isNew: false, addressChanged };
  }

  // Create new
  const data = await sbFetch("driver_clients", {
    method: "POST",
    body: JSON.stringify({
      driver_id: driverId,
      name,
      phone,
      address,
      address_history: [],
    }),
  });

  const client = data && data.length > 0
    ? rowToClient(data[0])
    : { id: "", name, phone, address, addressHistory: [], createdAt: "", updatedAt: "" };
  return { client, isNew: true, addressChanged: false };
}

export async function deleteClient(driverId: string, id: string): Promise<void> {
  await sbFetch(`driver_clients?id=eq.${id}&driver_id=eq.${driverId}`, {
    method: "DELETE",
  });
}

export async function findClientByName(driverId: string, query: string): Promise<ClientRecord[]> {
  if (!query || query.length < 2) return [];
  const data = await sbFetch(
    `driver_clients?driver_id=eq.${driverId}&name=ilike.*${encodeURIComponent(query)}*&limit=5`
  );
  if (!data) return [];
  return data.map(rowToClient);
}
