import { NextResponse, type NextRequest } from 'next/server';

const COOKIE_NAME = 'cfb_token';
const PUBLIC_PATHS = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = request.cookies.has(COOKIE_NAME);
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (!hasToken && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (hasToken && isPublic) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon|.*\\..*).*)'],
};
