import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your .env file.');
}

/**
 * DEFENSIVE SINGLETON PATTERN
 * To prevent "stolen lock" errors in development, we ensure the Supabase client
 * is truly a singleton and bypass the Web Locks API entirely.
 */
let supabaseClient;

if (!window.supabaseInstance) {
    const customStorage = {
        getItem: (key) => window.localStorage.getItem(key),
        setItem: (key, value) => window.localStorage.setItem(key, value),
        removeItem: (key) => window.localStorage.removeItem(key),
    };

    window.supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: 'sparkwave-auth-final-v4',
            storage: customStorage,
            flowType: 'pkce',
            // CRITICAL: Disable navigator locks to solve the "Lock stolen" issue once and for all
            lockStorageOutdatedModules: false,
        }
    });
}

export const supabase = window.supabaseInstance;
