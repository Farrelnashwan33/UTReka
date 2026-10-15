import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta.env?.PUBLIC_SUPABASE_URL as string) || 'https://ukhijyupfrpfztugtjuu.supabase.co';
const SUPABASE_ANON_KEY = (import.meta.env?.PUBLIC_SUPABASE_ANON_KEY as string) || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_URL && 
    SUPABASE_ANON_KEY && 
    SUPABASE_ANON_KEY.length > 20 && 
    !SUPABASE_ANON_KEY.includes('...')
  );
};

let browserClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (browserClient) return browserClient;

  // Use placeholder anon key if not provided to allow client initialization without crashing
  const anonKey = isSupabaseConfigured() ? SUPABASE_ANON_KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

  browserClient = createBrowserClient(SUPABASE_URL, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  return browserClient;
};
