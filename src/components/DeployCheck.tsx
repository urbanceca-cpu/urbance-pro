'use client';

import { useEffect } from 'react';
import { SUPABASE_URL, SUPABASE_ANON_KEY, MAIN_SITE_URL, SITE_URL } from '@/lib/env';

/**
 * DeployCheck - Logs deployment information on app load
 * This component logs environment info to help debug production issues
 */
export function DeployCheck() {
  useEffect(() => {
    const host = typeof window !== 'undefined' ? window.location.host : 'server';
    const origin = typeof window !== 'undefined' ? window.location.origin : SITE_URL;
    const supabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);
    const buildTime = new Date().toISOString();

    console.log('%c[deploy-check] Urbance Pros Portal', 'color: #8B5CF6; font-weight: bold; font-size: 14px;');
    console.log('[deploy-check] host:', host);
    console.log('[deploy-check] base URL:', origin);
    console.log('[deploy-check] main site:', MAIN_SITE_URL);
    console.log('[deploy-check] supabase present:', supabaseConfigured ? '✅ Yes' : '❌ No');
    console.log('[deploy-check] timestamp:', buildTime);
    
    if (!supabaseConfigured) {
      console.error('[deploy-check] ⚠️ Supabase is not configured! Auth will not work.');
    }

    // Production warning for localhost
    if (process.env.NODE_ENV === 'production' && host.includes('localhost')) {
      console.warn('[deploy-check] ⚠️ Running production build on localhost');
    }
  }, []);

  // This component renders nothing
  return null;
}
