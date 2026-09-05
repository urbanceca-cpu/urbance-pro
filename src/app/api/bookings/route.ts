/**
 * POST /api/bookings
 *
 * Called by the main Urbance website when a customer confirms a booking.
 * This inserts a job into the `jobs` table with status='accepted' and
 * partner_id=null, making it instantly visible to ALL approved providers
 * via Supabase Realtime on their dashboard.
 *
 * Auth: Bearer token must match BOOKING_API_SECRET env var.
 *
 * Body (JSON):
 * {
 *   service_name: string,       // e.g. "House Cleaning"
 *   customer_name: string,      // e.g. "John Smith"
 *   customer_phone: string,     // e.g. "+16045551234"
 *   service_address: string,    // e.g. "123 Main St"
 *   service_city: string,       // e.g. "Vancouver"
 *   scheduled_date: string,     // ISO date "2026-04-01"
 *   scheduled_time?: string,    // "10:00 AM"
 *   payout_amount: number,      // gross amount in CAD
 *   service_details?: string,   // customer notes
 *   booking_id?: string,        // reference ID from main website
 *   latitude?: number,
 *   longitude?: number,
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://fayscounjvfclnlyuddv.supabase.co';

const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const API_SECRET = process.env.BOOKING_API_SECRET || '';

export async function POST(req: NextRequest) {
  // ── Auth check ────────────────────────────────────────────────────────────
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

  if (!API_SECRET || token !== API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!SUPABASE_SERVICE_KEY) {
    return NextResponse.json({ error: 'Server misconfigured: missing service key' }, { status: 500 });
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const required = ['service_name', 'customer_name', 'service_address', 'service_city', 'scheduled_date', 'payout_amount'];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  const payoutAmount = Number(body.payout_amount);
  if (!Number.isFinite(payoutAmount) || payoutAmount <= 0) {
    return NextResponse.json({ error: 'payout_amount must be a positive number' }, { status: 400 });
  }
  if (Number.isNaN(Date.parse(String(body.scheduled_date)))) {
    return NextResponse.json({ error: 'scheduled_date must be a valid date' }, { status: 400 });
  }

  // ── Insert using service role (bypasses RLS) ──────────────────────────────
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const bookingId = (body.booking_id as string) ?? null;
  if (bookingId) {
    const { data: existing } = await supabase
      .from('jobs')
      .select('id')
      .eq('booking_id', bookingId)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        job_id: existing.id,
        message: 'Booking was already published to providers.',
      });
    }
  }

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      status: 'accepted',
      partner_id: null,
      booking_id: bookingId,
      service_name: body.service_name as string,
      customer_name: body.customer_name as string,
      customer_phone: (body.customer_phone as string) ?? null,
      service_address: body.service_address as string,
      service_city: body.service_city as string,
      scheduled_date: body.scheduled_date as string,
      scheduled_time: (body.scheduled_time as string) ?? null,
      payout_amount: payoutAmount,
      service_details: (body.service_details as string) ?? null,
      latitude: body.latitude ? Number(body.latitude) : null,
      longitude: body.longitude ? Number(body.longitude) : null,
      has_additional_charges: false,
      final_amount: null,
      payment_captured: false,
      eta: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505' && bookingId) {
      const { data: existing } = await supabase.from('jobs').select('id').eq('booking_id', bookingId).maybeSingle();
      return NextResponse.json({ success: true, duplicate: true, job_id: existing?.id ?? null });
    }
    console.error('[/api/bookings] Supabase insert error:', error);
    return NextResponse.json({ error: 'Unable to publish booking' }, { status: 500 });
  }

  // ── Success: job is now live for all providers ────────────────────────────
  return NextResponse.json({
    success: true,
    job_id: data.id,
    message: 'Booking created and broadcast to all available providers.',
  }, { status: 201 });
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'POST /api/bookings' });
}
