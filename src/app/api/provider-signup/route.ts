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

  // Parse body once up-front
  let body: { userId?: string; full_name?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const full_name = (body.full_name ?? '').trim();
  if (!full_name) {
    return NextResponse.json({ error: 'full_name is required.' }, { status: 400 });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Verify caller: prefer Authorization header JWT, fall back to body.userId
  // The client sends the session access_token as "Bearer <jwt>" so we can
  // verify identity server-side rather than trusting a client-supplied UUID.
  let userId: string;
  const authHeader = req.headers.get('authorization') ?? '';
  const jwt = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (jwt) {
    const { data: { user }, error: userError } = await admin.auth.getUser(jwt);
    if (userError || !user) {
      console.error('JWT verification failed:', userError?.message);
      return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
    }
    userId = user.id;
  } else if (body.userId) {
    // Fallback: accept client-supplied userId when Authorization header is absent
    userId = body.userId;
  } else {
    return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
  }

  // 1. Upsert profile row (safe even if trigger already created it)
  const { error: profileError } = await admin
    .from('profiles')
    .upsert({ id: userId, role: 'provider', full_name }, { onConflict: 'id' });
  if (profileError) console.error('Profile upsert error (non-fatal):', profileError.message);

  // 2. Return existing draft if present (makes this endpoint idempotent)
  const { data: existing } = await admin
    .from('provider_applications')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing?.id) {
    return NextResponse.json({ success: true, userId, appId: existing.id });
  }

  // 3. Create fresh draft application
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
