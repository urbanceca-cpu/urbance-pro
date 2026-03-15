import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Guard: env vars must be present
  if (!supabaseUrl || !serviceKey || !anonKey) {
    console.error('Missing env vars:', { supabaseUrl: !!supabaseUrl, serviceKey: !!serviceKey, anonKey: !!anonKey });
    return NextResponse.json({ error: 'Server configuration error. Please contact support.' }, { status: 500 });
  }

  let body: { email?: string; password?: string; full_name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { email, password, full_name } = body;

  if (!email || !password || !full_name) {
    return NextResponse.json({ error: 'Email, password, and full name are required.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  // Admin client — bypasses RLS, used only for createUser + DB insert
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // ── 1. Create auth user (email pre-confirmed, no confirmation email) ──────
  const { data: userData, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });

  if (createError) {
    console.error('createUser error:', createError.message);
    const msg = createError.message.toLowerCase();
    if (
      msg.includes('already registered') ||
      msg.includes('already exists') ||
      msg.includes('user already') ||
      msg.includes('duplicate')
    ) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please go to the login page.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  const userId = userData?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Account creation returned no user ID.' }, { status: 500 });
  }

  // ── 2. Create draft application (non-fatal if it fails) ──────────────────
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

  // ── 3. Sign in via anon client to get a browser-usable session ────────────
  // Admin client has persistSession:false so it cannot issue real tokens.
  const anon = createClient(supabaseUrl, anonKey);
  const { data: signInData, error: signInError } = await anon.auth.signInWithPassword({ email, password });

  if (signInError || !signInData?.session) {
    console.error('signInWithPassword after createUser failed:', signInError?.message ?? 'no session');
    // Account was created — return success without a session; client will sign in itself
    return NextResponse.json({ success: true, userId, appId, session: null });
  }

  return NextResponse.json({ success: true, userId, appId, session: signInData.session });
}
