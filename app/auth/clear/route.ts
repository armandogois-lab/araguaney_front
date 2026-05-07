import { NextResponse, type NextRequest } from 'next/server';
import { clearSessionCookie } from '@/lib/auth/cookie';

export async function GET(request: NextRequest) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL('/login', request.url));
}
