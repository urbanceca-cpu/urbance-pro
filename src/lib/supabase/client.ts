import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, getBaseUrl } from '@/lib/env';

/**
 * Create a Supabase client for browser/client-side usage
 * Uses placeholder values during build to prevent errors
 */
export function createClient() {
  // Check if we're using real credentials or placeholders
  const isPlaceholder = SUPABASE_URL.includes('placeholder');
  
  if (isPlaceholder && typeof window !== 'undefined') {
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

