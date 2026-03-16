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
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheXNjb3VuanZmY2xubHl1ZGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDg1MTAsImV4cCI6MjA4MDYyNDUxMH0.gWEM7AnA9JiAIa-WIQNdXmQ-VFD6uBZJqQAff-xdwkk';

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

