const { createClient } = require('@supabase/supabase-js');
const admin = createClient(
  'https://fayscounjvfclnlyuddv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheXNjb3VuanZmY2xubHl1ZGR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA0ODUxMCwiZXhwIjoyMDgwNjI0NTEwfQ.xfcL8sH_J_5H4lopPz7B8MPM7utUk82CxAeAfQrMGhA',
  { auth: { autoRefreshToken: false, persistSession: false } }
);
async function testStatus(status) {
  const res = await admin.from('jobs').insert({
    booking_id: '00000000-0000-0000-0000-000000000099',
    partner_id: null,
    service_name: 'Test',
    customer_name: 'Test',
    customer_phone: '',
    service_address: 'Test',
    service_city: 'Test',
    status,
    payout_amount: 0,
    scheduled_date: '2026-04-01',
    scheduled_time: '10:00:00',
    has_additional_charges: false,
    payment_captured: false,
  }).select('id');
  if (res.error) {
    console.log('FAIL:', status, '-', res.error.message);
  } else {
    console.log('OK:', status, '- id:', res.data[0].id);
    await admin.from('jobs').delete().eq('id', res.data[0].id);
  }
}
async function main() {
  for (const s of ['pending', 'in_progress', 'cancelled', 'available', 'new', 'open', 'accepted']) {
    await testStatus(s);
  }
}
main();
