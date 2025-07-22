import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/actions';

const protectedRoutes = ['/dashboard'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

  if (isProtectedRoute) {
    const session = await getSession();
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  
  // If trying to access login page while already logged in
  if (path === '/login') {
    const session = await getSession();
    if(session) {
        const url = req.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
