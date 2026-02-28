import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/reset-password', '/apply', '/apply/success',
  '/how-it-works', '/earnings', '/requirements', '/services', '/faq',
  '/success-stories', '/demo', '/become-a-pro',
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith('/services/')) return true;
  if (pathname.startsWith('/_next/') || pathname.startsWith('/api/') || pathname.includes('.')) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public paths through
  if (isPublicPath(pathname)) return NextResponse.next();

  // For protected paths, check auth via cookie
  // We use the anon client and pull the session from the cookie header
  const supabaseUrl = SUPABASE_URL;
  const supabaseKey = SUPABASE_ANON_KEY;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder');
  if (isPlaceholder) return NextResponse.next(); // skip during build

  const cookieHeader = request.headers.get('cookie') ?? '';
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Cookie: cookieHeader } },
  });

  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in → login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Logged in but trying to access /dashboard or sub-pages → check application status
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    const { data: app } = await supabase
      .from('provider_applications')
      .select('status')
      .eq('user_id', user.id)
      .single();

    const status = app?.status;

    // No application or draft → force to apply
    if (!status || status === 'draft') {
      const url = request.nextUrl.clone();
      url.pathname = '/apply';
      url.searchParams.set('message', 'complete-application');
      return NextResponse.redirect(url);
    }

    // Submitted but not yet approved → under-review page (allow dashboard for now if approved)
    if (status === 'submitted' || status === 'under_review') {
      // Allow limited access — redirect to a specific under-review notice
      // (dashboard layout will handle the UI message)
      // We let it through — the dashboard layout will show "Under Review" UI
    }

    // Rejected → back to apply
    if (status === 'rejected') {
      const url = request.nextUrl.clone();
      url.pathname = '/apply';
      url.searchParams.set('message', 'application-rejected');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
