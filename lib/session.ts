import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
///secret key za sign/verify jwt
const secretKey = process.env.SESSION_SECRET;
///za library jose se mora encode
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: number, username: string) {
  ///duljina sessiona 7 dana
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  ///build i sign za jwt token
  const session = await new SignJWT({ userId, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(encodedKey);
  ///next.js cookies mora await kad se koristi u server actions ili route handler
  const cookieStore = await cookies();
  ///spremanje jwt u cookie
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}
/// read i verify cookie, vraca payload userid, username... ako je valid, inače null
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  /// provjera jwt poptpis i provjera je li istekao, error ako je istekao invalid ili promijenjen
  try {
    const { payload } = await jwtVerify(session, encodedKey);
    return payload;
  } catch {
    return null;
  }
}
///log out tako sto izbrise cookie
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
