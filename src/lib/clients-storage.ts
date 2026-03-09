export interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  address: string;
  previousAddress: string | null;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "nashbus_clients";

export function getClients(): ClientRecord[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveClient(name: string, phone: string, address: string): ClientRecord {
  const clients = getClients();
  const existing = clients.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );

  if (existing) {
    const previousAddress =
      existing.address !== address ? existing.address : existing.previousAddress;
    existing.phone = phone;
    existing.previousAddress = previousAddress;
    existing.address = address;
    existing.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    return existing;
  }

  const newClient: ClientRecord = {
    id: Date.now().toString(),
    name,
    phone,
    address,
    previousAddress: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  clients.push(newClient);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  return newClient;
}

export function deleteClient(id: string): void {
  const clients = getClients().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function findClientByName(query: string): ClientRecord[] {
  if (!query || query.length < 2) return [];
  const clients = getClients();
  const q = query.toLowerCase();
  return clients.filter((c) => c.name.toLowerCase().includes(q));
}
