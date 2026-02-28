import { getSession } from './auth0';
import { cookies } from 'next/headers';

/**
 * Check if email verification should be enforced for the current user
 * 
 * Progressive verification logic:
 * - First login: Allow access (set first_login_allowed cookie)
 * - Subsequent logins: Block if email not verified
 */
export async function shouldEnforceEmailVerification(): Promise<{
  shouldEnforce: boolean;
  isVerified: boolean;
  isFirstLogin: boolean;
}> {
  const session = await getSession();
  
  if (!session) {
    return { shouldEnforce: false, isVerified: false, isFirstLogin: false };
  }

  const isVerified = session.email_verified === true;
  
  // If email is verified, no need to enforce
  if (isVerified) {
    return { shouldEnforce: false, isVerified: true, isFirstLogin: false };
  }

  // Check if this is the first login (check for tracking cookie)
  const cookieStore = await cookies();
  const firstLoginCookie = cookieStore.get(`first_login_${session.sub}`);
  
  if (!firstLoginCookie) {
    // This is the first login, allow it and set cookie
    return { shouldEnforce: false, isVerified: false, isFirstLogin: true };
  }

  // Not first login and email not verified - enforce verification
  return { shouldEnforce: true, isVerified: false, isFirstLogin: false };
}

/**
 * Mark user's first login as completed
 */
export async function markFirstLoginComplete(userId: string): Promise<void> {
  const cookieStore = await cookies();
  // Set cookie for 30 days
  cookieStore.set(`first_login_${userId}`, 'true', {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}
