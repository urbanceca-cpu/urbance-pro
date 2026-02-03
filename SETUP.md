# Urbance Provider Portal - Setup & Deployment Guide

## Project Overview

**Urbance Provider Portal** (`pros.urbance.ca`) is a complete Next.js web application for managing home service providers. It includes:

- Provider landing pages (how-it-works, services, earnings)
- Multi-step application form (4 steps)
- Secure authentication (Supabase)
- Provider dashboard (profile, jobs, earnings, documents, support)
- Admin dashboard (application review, provider management)
- Database with RLS security policies

**Tech Stack:**
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS 4
- Supabase (Auth + PostgreSQL)
- React Hook Form + Zod
- Sonner (notifications)

---

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (free at https://supabase.com)

### Step 1: Install Dependencies

```bash
cd /Users/dhillon/urbance.ca-pros
npm install
```

### Step 2: Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Note your **Project URL** and **Anon Key** from Settings → API

### Step 3: Create Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Create a new query
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and execute the SQL

This creates:
- 7 database tables with proper relationships
- Row-level security (RLS) policies
- Automatic triggers for timestamps
- Indexes for performance
- Helper functions for auth

### Step 4: Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase
```

Get these values from:
- URL & Anon Key: Supabase Dashboard → Settings → API
- Service Role Key: Supabase Dashboard → Settings → API (scroll down)

### Step 5: Create First Admin User

```bash
# Interactive prompt to create admin account
node scripts/create-admin.js
```

Follow the prompts:
- Email: (your email)
- Password: (secure password)
- Full name: (your name)

### Step 6: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Testing the Application

### Public Pages (No Auth Required)
- `/` - Landing page
- `/how-it-works` - Process overview
- `/services` - Available services
- `/earnings` - Earnings calculator
- `/apply` - Provider application form
- `/login` - Sign in
- `/signup` - Create account

### Provider Dashboard (Auth Required)
- `/dashboard` - Overview
- `/dashboard/profile` - Edit profile
- `/dashboard/jobs` - Job management
- `/dashboard/payouts` - Earnings & payouts
- `/dashboard/documents` - Document uploads
- `/dashboard/support` - Support tickets

### Admin Dashboard (Admin Auth Required)
- `/admin` - Admin home
- `/admin/applications` - Review applications
- `/admin/providers` - Manage providers
- `/admin/jobs` - Job management

### Test Workflow

1. **Sign up as a provider**
   - Go to `/apply`
   - Complete 4-step application
   - Submit (no login required)
   - Click "Sign In" to create account or link existing account

2. **Review application (as admin)**
   - Use admin account credentials
   - Go to `/admin/applications`
   - Review and approve/reject applications

3. **Provider dashboard**
   - Sign in with provider account
   - View `/dashboard` overview
   - Access all dashboard sections

---

## Project File Structure

```
urbance.ca-pros/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                # Public routes
│   │   │   ├── page.tsx            # Landing
│   │   │   ├── apply/              # Application form
│   │   │   ├── how-it-works/       # Info page
│   │   │   ├── services/           # Services list
│   │   │   └── earnings/           # Earnings info
│   │   ├── (auth)/                 # Auth pages
│   │   │   ├── login/              # Sign in
│   │   │   ├── signup/             # Sign up
│   │   │   └── reset-password/     # Reset password
│   │   ├── (protected)/            # Protected routes
│   │   │   ├── dashboard/          # Provider dashboard
│   │   │   │   ├── page.tsx       # Overview
│   │   │   │   ├── profile/       # Profile edit
│   │   │   │   ├── jobs/          # Jobs list
│   │   │   │   ├── payouts/       # Earnings
│   │   │   │   ├── documents/     # Documents
│   │   │   │   └── support/       # Support
│   │   │   ├── admin/             # Admin pages
│   │   │   │   ├── page.tsx       # Admin home
│   │   │   │   ├── applications/  # Application review
│   │   │   │   ├── providers/     # Provider list
│   │   │   │   └── jobs/          # Jobs admin
│   │   │   └── layout.tsx         # Protected layout
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Global styles
│   │
│   ├── components/                # React components
│   │   ├── ui/                    # UI component library
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Stepper.tsx
│   │   │   └── ToastProvider.tsx
│   │   ├── Navbar.tsx             # Navigation bar
│   │   ├── Footer.tsx             # Footer
│   │   └── DashboardSidebar.tsx  # Dashboard sidebar
│   │
│   ├── lib/                       # Utilities & config
│   │   ├── supabase/
│   │   │   ├── client.ts          # Browser Supabase client
│   │   │   └── server.ts          # Server Supabase client
│   │   ├── types.ts               # TypeScript type definitions
│   │   ├── constants.ts           # App constants
│   │   ├── utils.ts               # Helper functions
│   │   └── tailwind.config.ts    # Tailwind config
│   │
│   └── middleware.ts              # Auth middleware
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # Database schema
│
├── scripts/
│   ├── setup.sh                   # Setup script
│   └── create-admin.js            # Admin user creation
│
├── public/                        # Static assets
├── .env.local                     # Environment variables (git ignored)
├── .env.example                   # Example env file
├── next.config.ts                 # Next.js config
├── tailwind.config.ts             # Tailwind config
├── tsconfig.json                  # TypeScript config
├── package.json                   # Dependencies
└── README.md                      # Documentation
```

---

## Database Schema Overview

### Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `profiles` | User profiles | id, role, full_name, phone, city, status |
| `provider_applications` | Applications | full_name, email, phone, services[], status |
| `provider_services` | Services offered | provider_id, service_key, price_hint, active |
| `jobs` | Service jobs | provider_id, service_key, scheduled_at, status |
| `payouts` | Payment records | provider_id, amount, status, period_start/end |
| `documents` | ID documents | provider_id, type, url, status, expires_at |
| `support_tickets` | Support requests | provider_id, subject, message, status |

### Security (RLS)

- **Providers** can only read/write their own data
- **Admins** can read/write all data
- **Anonymous** users can submit applications without auth

---

## Deployment to Production

### Recommended: Vercel (Zero-Config)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your GitHub repo
   - Vercel auto-detects Next.js

3. **Add Environment Variables**
   - In Vercel Project Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

4. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically

5. **Setup Custom Domain**
   - In Vercel Settings → Domains
   - Add `pros.urbance.ca`
   - Update DNS records (instructions provided)

### Self-Hosted (Docker/Node)

```bash
npm run build
npm start
```

Requires Node.js 18+ server with environment variables configured.

---

## Common Development Tasks

### Add a New Page

1. Create file in `src/app/[route]/page.tsx`
2. Use route groups: `(public)`, `(auth)`, `(protected)`, `(admin)`
3. Import Navbar/Footer for layout
4. Protect with middleware if needed

**Example: New Public Page**
```typescript
// src/app/(public)/faq/page.tsx
export default function FAQPage() {
  return <>...</>;
}
```

### Add a New Component

1. Create in `src/components/` or `src/components/ui/`
2. Use TypeScript for type safety
3. Export and import where needed

### Update Database Schema

1. Create new migration: `supabase/migrations/002_*.sql`
2. Run in Supabase SQL Editor
3. Update types in `src/lib/types.ts`

### Add Form Validation

Uses React Hook Form + Zod:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

---

## Troubleshooting

### Build Fails: Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Auth Not Working

- Check `.env.local` has correct Supabase credentials
- Verify Supabase project is running (check Status)
- Clear browser cookies and retry
- Check Network tab for errors

### Database RLS Blocking Queries

- Go to Supabase Dashboard → Authentication → Policies
- Verify RLS policies are created (migration should do this)
- Test with service role key first (should work)
- Check user has correct role in profiles table

### Middleware Not Protecting Routes

- Auth is checked client-side in protected components
- Server-side checks in `(protected)/layout.tsx`
- Users are redirected to `/login` if not authenticated

---

## Environment Variables Checklist

Before deploying, ensure you have:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server only)
- [ ] Database schema created with migrations
- [ ] First admin user created
- [ ] RLS policies enabled in Supabase

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Hook Form**: https://react-hook-form.com
- **Zod Validation**: https://zod.dev

---

## Next Steps (Future Features)

- [ ] Job booking system with notifications
- [ ] Real-time job updates (WebSockets)
- [ ] Provider ratings & reviews
- [ ] Advanced analytics dashboard
- [ ] Email notifications (Resend)
- [ ] SMS notifications
- [ ] Stripe payment processing
- [ ] Mobile app (React Native)
- [ ] Calendar integration
- [ ] Advanced search/filtering

---

## License

Proprietary - Urbance Inc.

All code and design is proprietary to Urbance. Unauthorized copying or use is prohibited.

---

Built with ❤️ for premium service providers in Canada.
