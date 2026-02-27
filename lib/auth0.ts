import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { UserSession } from '@/types/auth';

/**
 * Validate required Auth0 environment variables on startup
 */
function validateEnv() {
  const required = [
    'AUTH0_SECRET',
    'AUTH0_BASE_URL',
    'AUTH0_ISSUER_BASE_URL',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required Auth0 environment variables: ${missing.join(', ')}`
    );
  }
}

// Validate environment on module load (only in production runtime, not during build or test)
if (
  typeof window === 'undefined' &&
  process.env.NODE_ENV !== 'test' &&
  process.env.NODE_ENV === 'production' &&
  !process.env.NEXT_PHASE
) {
  validateEnv();
}

/**
 * Auth0 client instance for server-side operations
 * 
 * Configured via environment variables:
 * - AUTH0_SECRET: Secret used to encrypt session cookies
 * - AUTH0_BASE_URL: Base URL of the application (e.g., http://localhost:3000)
 * - AUTH0_ISSUER_BASE_URL: Auth0 tenant domain (e.g., https://tenant.auth0.com)
 * - AUTH0_CLIENT_ID: Auth0 application client ID
 * - AUTH0_CLIENT_SECRET: Auth0 application client secret
 */
export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', ''),
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  appBaseUrl: process.env.AUTH0_BASE_URL,
  secret: process.env.AUTH0_SECRET,
});

/**
 * Get the current user session from Auth0
 * @returns User session object or null if not authenticated
 */
export async function getSession(): Promise<UserSession | null> {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      return null;
    }
    return session.user as UserSession;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get the current user data from session
 * @returns User session with roles or null if not authenticated
 */
export async function getUser(): Promise<UserSession | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }

  return {
    ...session,
    roles: getRoles(session),
  };
}

/**
 * Extract roles from user session claims
 * Auth0 can store roles in different claim formats:
 * - Custom namespace: https://your-app.com/roles
 * - Auth0 default: https://schemas.auth0.com/roles
 * - Direct property: roles
 * 
 * @param user User session object
 * @returns Array of role strings
 */
export function getRoles(user: UserSession | Record<string, unknown>): string[] {
  if (!user) {
    return [];
  }

  // Check various possible locations for roles
  const possibleRoleKeys = [
    'roles',
    'https://your-app.com/roles',
    'https://schemas.auth0.com/roles',
    'http://your-app.com/roles',
  ];

  for (const key of possibleRoleKeys) {
    const value = user[key];
    if (Array.isArray(value)) {
      return value.filter((role): role is string => typeof role === 'string');
    }
  }

  return [];
}
