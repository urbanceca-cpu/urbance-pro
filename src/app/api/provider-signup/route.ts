import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    const missing = [
      !supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL',
      !serviceKey  && 'SUPABASE_SERVICE_ROLE_KEY',
    ].filter(Boolean).join(', ');
    console.error('Missing env vars:', missing);
    return NextResponse.json({ error: `Server configuration error — missing: ${missing}` }, { status: 500 });
  }

  let body: { userId?: string; full_name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { userId, full_name } = body;

  if (!userId || !full_name) {
    return NextResponse.json({ error: 'userId and full_name are required.' }, { status: 400 });
  }

  // Admin client — bypasses RLS for DB setup only (auth is handled client-side)
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // ── 1. Upsert profile row ─────────────────────────────────────────────────
  // Safe to call even if the handle_new_user trigger already created the row.
  const { error: profileError } = await admin
    .from('profiles')
    .upsert({ id: userId, role: 'provider', full_name }, { onConflict: 'id' });

  if (profileError) {
    console.error('Profile upsert error (non-fatal):', profileError.message);
  }

  // ── 2. Create draft application ───────────────────────────────────────────
  let appId: string | null = null;
  const { data: app, error: appError } = await admin
    .from('provider_applications')
    .insert({
      user_id: userId,
      status: 'draft',
      step_completed: {},
      basic_info: {},
      services_coverage: {},
      experience_standards: {},
      pricing_availability: {},
    })
    .select('id')
    .single();

  if (appError) {
    console.error('Draft app creation failed (non-fatal):', appError.message);
  } else {
    appId = app?.id ?? null;
  }

  return NextResponse.json({ success: true, userId, appId });
}
