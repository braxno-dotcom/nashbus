export interface Complaint {
  id: string;
  name: string;
  email: string;
  type: "review" | "complaint" | "idea";
  route: string;
  message: string;
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

export async function getComplaints(): Promise<Complaint[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/complaints?select=*&order=created_at.desc&limit=10`,
      { headers }
    );
    if (!res.ok) return [];
    const rows = await res.json();
    return rows.map((r: Record<string, unknown>) => ({
      id: String(r.id),
      name: r.name || "",
      email: r.email || "",
      type: r.type || "review",
      route: r.route || "",
      message: r.message || "",
      createdAt: String(r.created_at || ""),
    }));
  } catch {
    return [];
  }
}

export async function addComplaint(c: Omit<Complaint, "id" | "createdAt">): Promise<Complaint | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/complaints`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: c.name,
        email: c.email,
        type: c.type,
        route: c.route,
        message: c.message,
      }),
    });
    if (!res.ok) return null;
    const [row] = await res.json();
    return {
      id: String(row.id),
      name: row.name,
      email: row.email,
      type: row.type,
      route: row.route,
      message: row.message,
      createdAt: row.created_at,
    };
  } catch {
    return null;
  }
}
