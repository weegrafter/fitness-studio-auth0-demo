import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't need protection
  const publicRoutes = ['/', '/api/auth', '/verify-email'];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Protected routes requiring authentication
  if (pathname.startsWith('/members') || pathname.startsWith('/premium') || pathname.startsWith('/admin')) {
    // Check for session cookie
    const sessionCookie = request.cookies.get('appSession');
    
    if (!sessionCookie) {
      // Redirect to login if no session
      const loginUrl = new URL('/api/auth/login', request.url);
      loginUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Note: Email verification check is handled at the page level
    // because middleware doesn't have direct access to session data
    // Pages use shouldEnforceEmailVerification() to check and redirect
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
