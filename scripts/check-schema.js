const { createClient } = require('@supabase/supabase-js');
const admin = createClient(
  'https://fayscounjvfclnlyuddv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheXNjb3VuanZmY2xubHl1ZGR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA0ODUxMCwiZXhwIjoyMDgwNjI0NTEwfQ.xfcL8sH_J_5H4lopPz7B8MPM7utUk82CxAeAfQrMGhA',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  // Show all jobs
  const jobs = await admin.from('jobs').select('*').limit(5);
  console.log('JOBS sample:', JSON.stringify(jobs.data, null, 2));
  console.log('JOBS error:', jobs.error);

  // Show providers table columns
  const provRes = await admin.from('providers').select('*').limit(1);
  console.log('PROVIDERS error:', provRes.error ? provRes.error.message : 'ok, cols: ' + (provRes.data && provRes.data[0] ? Object.keys(provRes.data[0]).join(', ') : 'empty'));

  // Show bookings sample
  const bookRes = await admin.from('bookings').select('id,status,service,service_name,address,scheduled_date,scheduled_time,subtotal,customer_name').limit(3);
  console.log('BOOKINGS sample:', JSON.stringify(bookRes.data, null, 2));
}
main();
