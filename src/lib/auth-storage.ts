export interface DriverAccount {
  id: string;
  name: string;
  phone: string;
  passwordHash: string;
}

interface Session {
  account: DriverAccount;
  expiresAt: number;
}

const ACCOUNTS_KEY = "nashbus_accounts";
const SESSION_KEY = "nashbus_session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

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

  const session: Session = {
    account,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, account };
}

export function getSession(): { account: DriverAccount | null; expired: boolean } {
  if (typeof window === "undefined") return { account: null, expired: false };
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return { account: null, expired: false };

  try {
    const parsed = JSON.parse(data);

    // Migrate old format (direct account without expiry)
    if (parsed && !parsed.expiresAt && parsed.id) {
      const session: Session = {
        account: parsed as DriverAccount,
        expiresAt: Date.now() + SESSION_DURATION_MS,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { account: session.account, expired: false };
    }

    const session = parsed as Session;
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return { account: null, expired: true };
    }

    return { account: session.account, expired: false };
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return { account: null, expired: false };
  }
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}
