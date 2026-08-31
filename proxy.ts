import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
///prevodi secret key iz .env u plain da jose moze procitat
const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);
const protectedRoutes = ['/', '/brodovi', '/rezervacije', '/prihodi'];
const authRoutes = ['/signin', '/signup'];

export async function proxy(request: NextRequest) {
  ///cita samo path a ne cijeli url
  const path = request.nextUrl.pathname;
  ///provjerava ako je nested ruta rezervacije/brod da i to bude zasticeno, i da je homepage
  const isProtectedRoute =
    path === '/' || protectedRoutes.some((route) => route !== '/' && path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  ///cita session cookie, ako nema cookie onda ide undefined
  const cookie = request.cookies.get('session')?.value;
  ///defaultno je izlogiran
  let isAuthenticated = false;

  /// verifikacija krece samo ako postoji cookie, try/catch blok baca error ako je cookie invalid, mijenjan ili istekao
  if (cookie) {
    try {
      await jwtVerify(cookie, encodedKey);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  /// ako je ruta protected i user nije signed in, redirect na signin
  if (isProtectedRoute && !isAuthenticated) {
    const signinUrl = new URL('/signin', request.url);
    return NextResponse.redirect(signinUrl);
  }

  ///ako je ulogiran i proba na signin/up, vraca na  homepage
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

///matcher - proxy ce se runnat samo na rutama koji su ovdje
export const config = {
  matcher: ['/', '/brodovi', '/rezervacije', '/prihodi', '/signin', '/signup'],
};
