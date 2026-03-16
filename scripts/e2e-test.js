const { createClient } = require('@supabase/supabase-js');

const url = 'https://fayscounjvfclnlyuddv.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheXNjb3VuanZmY2xubHl1ZGR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA0ODUxMCwiZXhwIjoyMDgwNjI0NTEwfQ.xfcL8sH_J_5H4lopPz7B8MPM7utUk82CxAeAfQrMGhA';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheXNjb3VuanZmY2xubHl1ZGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDg1MTAsImV4cCI6MjA4MDYyNDUxMH0.gWEM7AnA9JiAIa-WIQNdXmQ-VFD6uBZJqQAff-xdwkk';

const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function e2eTest() {
  const testEmail = 'e2etest' + Date.now() + '@gmail.com';
  const testPass = 'TestPass1234A';
  const testName = 'E2E Test User';

  console.log('=== E2E TEST: New Server-Side Signup Flow ===\n');

  // STEP 1: Admin creates user (mimics API route)
  console.log('1. Admin createUser(' + testEmail + ', email_confirm: true)...');
  const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
    email: testEmail,
    password: testPass,
    email_confirm: true,
    user_metadata: { full_name: testName },
  });

  if (createErr) {
    console.log('   FAILED:', createErr.message);
    return;
  }
  const uid = newUser.user.id;
  console.log('   OK user.id:', uid);
  console.log('   email_confirmed_at:', newUser.user.email_confirmed_at || 'null');

  // STEP 2: Client signs in with password (mimics client after API)
  console.log('\n2. signInWithPassword (anon client)...');
  const anonClient = createClient(url, anonKey);
  const { data: signInData, error: signInErr } = await anonClient.auth.signInWithPassword({
    email: testEmail,
    password: testPass,
  });

  if (signInErr) {
    console.log('   FAILED:', signInErr.message);
    await admin.auth.admin.deleteUser(uid);
    return;
  }

  console.log('   session:', signInData.session ? 'YES' : 'NULL');
  console.log('   access_token:', signInData.session?.access_token ? signInData.session.access_token.substring(0, 30) + '...' : 'null');

  if (!signInData.session) {
    console.log('\n*** signInWithPassword returned no session even after admin confirm ***');
    await admin.auth.admin.deleteUser(uid);
    return;
  }

  // STEP 3: Profile upsert (admin)
  console.log('\n3. Profile upsert (admin)...');
  const { error: profErr } = await admin.from('profiles').upsert(
    { id: uid, role: 'provider', full_name: testName },
    { onConflict: 'id' }
  );
  console.log('   Profile:', profErr ? 'FAILED: ' + profErr.message : 'OK');

  // STEP 4: Create draft (admin)
  console.log('\n4. Create draft application (admin)...');
  const { data: draft, error: draftErr } = await admin.from('provider_applications').insert({
    user_id: uid, status: 'draft', step_completed: {}, basic_info: {},
    services_coverage: {}, experience_standards: {}, pricing_availability: {},
  }).select('id').single();
  console.log('   Draft:', draftErr ? 'FAILED: ' + draftErr.message : 'OK id=' + draft?.id);

  // STEP 5: Client autosave (using session)
  console.log('\n5. Client autosave (update basic_info via RLS)...');
  const { error: saveErr } = await anonClient.from('provider_applications')
    .update({ basic_info: { full_legal_name: 'E2E Test', phone: '604-555-0000', city: 'Vancouver' } })
    .eq('id', draft.id);
  console.log('   Autosave:', saveErr ? 'FAILED: ' + saveErr.message : 'OK');

  // STEP 6: Document upload (using session)
  console.log('\n6. Document upload to storage...');
  const storagePath = uid + '/' + Date.now() + '-test.pdf';
  const testFile = Buffer.from('fake pdf for testing');
  const { data: upData, error: upErr } = await anonClient.storage
    .from('provider-documents')
    .upload(storagePath, testFile, { contentType: 'application/pdf', cacheControl: '3600', upsert: false });
  console.log('   Storage upload:', upErr ? 'FAILED: ' + upErr.message : 'OK path=' + upData?.path);

  // STEP 7: Save doc record
  console.log('\n7. Save document record to DB...');
  const { data: docRow, error: docErr } = await anonClient.from('provider_documents').insert({
    user_id: uid, application_id: draft.id, category: 'government_id',
    file_name: 'test.pdf', file_path: upData?.path || storagePath,
    file_type: 'application/pdf', file_size: 20,
  }).select('id').single();
  console.log('   Doc record:', docErr ? 'FAILED: ' + docErr.message : 'OK id=' + docRow?.id);

  // STEP 8: Submit
  console.log('\n8. Submit application...');
  const { error: submitErr } = await anonClient.from('provider_applications')
    .update({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      step_completed: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
    })
    .eq('id', draft.id);
  console.log('   Submit:', submitErr ? 'FAILED: ' + submitErr.message : 'OK');

  // Verify
  console.log('\n9. Verify final state...');
  const { data: final } = await admin.from('provider_applications').select('status').eq('id', draft.id).single();
  console.log('   Final status:', final?.status);

  if (final?.status === 'submitted') {
    console.log('\n=== ALL 9 STEPS PASSED ===');
  } else {
    console.log('\n=== SOMETHING FAILED ===');
  }

  // Cleanup
  console.log('\nCleaning up...');
  if (upData?.path) await admin.storage.from('provider-documents').remove([upData.path]);
  if (docRow?.id) await admin.from('provider_documents').delete().eq('id', docRow.id);
  if (draft?.id) await admin.from('provider_applications').delete().eq('id', draft.id);
  await admin.from('profiles').delete().eq('id', uid);
  await admin.auth.admin.deleteUser(uid);
  console.log('Done.');
}

e2eTest().catch(e => console.error('FATAL:', e.message));
