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
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://fayscounjvfclnlyuddv.supabase.co';
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    '';
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ─── POST /api/provider-signup ────────────────────────────────────────────────
//
// Server-side account creation using admin client.
// Creates user (auto-confirmed), profile, and draft application.
//
// Body:     { email: string, password: string, full_name: string }
// Returns:  { success: true, userId, appId }
//
// Client should call signInWithPassword() after this succeeds.

export async function POST(req: NextRequest) {
  const admin = getAdminClient();
  if (!admin) {
    console.error('[provider-signup] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return err('Server configuration error.', 500);
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON body.');
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const fullName = typeof body.full_name === 'string' ? body.full_name.trim() : '';

  if (!email) return err('Email is required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err('Invalid email format.');
  if (!password || password.length < 8) return err('Password must be at least 8 characters.');
  if (!fullName) return err('Full name is required.');

  console.log('[provider-signup] Creating user:', email);

  // Try to create the user. If it fails with "already exists", handle gracefully.
  const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createErr) {
    const msg = createErr.message.toLowerCase();
    if (
      msg.includes('already') ||
      msg.includes('duplicate') ||
      msg.includes('unique') ||
      msg.includes('exists')
    ) {
      return json(
        {
          error: 'account_exists',
          message: 'An account with this email already exists. Please sign in instead.',
        },
        409
      );
    }
    console.error('[provider-signup] Create user failed:', createErr.message);
    return err('Failed to create account: ' + createErr.message, 500);
  }

  const userId = newUser.user.id;

  // Upsert profile (trigger may have already created it)
  const { error: profileErr } = await admin
    .from('profiles')
    .upsert(
      { id: userId, role: 'provider', full_name: fullName },
      { onConflict: 'id' }
    );
  if (profileErr) {
    console.error('[provider-signup] Profile upsert error:', profileErr.message);
  }

  // Check for existing draft (idempotent)
  const { data: existingDraft } = await admin
    .from('provider_applications')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existingDraft?.id) {
    return json({ success: true, userId, appId: existingDraft.id });
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
    return err('Account created but failed to create application. Please try signing in.', 500);
  }

  return json({ success: true, userId, appId: app.id });
}
