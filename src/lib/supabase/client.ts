import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_ANON_KEY, getBaseUrl } from '@/lib/env';

/**
 * Create a Supabase client for browser/client-side usage
 * Uses @supabase/ssr so session is stored in cookies (readable by middleware)
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Get the redirect URL for auth callbacks
 */
export function getAuthRedirectUrl(path: string = '/dashboard'): string {
  return getBaseUrl() + path;
}

