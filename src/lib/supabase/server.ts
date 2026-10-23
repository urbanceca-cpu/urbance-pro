import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://fayscounjvfclnlyuddv.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_Gbm9vrGCpMo6Cc5IkxKpkg_ZCaqrnFN';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const url = SUPABASE_URL;
  const key = SUPABASE_ANON_KEY;

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server component — can't set cookies, ignore
        }
      },
    },
  });
}
