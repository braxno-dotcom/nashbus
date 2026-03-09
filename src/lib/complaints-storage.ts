export interface Complaint {
  id: string;
  name: string;
  email: string;
  type: "review" | "complaint" | "idea";
  route: string;
  message: string;
  createdAt: string;
}

const STORAGE_KEY = "nashbus_complaints";

export function getComplaints(): Complaint[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function addComplaint(c: Omit<Complaint, "id" | "createdAt">): Complaint {
  const complaints = getComplaints();
  const entry: Complaint = {
    ...c,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  complaints.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  return entry;
}
