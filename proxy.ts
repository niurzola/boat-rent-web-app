import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);
const protectedRoutes = ['/', '/brodovi', '/rezervacije', '/prihodi'];
const authRoutes = ['/signin', '/signup'];

export async function proxy(request: NextRequest) {
  console.log('MIDDLEWARE RUNNING:', request.nextUrl.pathname);
  console.log('SECRET SET:', !!process.env.SESSION_SECRET);
  const path = request.nextUrl.pathname;
  const isProtectedRoute =
    path === '/' || protectedRoutes.some((route) => route !== '/' && path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  const cookie = request.cookies.get('session')?.value;
  let isAuthenticated = false;

  if (cookie) {
    try {
      await jwtVerify(cookie, encodedKey);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }
  if (isProtectedRoute && !isAuthenticated) {
    const signinUrl = new URL('/signin', request.url);
    return NextResponse.redirect(signinUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
export const config = {
  matcher: ['/', '/brodovi', '/rezervacije', '/prihodi', '/signin', '/signup'],
};
