const { createClient } = require('@supabase/supabase-js');
const admin = createClient(
  'https://fayscounjvfclnlyuddv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheXNjb3VuanZmY2xubHl1ZGR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA0ODUxMCwiZXhwIjoyMDgwNjI0NTEwfQ.xfcL8sH_J_5H4lopPz7B8MPM7utUk82CxAeAfQrMGhA',
  { auth: { autoRefreshToken: false, persistSession: false } }
);
async function main() {
  // Try distinct statuses from existing jobs
  const res = await admin.from('jobs').select('status');
  if (res.data) {
    const statuses = [...new Set(res.data.map(r => r.status))];
    console.log('Existing statuses in jobs:', statuses);
  }
  // Also check bookings statuses
  const bres = await admin.from('bookings').select('status');
  if (bres.data) {
    const statuses = [...new Set(bres.data.map(r => r.status))];
    console.log('Existing statuses in bookings:', statuses);
  }
}
main();
