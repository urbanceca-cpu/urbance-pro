# Urbance Provider Portal

Trust-first marketplace for premium home services. Provider portal built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Provider Onboarding**: Multi-step application form with background check integration
- **Provider Dashboard**: Job management, earnings tracking, document uploads, support tickets
- **Admin Panel**: Application review, provider management, job oversight
- **Secure Authentication**: Supabase Auth with role-based access control
- **Premium UI**: Calm, minimal design with soft shadows and strong typography

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (Auth + PostgreSQL)
- **Forms**: React Hook Form + Zod
- **UI Components**: Custom component library
- **Animations**: Framer Motion (light usage)
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Note your Supabase URL and Anon Key
3. In the Supabase dashboard, go to SQL Editor and run the migration:
   - Copy contents from `supabase/migrations/001_initial_schema.sql`
   - Paste into a new SQL query and execute
4. This will create all tables, indexes, RLS policies, and helper functions

### 3. Configure Environment

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Create First Admin User

After setting up Supabase and .env.local:

```bash
npm run db:migrate  # This runs scripts/create-admin.js
```

Or manually:

```bash
node scripts/create-admin.js
```

Follow the prompts to create an admin account.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                # Public pages (no auth required)
│   │   ├── page.tsx            # Landing page
│   │   ├── how-it-works/        # How it works page
│   │   ├── services/            # Available services
│   │   ├── earnings/            # Earnings info
│   │   └── apply/               # Multi-step application
│   ├── (auth)/                  # Auth pages
│   │   ├── login/               # Sign in
│   │   ├── signup/              # Sign up
│   │   └── reset-password/      # Password reset
│   ├── (protected)/             # Protected routes (auth required)
│   │   ├── dashboard/           # Provider dashboard
│   │   │   ├── profile/         # Profile management
│   │   │   ├── jobs/            # Job management
│   │   │   ├── payouts/         # Earnings & payouts
│   │   │   ├── documents/       # Document upload
│   │   │   └── support/         # Support tickets
│   │   └── admin/               # Admin panel
│   │       ├── applications/    # Application review
│   │       ├── providers/       # Provider management
│   │       └── jobs/            # Job management
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # Reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Stepper.tsx
│   │   └── ...
│   ├── Navbar.tsx               # Navigation bar
│   ├── Footer.tsx               # Footer
│   └── DashboardSidebar.tsx     # Dashboard sidebar
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser client
│   │   └── server.ts            # Server client
│   ├── types.ts                 # TypeScript types
│   ├── constants.ts             # App constants
│   └── utils.ts                 # Utility functions
├── middleware.ts                 # Auth middleware
└── tailwind.config.ts           # Tailwind configuration
```

## Database Schema

### Core Tables

- **profiles**: User profiles with role and status
- **provider_applications**: Application submissions
- **provider_services**: Services offered by providers
- **jobs**: Service jobs assigned to providers
- **payouts**: Payment records
- **documents**: Identity & compliance documents
- **support_tickets**: Provider support requests

### RLS Policies

- Providers can view/edit their own data
- Admins can view/edit all data
- Anonymous users can submit applications

## Deployment

Recommended: Vercel (zero-config)

```bash
git push  # Push to GitHub
# Connect repo to Vercel
```

## License

Proprietary - Urbance Inc.

---

Built with ❤️ for premium service providers in Canada.
