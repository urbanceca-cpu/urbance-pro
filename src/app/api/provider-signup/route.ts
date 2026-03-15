import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Only the two server-side vars are needed — anon key is handled client-side
  if (!supabaseUrl || !serviceKey) {
    const missing = [
      !supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL',
      !serviceKey  && 'SUPABASE_SERVICE_ROLE_KEY',
    ].filter(Boolean).join(', ');
    console.error('Missing env vars:', missing);
    return NextResponse.json({ error: `Server configuration error — missing: ${missing}` }, { status: 500 });
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

  // ── 3. Return success — client signs in itself via signInWithPassword ──────
  // We skip server-side sign-in because NEXT_PUBLIC_ vars are unreliable
  // in server functions on Vercel. The client fallback handles session creation.
  return NextResponse.json({ success: true, userId, appId, session: null });
}
