import { createBrowserClient } from '@supabase/ssr';

/**
 * Create a Supabase client for browser/client-side usage.
 * NEXT_PUBLIC_ vars are inlined by Next.js at build time.
 * Falls back gracefully during static prerender (no env vars available).
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  // During static prerender env vars are not available — return a safe dummy
  if (!url || !key) {
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.ZopqoUt20nEV8rw6HtnRma_scCbipH_a-wfZHVj5eDQ',
    );
  }

  return createBrowserClient(url, key);
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

