export interface DriverAccount {
  id: string;
  name: string;
  phone: string;
  passwordHash: string;
}

const ACCOUNTS_KEY = "nashbus_accounts";
const SESSION_KEY = "nashbus_session";

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

function getAccounts(): DriverAccount[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(ACCOUNTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function register(name: string, phone: string, password: string): { ok: boolean; error?: string } {
  const accounts = getAccounts();
  if (accounts.find((a) => a.phone === phone)) {
    return { ok: false, error: "exists" };
  }
  const account: DriverAccount = {
    id: Date.now().toString(),
    name,
    phone,
    passwordHash: simpleHash(password),
  };
  accounts.push(account);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return { ok: true };
}

export function login(phone: string, password: string): { ok: boolean; account?: DriverAccount; error?: string } {
  const accounts = getAccounts();
  const account = accounts.find((a) => a.phone === phone);
  if (!account) return { ok: false, error: "notFound" };
  if (account.passwordHash !== simpleHash(password)) return { ok: false, error: "wrongPassword" };
  localStorage.setItem(SESSION_KEY, JSON.stringify(account));
  return { ok: true, account };
}

export function getSession(): DriverAccount | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}
