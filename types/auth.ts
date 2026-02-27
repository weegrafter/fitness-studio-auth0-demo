/**
 * Auth-related type definitions
 */

export interface UserSession {
  sub: string;
  name?: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
  roles: string[];
  [key: string]: unknown;
}
