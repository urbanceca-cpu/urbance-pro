import { createBrowserClient } from '@supabase/ssr';
import { getBaseUrl } from '@/lib/env';

/**
 * Create a Supabase client for browser/client-side usage
 * Uses @supabase/ssr so session is stored in cookies (readable by middleware)
 * NEXT_PUBLIC_ vars are referenced directly so Next.js inlines them at build time.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createBrowserClient(url, key);
}

/**
 * Get the redirect URL for auth callbacks
 */
export function getAuthRedirectUrl(path: string = '/dashboard'): string {
  return getBaseUrl() + path;
}

