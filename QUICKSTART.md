# Quick Start Guide - Urbance Provider Portal

## 60-Second Setup

```bash
# 1. Install
npm install

# 2. Create .env.local (see .env.example for template)
# Copy Supabase URL and keys from https://supabase.com

# 3. Run Supabase migration
# Go to Supabase Dashboard → SQL Editor
# Paste contents of supabase/migrations/001_initial_schema.sql
# Execute

# 4. Create admin user
node scripts/create-admin.js

# 5. Start dev server
npm run dev

# Open http://localhost:3000
```

## Key URLs

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/apply` | Provider application |
| `/login` | Sign in |
| `/signup` | Create account |
| `/dashboard` | Provider dashboard (auth required) |
| `/admin` | Admin panel (admin only) |

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these from Supabase Dashboard → Settings → API

## Commands

```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm start           # Start production server
npm run lint        # Check code quality
npm run db:migrate  # Create admin user (runs create-admin.js)
```

## Project Structure

```
src/
├── app/(public)/        # Landing pages
├── app/(auth)/          # Login/signup
├── app/(protected)/     # Dashboard & admin
├── components/ui/       # UI components
└── lib/                 # Utilities & config

supabase/
└── migrations/          # Database schema

scripts/
└── create-admin.js      # Admin user creation
```

## Database Tables

- `profiles` - User accounts
- `provider_applications` - Applications
- `provider_services` - Services offered
- `jobs` - Service jobs
- `payouts` - Payments
- `documents` - Documents
- `support_tickets` - Support

## Features

✅ Multi-step application  
✅ Provider dashboard  
✅ Admin tools  
✅ Supabase auth  
✅ RLS security  
✅ TypeScript  
✅ Tailwind CSS  
✅ Production-ready  

## Deployment

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Vercel
# Go to vercel.com → New Project → Select repo

# 3. Add env variables in Vercel Settings

# 4. Deploy
# Vercel auto-deploys on push

# 5. Set custom domain
# Add pros.urbance.ca in Vercel Domain settings
```

## Troubleshooting

**Build fails?**
```bash
rm -rf node_modules .next
npm install
npm run build
```

**Auth not working?**
- Check .env.local credentials
- Verify Supabase project is running
- Clear browser cookies

**RLS blocking?**
- Run SQL migration in Supabase
- Check user role in profiles table

## Resources

- Docs: `README.md`, `SETUP.md`, `PROJECT_COMPLETE.md`
- Supabase: https://supabase.com/docs
- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com

## Brand Colors

```
Primary:        #2F80ED (Blue)
Secondary:      #EAF2FF (Light Blue)
Dark:           #111111 (Black)
White:          #FFFFFF
Dark Grey:      #2B2B2B
Medium Grey:    #6B7280
Light Grey:     #F5F7FA
```

---

For detailed setup, see `SETUP.md`  
For project overview, see `PROJECT_COMPLETE.md`
