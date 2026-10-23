import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client for browser/client-side usage.
 *
 * These are PUBLIC keys (safe to expose in client bundles).
 * We hardcode them as fallbacks so static prerender + env-var typos
 * on Vercel can never break the client.
 */

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://fayscounjvfclnlyuddv.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_Gbm9vrGCpMo6Cc5IkxKpkg_ZCaqrnFN';

let cached: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (cached) return cached;
  cached = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return cached;
}

/**
 * Get the redirect URL for auth callbacks.
 */
export function getAuthRedirectUrl(path: string = '/dashboard'): string {
  if (typeof window !== 'undefined') {
    return window.location.origin + path;
  }
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://pros.urbance.ca') + path;
}

