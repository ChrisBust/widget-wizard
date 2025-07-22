import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('The JWT_SECRET environment variable must be set and be at least 32 characters long.');
}

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
const sessionCookieName = 'session';

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
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

  const { session } = decrypted;
  return session;
}
