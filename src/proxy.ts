import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/admin'];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/signup'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Build a response we can attach cookie mutations to
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session if expired — required for Server Components
  const { data: { user } } = await supabase.auth.getUser();
  const hasSession = !!user;

  // Not logged in → redirect to login
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in + trying to access auth pages → send to dashboard
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Dashboard gating: check application status
  if (isProtectedRoute && hasSession && user) {
    try {
      const { data: app } = await supabase
        .from('provider_applications')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle();

      const status = app?.status;

      // No application or still a draft → must complete application
      if (!status || status === 'draft') {
        const url = new URL('/apply', request.url);
        url.searchParams.set('message', 'complete-application');
        return NextResponse.redirect(url);
      }

      // Rejected → back to apply
      if (status === 'rejected') {
        const url = new URL('/apply', request.url);
        url.searchParams.set('message', 'application-rejected');
        return NextResponse.redirect(url);
      }

      // submitted/under_review → protected layout will show the "Under Review" screen
      // approved → full access, fall through
    } catch {
      // If DB check fails, let layout handle it
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
