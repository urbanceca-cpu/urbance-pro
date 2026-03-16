import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

function err(message: string, status = 400) {
  return json({ error: message }, status);
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ─── POST /api/provider-signup ────────────────────────────────────────────────
//
// Called AFTER client-side supabase.auth.signUp() succeeds.
// Creates/upserts profile row + draft application.
//
// Headers:  Authorization: Bearer <access_token>
// Body:     { full_name: string }
// Returns:  { success: true, userId, appId }

export async function POST(req: NextRequest) {
  const admin = getAdminClient();
  if (!admin) {
    console.error('[provider-signup] Missing env vars');
    return err('Server configuration error.', 500);
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON body.');
  }

  const fullName = typeof body.full_name === 'string' ? body.full_name.trim() : '';
  if (!fullName) return err('full_name is required.');

  // Authenticate via JWT
  const authHeader = req.headers.get('authorization') ?? '';
  const jwt = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!jwt) return err('Missing Authorization header.', 401);

  const { data: { user }, error: authErr } = await admin.auth.getUser(jwt);
  if (authErr || !user) {
    console.error('[provider-signup] JWT failed:', authErr?.message);
    return err('Authentication failed.', 401);
  }

  const userId = user.id;

  // Upsert profile (trigger may have already created it)
  const { error: profileErr } = await admin
    .from('profiles')
    .upsert({ id: userId, role: 'provider', full_name: fullName }, { onConflict: 'id' });
  if (profileErr) console.error('[provider-signup] Profile upsert:', profileErr.message);

  // Idempotent: return existing draft if present
  const { data: existing } = await admin
    .from('provider_applications')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing?.id) {
    return json({ success: true, userId, appId: existing.id });
  }

  // Create fresh draft
  const { data: app, error: appErr } = await admin
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

  if (appErr) {
    console.error('[provider-signup] Draft creation failed:', appErr.message);
    return err('Failed to create application.', 500);
  }

  return json({ success: true, userId, appId: app.id });
}
