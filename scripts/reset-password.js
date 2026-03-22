const { createClient } = require('@supabase/supabase-js');

const admin = createClient(
  'https://fayscounjvfclnlyuddv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheXNjb3VuanZmY2xubHl1ZGR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA0ODUxMCwiZXhwIjoyMDgwNjI0NTEwfQ.xfcL8sH_J_5H4lopPz7B8MPM7utUk82CxAeAfQrMGhA',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) { console.error(error); return; }

  const user = data.users.find(u => u.email === 'gurmandhillon@urbance.ca');
  if (!user) { console.log('User not found'); return; }

  console.log('Found user:', user.email, '| ID:', user.id);

  const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
    password: 'Test1234!',
    email_confirm: true,
  });

  if (updateError) {
    console.error('Error updating password:', updateError);
  } else {
    console.log('Password set to: Test1234!');
  }
}

main();
