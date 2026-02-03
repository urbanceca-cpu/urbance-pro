#!/bin/bash
set -e

echo "🚀 Setting up Urbance Provider Portal..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found!"
  echo "Please copy .env.example to .env.local and fill in your Supabase credentials"
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run migrations (placeholder - needs manual execution in Supabase)
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up Supabase project at https://supabase.com"
echo "2. Run the SQL migration from supabase/migrations/001_initial_schema.sql"
echo "3. Copy your Supabase URL and anon key to .env.local"
echo "4. Run: npm run dev"
echo ""
echo "To create the first admin user, run:"
echo "  node scripts/create-admin.js"
