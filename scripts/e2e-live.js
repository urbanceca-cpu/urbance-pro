const { createClient } = require('@supabase/supabase-js');

const PROD_URL = 'https://pros.urbance.ca';
const SUPA_URL = 'https://fayscounjvfclnlyuddv.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheXNjb3VuanZmY2xubHl1ZGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDg1MTAsImV4cCI6MjA4MDYyNDUxMH0.gWEM7AnA9JiAIa-WIQNdXmQ-VFD6uBZJqQAff-xdwkk';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheXNjb3VuanZmY2xubHl1ZGR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA0ODUxMCwiZXhwIjoyMDgwNjI0NTEwfQ.xfcL8sH_J_5H4lopPz7B8MPM7utUk82CxAeAfQrMGhA';

const admin = createClient(SUPA_URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

async function liveTest() {
  const email = 'livetest' + Date.now() + '@gmail.com';
  const pass = 'LiveTestPass99';
  const name = 'Live Test User';

  console.log('=== LIVE PRODUCTION E2E TEST ===\n');

  // 1. Call production API route
  console.log('1. POST ' + PROD_URL + '/api/provider-signup');
  const res = await fetch(PROD_URL + '/api/provider-signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pass, full_name: name }),
  });
  const result = await res.json();
  console.log('   Status:', res.status);
  console.log('   Body:', JSON.stringify(result));

  if (!result.success) {
    console.log('\n*** API ROUTE FAILED ***');
    return;
  }

  const uid = result.userId;
  const appId = result.appId;
  console.log('   userId:', uid);
  console.log('   appId:', appId);

  // 2. signInWithPassword (like the client does)
  console.log('\n2. signInWithPassword...');
  const anonClient = createClient(SUPA_URL, ANON_KEY);
  const { data: signIn, error: signInErr } = await anonClient.auth.signInWithPassword({ email, password: pass });
  console.log('   session:', signIn?.session ? 'YES' : 'NULL');
  if (signInErr) console.log('   error:', signInErr.message);

  if (!signIn?.session) {
    console.log('\n*** SIGN IN FAILED ***');
    // cleanup
    await admin.from('provider_applications').delete().eq('id', appId);
    await admin.from('profiles').delete().eq('id', uid);
    await admin.auth.admin.deleteUser(uid);
    return;
  }

  // 3. Client autosave
  console.log('\n3. Client autosave...');
  const { error: saveErr } = await anonClient.from('provider_applications')
    .update({ basic_info: { full_legal_name: name, phone: '604-555-1234', city: 'Vancouver' } })
    .eq('id', appId);
  console.log('   Autosave:', saveErr ? 'FAILED: ' + saveErr.message : 'OK');

  // 4. Storage upload
  console.log('\n4. Storage upload...');
  const path = uid + '/' + Date.now() + '-test.pdf';
  const { data: upData, error: upErr } = await anonClient.storage
    .from('provider-documents')
    .upload(path, Buffer.from('test pdf content'), { contentType: 'application/pdf' });
  console.log('   Upload:', upErr ? 'FAILED: ' + upErr.message : 'OK path=' + upData?.path);

  // 5. Doc record
  console.log('\n5. Doc record insert...');
  const { data: docRow, error: docErr } = await anonClient.from('provider_documents').insert({
    user_id: uid, application_id: appId, category: 'government_id',
    file_name: 'test.pdf', file_path: upData?.path || path,
    file_type: 'application/pdf', file_size: 16,
  }).select('id').single();
  console.log('   Doc:', docErr ? 'FAILED: ' + docErr.message : 'OK id=' + docRow?.id);

  // 6. Submit
  console.log('\n6. Submit application...');
  const { error: subErr } = await anonClient.from('provider_applications')
    .update({ status: 'submitted', submitted_at: new Date().toISOString() })
    .eq('id', appId);
  console.log('   Submit:', subErr ? 'FAILED: ' + subErr.message : 'OK');

  // Verify
  const { data: final } = await admin.from('provider_applications').select('status').eq('id', appId).single();
  console.log('\n   Final status:', final?.status);

  if (final?.status === 'submitted') {
    console.log('\n=== ALL STEPS PASSED ON PRODUCTION ===');
  } else {
    console.log('\n=== SOMETHING FAILED ===');
  }

  // Cleanup
  console.log('\nCleaning up test data...');
  if (upData?.path) await admin.storage.from('provider-documents').remove([upData.path]);
  if (docRow?.id) await admin.from('provider_documents').delete().eq('id', docRow.id);
  await admin.from('provider_applications').delete().eq('id', appId);
  await admin.from('profiles').delete().eq('id', uid);
  await admin.auth.admin.deleteUser(uid);
  console.log('Done.');
}

liveTest().catch(e => console.error('FATAL:', e.message));
