const { createClient } = require('@supabase/supabase-js');
const admin = createClient(
  'https://fayscounjvfclnlyuddv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheXNjb3VuanZmY2xubHl1ZGR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA0ODUxMCwiZXhwIjoyMDgwNjI0NTEwfQ.xfcL8sH_J_5H4lopPz7B8MPM7utUk82CxAeAfQrMGhA',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  // Insert some available jobs (partner_id NULL, status 'available')
  const jobs = [
    {
      booking_id: '00000000-0000-0000-0000-000000000001',
      partner_id: null,
      service_name: 'Deep House Cleaning',
      customer_name: 'Client (Hidden)',
      customer_phone: '',
      service_address: '1234 Robson St',
      service_city: 'Vancouver, BC',
      status: 'available',
      payout_amount: 156,
      scheduled_date: '2026-03-28',
      scheduled_time: '10:00:00',
      has_additional_charges: false,
      payment_captured: false,
    },
    {
      booking_id: '00000000-0000-0000-0000-000000000002',
      partner_id: null,
      service_name: 'Move-in Cleaning',
      customer_name: 'Client (Hidden)',
      customer_phone: '',
      service_address: '56 Granville Ave',
      service_city: 'Burnaby, BC',
      status: 'available',
      payout_amount: 220,
      scheduled_date: '2026-03-30',
      scheduled_time: '14:00:00',
      has_additional_charges: false,
      payment_captured: false,
    },
    {
      booking_id: '00000000-0000-0000-0000-000000000003',
      partner_id: null,
      service_name: 'Carpet Cleaning',
      customer_name: 'Client (Hidden)',
      customer_phone: '',
      service_address: '789 Kingsway',
      service_city: 'Vancouver, BC',
      status: 'available',
      payout_amount: 132,
      scheduled_date: '2026-04-01',
      scheduled_time: '09:00:00',
      has_additional_charges: false,
      payment_captured: false,
    },
    {
      booking_id: '00000000-0000-0000-0000-000000000004',
      partner_id: null,
      service_name: 'Window Cleaning',
      customer_name: 'Client (Hidden)',
      customer_phone: '',
      service_address: '22 Cambie St',
      service_city: 'Vancouver, BC',
      status: 'available',
      payout_amount: 105,
      scheduled_date: '2026-04-02',
      scheduled_time: '11:00:00',
      has_additional_charges: false,
      payment_captured: false,
    },
  ];

  // Remove any existing seeded available jobs first
  await admin.from('jobs').delete().is('partner_id', null).eq('status', 'available');

  const res = await admin.from('jobs').insert(jobs).select('id, service_name, status');
  if (res.error) {
    console.error('Insert error:', res.error);
  } else {
    console.log('Seeded jobs:', res.data);
  }
}
main();
