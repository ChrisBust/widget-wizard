import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-jwt-key-that-is-at-least-32-chars-long');
const sessionCookieName = 'session';

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Extend session to 24 hours
    .sign(secretKey);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, secretKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    // This can happen if the token is expired or invalid
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(sessionCookieName)?.value;
  if (!sessionCookie) return null;
  
  const decrypted = await decrypt(sessionCookie);
  if (!decrypted) return null;

  const { session, exp } = decrypted;
  
  // 'exp' is in seconds, Date.now() is in milliseconds
  if (exp * 1000 < Date.now()) {
    // If the session from the cookie is expired, treat it as no session.
    return null;
  }
  return session;
}
