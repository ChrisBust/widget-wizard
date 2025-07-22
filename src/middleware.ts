
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

  // Cloned to avoid marking req as read-only.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-next-pathname', req.nextUrl.pathname);

  const session = await getSession();

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (publicRoutes.includes(path) && session) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
}

// By exporting a dummy POST function, we force this middleware to run on the server runtime
// instead of the edge runtime. This ensures consistent access to environment variables.
export async function POST() {}

export const config = {
  // Mongoose is not compatible with the Edge runtime, so we need to run middleware on the server (Node.js).
  // We also match all paths except for static assets and API routes.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
