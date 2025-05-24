import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Always create a new response to avoid modifying the original
  let response = NextResponse.next({
    request,
  });

  // DEVELOPMENT MODE: Bypass authentication checks in development
  const isDevelopmentMode = process.env.NODE_ENV === 'development';
  const bypassAuth = isDevelopmentMode;
  
  if (bypassAuth) {
    console.log('🔐 [Middleware] Development mode - bypassing auth checks');
    return response;
  }

  // Check if the request is coming from the login page
  const referer = request.headers.get('referer') || '';
  const isFromLogin = referer.includes('/auth/login');
  const isLoginPage = request.nextUrl.pathname === '/auth/login';
  
  // Don't interfere with auth flows when cookies might be in transition
  if (isFromLogin && !isLoginPage) {
    console.log('🔐 [Middleware] Request coming from login page - bypassing auth checks');
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const allCookies = request.cookies.getAll();
          // Log auth cookies specifically for debugging
          const authCookies = allCookies.filter(c => c.name.includes('auth'));
          console.log('🍪 [Middleware] Auth cookies in request:', 
            authCookies.length 
              ? authCookies.map(c => `${c.name.substring(0, 20)}... (length: ${c.value.length})`)
              : 'none'
          );
          return allCookies;
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Don't clear auth cookies with maxAge 0 - this might be causing our issue
            if (name.includes('auth') && options?.maxAge === 0) {
              console.log(`🍪 [Middleware] Skipping zero maxAge cookie: ${name}`);
              return;
            }
            
            console.log(`🍪 [Middleware] Setting cookie: ${name.substring(0, 20)}... with options:`, 
              options ? JSON.stringify({maxAge: options.maxAge, secure: options.secure}) : 'none');
            
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    // Get the user's session
    const {
      data: { session }
    } = await supabase.auth.getSession();
    
    // Use session instead of user for better auth tracking
    const user = session?.user || null;

    const { pathname, searchParams } = request.nextUrl;
    console.log('🔐 [Middleware] Checking route access:', { 
      pathname, 
      isAuthenticated: !!user,
      session_expires: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'none',
      user_id: user?.id || 'none'
    });

    // Force logout parameter for testing (useful for debugging)
    const forceLogout = searchParams.get('force_logout') === 'true';
    if (forceLogout && user) {
      console.log('🔐 [Middleware] Force logout detected - clearing auth cookies');
      
      // Clear auth cookies by setting them to empty with expiry in the past
      response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.set('supabase-auth-token', '', { expires: new Date(0) });
      return response;
    }

    // Check for a test mode flag that bypasses auth redirects - used for testing auth pages
    const testMode = searchParams.get('test_mode') === 'true';
    if (testMode) {
      console.log('🔐 [Middleware] Test mode enabled - bypassing auth redirects');
      return response;
    }

    // Allow all API routes to proceed
    if (pathname.startsWith('/api/')) {
      return response;
    }
    
    // Allow all diagnostics routes to be accessed without auth redirects
    if (pathname.startsWith('/diagnostics')) {
      console.log('🔐 [Middleware] Diagnostics route - bypassing auth redirects');
      return response;
    }

    // Handle email verification - bypass redirect if there's a verification code or if coming from verification
    const hasVerificationCode = searchParams.has('code') && pathname.startsWith('/auth/verification');
    const isVerificationFlow = pathname.startsWith('/auth/verification') || 
                               request.headers.get('referer')?.includes('/auth/verification');
    const hasType = searchParams.has('type') && searchParams.get('type') === 'recovery';
    
    if (hasVerificationCode || isVerificationFlow) {
      console.log('🔐 [Middleware] Email verification flow - bypassing auth redirects');
      return response;
    }
    
    // Handle password recovery flow
    if (hasType && pathname.startsWith('/auth/reset-password')) {
      console.log('🔐 [Middleware] Password recovery flow - bypassing auth redirects');
      return response;
    }

    // Array of routes that should not be protected (public routes)
    const publicRoutes = [
      '/auth/login', 
      '/auth/register', 
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/verification'
    ];

    // Check if the user is not authenticated and trying to access a protected route
    if (!user && !publicRoutes.some(route => pathname.startsWith(route)) && pathname !== '/') {
      console.log('🔐 [Middleware] Unauthenticated user trying to access protected route:', pathname);
      // Preserve the intended URL to redirect back after login
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirect_to', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    // But don't redirect verification pages with codes as they need to process the verification
    if (user && 
        publicRoutes.some(route => pathname.startsWith(route)) && 
        !hasVerificationCode && 
        !hasType && 
        !isVerificationFlow) {
      console.log('🔐 [Middleware] Authenticated user trying to access auth page:', pathname);
      const redirectUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    // If user is authenticated and accessing the root path, redirect to dashboard
    if (user && pathname === '/') {
      console.log('🔐 [Middleware] Authenticated user at root - redirecting to dashboard');
      const redirectUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  } catch (error) {
    console.error('🔐 [Middleware] Error in middleware:', error);
    // In case of error, allow the request to proceed
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files and assets
     * - API routes that should bypass auth
     */
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 