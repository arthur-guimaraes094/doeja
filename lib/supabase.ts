import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const isBrowser = typeof window !== "undefined";

const customStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null;
    const rememberMe = localStorage.getItem("doeja_remember_me") !== "false";
    if (rememberMe) {
      return localStorage.getItem(key) || sessionStorage.getItem(key);
    } else {
      return sessionStorage.getItem(key);
    }
  },
  setItem: (key: string, value: string): void => {
    if (!isBrowser) return;
    const rememberMe = localStorage.getItem("doeja_remember_me") !== "false";
    if (rememberMe) {
      localStorage.setItem(key, value);
    } else {
      // In case we switch to sessionStorage, remove previous keys from localStorage
      localStorage.removeItem(key);
      sessionStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (!isBrowser) return;
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: customStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
