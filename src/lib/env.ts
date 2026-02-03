/**
 * Environment configuration for production deployment
 * Handles dynamic URLs and prevents localhost in production
 */

// Get the base URL dynamically - works for both server and client
export function getBaseUrl(): string {
  // Server-side: use environment variable
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_SITE_URL || 'https://pros.urbance.ca';
  }
  
  // Client-side: use window.location.origin
  const origin = window.location.origin;
  
  // Prevent localhost in production builds
  if (process.env.NODE_ENV === 'production' && origin.includes('localhost')) {
    console.warn('[ENV] Detected localhost in production, using fallback URL');
    return 'https://pros.urbance.ca';
  }
  
  return origin;
}

// Main customer site URL
export const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://urbance.ca';

// Current site URL
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pros.urbance.ca';

// Supabase configuration
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Get a safe redirect URL that never points to localhost in production
 */
export function getRedirectUrl(path: string = '/dashboard'): string {
  const baseUrl = getBaseUrl();
  
  // Ensure path starts with /
  const safePath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${safePath}`;
}

/**
 * Get the main site URL for cross-site navigation
 */
export function getMainSiteUrl(path: string = '/'): string {
  const safePath = path.startsWith('/') ? path : `/${path}`;
  return `${MAIN_SITE_URL}${safePath}`;
}

/**
 * Check if we're in production environment
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Log environment diagnostics (for debugging)
 */
export function logEnvDiagnostics(): void {
  if (typeof window !== 'undefined') {
    console.group('[Urbance Pros] Environment Diagnostics');
    console.log('Host:', window.location.host);
    console.log('Origin:', window.location.origin);
    console.log('BASE_URL:', getBaseUrl());
    console.log('MAIN_SITE_URL:', MAIN_SITE_URL);
    console.log('SUPABASE_URL:', SUPABASE_URL ? '✓ Configured' : '✗ Missing');
    console.log('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✓ Configured' : '✗ Missing');
    console.log('Environment:', process.env.NODE_ENV);
    console.groupEnd();
  }
}
