
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  // Cloned to avoid marking req as read-only.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-next-pathname', req.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
}

export const config = {
  // We match all paths except for static assets and API routes.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
