import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://fayscounjvfclnlyuddv.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheXNjb3VuanZmY2xubHl1ZGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDg1MTAsImV4cCI6MjA4MDYyNDUxMH0.gWEM7AnA9JiAIa-WIQNdXmQ-VFD6uBZJqQAff-xdwkk';

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
