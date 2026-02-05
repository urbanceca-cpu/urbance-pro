import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Placeholder for build time
const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwbGFjZWhvbGRlciIsInJvbGUiOiJhbm9uIn0.placeholder';

export async function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || PLACEHOLDER_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || 
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || 
              PLACEHOLDER_KEY;
  
  return createSupabaseClient(url, key);
}
