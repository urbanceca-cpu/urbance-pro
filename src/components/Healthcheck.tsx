'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getBaseUrl, MAIN_SITE_URL, SUPABASE_URL, SUPABASE_ANON_KEY, isProduction } from '@/lib/env';

interface HealthStatus {
  host: string;
  baseUrl: string;
  mainSiteUrl: string;
  supabaseConfigured: boolean;
  sessionPresent: boolean;
  environment: string;
  timestamp: string;
}

/**
 * Healthcheck component that logs diagnostics on mount
 * Include this in your layout to get console diagnostics
 */
export function Healthcheck() {
  const [status, setStatus] = useState<HealthStatus | null>(null);

  useEffect(() => {
    const runHealthcheck = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      const healthStatus: HealthStatus = {
        host: typeof window !== 'undefined' ? window.location.host : 'server',
        baseUrl: getBaseUrl(),
        mainSiteUrl: MAIN_SITE_URL,
        supabaseConfigured: !!(SUPABASE_URL && SUPABASE_ANON_KEY),
        sessionPresent: !!session,
        environment: isProduction() ? 'production' : 'development',
        timestamp: new Date().toISOString(),
      };

      setStatus(healthStatus);

      // Log diagnostics
      console.group('🏥 [Urbance Pros] Health Check');
      console.log('Host:', healthStatus.host);
      console.log('Base URL:', healthStatus.baseUrl);
      console.log('Main Site URL:', healthStatus.mainSiteUrl);
      console.log('Supabase:', healthStatus.supabaseConfigured ? '✅ Configured' : '❌ Missing');
      console.log('Session:', healthStatus.sessionPresent ? '✅ Present' : '⚪ None');
      console.log('Environment:', healthStatus.environment);
      console.log('Timestamp:', healthStatus.timestamp);
      
      // Warnings
      if (!healthStatus.supabaseConfigured) {
        console.warn('⚠️ Supabase is not configured. Auth will not work.');
      }
      if (healthStatus.host.includes('localhost') && healthStatus.environment === 'production') {
        console.warn('⚠️ Running on localhost in production mode');
      }
      
      console.groupEnd();
    };

    runHealthcheck();
  }, []);

  // This component doesn't render anything visible
  return null;
}

/**
 * Run healthcheck and return status (for API routes or server components)
 */
export async function getHealthStatus(): Promise<HealthStatus> {
  return {
    host: 'server',
    baseUrl: getBaseUrl(),
    mainSiteUrl: MAIN_SITE_URL,
    supabaseConfigured: !!(SUPABASE_URL && SUPABASE_ANON_KEY),
    sessionPresent: false, // Cannot check session on server without request
    environment: isProduction() ? 'production' : 'development',
    timestamp: new Date().toISOString(),
  };
}
