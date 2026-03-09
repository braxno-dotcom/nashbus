export interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  address: string;
  addressHistory: string[];
  createdAt: string;
  updatedAt: string;
}

function storageKey(driverId: string) {
  return `nashbus_clients_${driverId}`;
}

export function getClients(driverId: string): ClientRecord[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(storageKey(driverId));
  return data ? JSON.parse(data) : [];
}

export function saveClient(driverId: string, name: string, phone: string, address: string): { client: ClientRecord; isNew: boolean; addressChanged: boolean } {
  const clients = getClients(driverId);
  const existing = clients.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );

  if (existing) {
    const addressChanged = existing.address !== address;
    if (addressChanged && !existing.addressHistory.includes(existing.address)) {
      existing.addressHistory.push(existing.address);
    }
    existing.phone = phone;
    existing.address = address;
    existing.updatedAt = new Date().toISOString();
    localStorage.setItem(storageKey(driverId), JSON.stringify(clients));
    return { client: existing, isNew: false, addressChanged };
  }

  const newClient: ClientRecord = {
    id: Date.now().toString(),
    name,
    phone,
    address,
    addressHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  clients.push(newClient);
  localStorage.setItem(storageKey(driverId), JSON.stringify(clients));
  return { client: newClient, isNew: true, addressChanged: false };
}

export function deleteClient(driverId: string, id: string): void {
  const clients = getClients(driverId).filter((c) => c.id !== id);
  localStorage.setItem(storageKey(driverId), JSON.stringify(clients));
}

export function findClientByName(driverId: string, query: string): ClientRecord[] {
  if (!query || query.length < 2) return [];
  const clients = getClients(driverId);
  const q = query.toLowerCase();
  return clients.filter((c) => c.name.toLowerCase().includes(q));
}
