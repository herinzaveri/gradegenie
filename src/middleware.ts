import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import axios from 'axios';

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Allow public routes (e.g., home, login, signup)
  if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
    const token = request.cookies.get('authToken')?.value;

    // If the user is already logged in, redirect to the dashboard
    if (token && (pathname === '/login' || pathname === '/signup')) {
      try {
        const response = await axios.post(`${request.nextUrl.origin}/api/validate-token`, {token});
        if (response.data.valid) {
          return NextResponse.redirect(new URL('/dashboard/assignments', request.url));
        } else {
          // If token is invalid, remove it from cookies
          const response = NextResponse.next();
          response.cookies.delete('authToken');
          return response;
        }
      } catch {
        // If validation fails, remove the token and allow access to login/signup
        const response = NextResponse.next();
        response.cookies.delete('authToken');
        return response;
      }
    }
    return NextResponse.next(); // Allow access to public routes
  }

  // For protected routes, validate the token
  const token = request.cookies.get('authToken')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url)); // Redirect to login if no token
  }

  try {
    const response = await axios.post(`${request.nextUrl.origin}/api/validate-token`, {token});
    if (!response.data.valid) {
      // If token is invalid, remove it from cookies and redirect to login
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      redirectResponse.cookies.delete('authToken');
      return redirectResponse;
    }

    return NextResponse.next(); // Allow access to the protected route
  } catch {
    // If validation fails, remove the token and redirect to login
    const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
    redirectResponse.cookies.delete('authToken');
    return redirectResponse;
  }
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - Static files (/_next/static/)
     * - API routes (/api/)
     * - Public files (/favicon.ico, /robots.txt, etc.)
     */
    '/((?!_next/static|api|favicon.ico|robots.txt).*)',
  ],
};
