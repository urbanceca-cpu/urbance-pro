import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, getBaseUrl } from '@/lib/env';

// Placeholder URL for build time - client will reinitialize on browser
const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY = 'placeholder-key-for-build-time';

/**
 * Create a Supabase client for browser/client-side usage
 * Uses placeholder values during build to prevent errors
 */
export function createClient() {
  const url = SUPABASE_URL || PLACEHOLDER_URL;
  const key = SUPABASE_ANON_KEY || PLACEHOLDER_KEY;
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Only warn in browser, not during build
    if (typeof window !== 'undefined') {
      console.error('[Supabase] Missing configuration. Check your environment variables:');
      console.error('  - NEXT_PUBLIC_SUPABASE_URL');
      console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
  }

  return createSupabaseClient(url, key, {
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

