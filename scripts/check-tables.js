const { createClient } = require('@supabase/supabase-js');
const admin = createClient(
  'https://fayscounjvfclnlyuddv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheXNjb3VuanZmY2xubHl1ZGR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA0ODUxMCwiZXhwIjoyMDgwNjI0NTEwfQ.xfcL8sH_J_5H4lopPz7B8MPM7utUk82CxAeAfQrMGhA',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const tables = ['profiles','provider_applications','providers','bookings','jobs','payouts','documents','support_tickets'];
  for (const t of tables) {
    const res = await admin.from(t).select('*').limit(2);
    if (!res.error) {
      const cols = res.data && res.data[0] ? Object.keys(res.data[0]).join(', ') : '(empty)';
      console.log('EXISTS:', t, '|', cols);
    } else {
      console.log('MISSING:', t, '|', res.error.message);
    }
  }
}
main();
