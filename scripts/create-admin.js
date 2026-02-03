#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => new Promise((resolve) => {
  rl.question(prompt, resolve);
});

async function main() {
  console.log('🔐 Create Admin User\n');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase environment variables');
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const email = await question('Admin email: ');
  const password = await question('Admin password: ');
  const fullName = await question('Full name: ');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    // Create user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    });

    if (error) throw error;

    // Update profile to admin
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'admin', status: 'active' })
      .eq('id', data.user.id);

    if (profileError) throw profileError;

    console.log('\n✅ Admin user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`\nYou can now sign in at: https://pros.urbance.ca/login`);
  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
