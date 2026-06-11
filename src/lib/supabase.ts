import { createClient } from "@supabase/supabase-js";

// Supabase connection details come from environment variables (Vite exposes any
// var prefixed with VITE_ to the client). The anon key is public by design and
// safe to ship in the frontend bundle — it only grants what your Row Level
// Security policies allow. Copy .env.example to .env.local and fill these in.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// The free experience must work even before Supabase is wired up, so we treat a
// missing config as "accounts are off" rather than throwing at import time.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;
