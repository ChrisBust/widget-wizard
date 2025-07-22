import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secretKeyString = process.env.JWT_SECRET;

// We will check for the secret in the functions that use it instead of at the top level.
// This prevents a build-time crash if the variable isn't set, which is common in some CI/CD environments.
const getSecretKey = () => {
  if (!secretKeyString || secretKeyString.length < 32) {
    throw new Error('The JWT_SECRET environment variable must be set and be at least 32 characters long.');
  }
  return new TextEncoder().encode(secretKeyString);
};

const sessionCookieName = 'session';

export async function encrypt(payload: any) {
  const secretKey = getSecretKey();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(secretKey);
}

export async function decrypt(input: string): Promise<any> {
  // If the secret isn't set, we can't decrypt anything.
  if (!secretKeyString) {
    console.error("JWT_SECRET is not set. Cannot decrypt session.");
    return null;
  }
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(input, secretKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    // This can happen if the token is expired, invalid, or the secret is wrong.
    console.error("Failed to verify session:", error);
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
