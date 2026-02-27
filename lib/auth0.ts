import { Auth0Client } from '@auth0/nextjs-auth0/server';

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
