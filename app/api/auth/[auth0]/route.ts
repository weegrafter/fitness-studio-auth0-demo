import { auth0 } from '@/lib/auth0';

/**
 * Auth0 authentication handler
 * 
 * This dynamic route handles all Auth0 authentication flows:
 * - /api/auth/login - Initiates login flow
 * - /api/auth/logout - Handles logout
 * - /api/auth/callback - Handles Auth0 callback after login
 * - /api/auth/profile - Returns current user session
 */
export async function GET(request: Request) {
  return auth0.middleware(request);
}
