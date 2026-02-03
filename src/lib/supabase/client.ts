import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, getBaseUrl } from '@/lib/env';

/**
 * Create a Supabase client for browser/client-side usage
 */
export function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('[Supabase] Missing configuration. Check your environment variables:');
    console.error('  - NEXT_PUBLIC_SUPABASE_URL');
    console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
      storageKey: 'urbance-pros-auth',
    },
  });
}

/**
 * Get the redirect URL for auth callbacks
 */
export function getAuthRedirectUrl(path: string = '/dashboard'): string {
  return getBaseUrl() + path;
}

