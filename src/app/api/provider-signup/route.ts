import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin client — service role, bypasses RLS and email confirmation
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Anon client — used only to sign in and get a real browser-usable session token
function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name } = await req.json();

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'Email, password, and full name are required.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const admin = adminClient();

    // ── 1. Create the auth user (email pre-confirmed — no confirmation email) ──
    const { data: userData, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,          // skip confirmation email
      user_metadata: { full_name },
    });

    if (createError) {
      // Handle duplicate email gracefully
      const msg = createError.message.toLowerCase();
      if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('email address')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Use "Sign In" to continue your application.' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    const userId = userData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Failed to create user account.' }, { status: 500 });
    }

    // ── 2. Create draft application ──────────────────────────────────────────
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
      // Non-fatal — app will create it on first load
      console.error('Draft app creation failed:', appError.message);
    }

    // ── 3. Sign the user in to get a real browser-usable session ─────────────
    // Must use anon client — admin client (persistSession:false) cannot issue
    // a valid session token that the browser can use.
    const anon = anonClient();
    const { data: signInData, error: signInError } = await anon.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.session) {
      // Fallback: return userId so client can attempt its own signIn
      return NextResponse.json({
        success: true,
        userId,
        appId: app?.id ?? null,
        session: null,
        message: 'Account created. Please sign in to continue.',
      });
    }

    return NextResponse.json({
      success: true,
      userId,
      appId: app?.id ?? null,
      session: signInData.session,
      message: 'Account created successfully.',
    });

  } catch (err) {
    console.error('Provider signup error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
