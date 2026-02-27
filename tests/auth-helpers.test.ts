import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRoles } from '@/lib/auth0';
import type { UserSession } from '@/types/auth';

describe('Auth Helper Functions', () => {
  describe('getRoles', () => {
    it('should return empty array for null/undefined user', () => {
      expect(getRoles(null as unknown as UserSession)).toEqual([]);
      expect(getRoles(undefined as unknown as UserSession)).toEqual([]);
    });

    it('should extract roles from direct roles property', () => {
      const user = {
        sub: 'auth0|123',
        roles: ['admin', 'premium'],
      };
      expect(getRoles(user)).toEqual(['admin', 'premium']);
    });

    it('should extract roles from custom namespace claim', () => {
      const user = {
        sub: 'auth0|123',
        'https://your-app.com/roles': ['premium', 'member'],
      };
      expect(getRoles(user)).toEqual(['premium', 'member']);
    });

    it('should extract roles from Auth0 default namespace', () => {
      const user = {
        sub: 'auth0|123',
        'https://schemas.auth0.com/roles': ['user', 'premium'],
      };
      expect(getRoles(user)).toEqual(['user', 'premium']);
    });

    it('should extract roles from http namespace', () => {
      const user = {
        sub: 'auth0|123',
        'http://your-app.com/roles': ['viewer'],
      };
      expect(getRoles(user)).toEqual(['viewer']);
    });

    it('should return empty array if roles is not an array', () => {
      const user = {
        sub: 'auth0|123',
        roles: 'admin',
      };
      expect(getRoles(user)).toEqual([]);
    });

    it('should filter out non-string values from roles array', () => {
      const user = {
        sub: 'auth0|123',
        roles: ['admin', 123, null, 'premium', undefined],
      };
      expect(getRoles(user)).toEqual(['admin', 'premium']);
    });

    it('should return empty array if no roles found in any namespace', () => {
      const user = {
        sub: 'auth0|123',
        name: 'Test User',
        email: 'test@example.com',
      };
      expect(getRoles(user)).toEqual([]);
    });

    it('should prioritize first found roles namespace', () => {
      const user = {
        sub: 'auth0|123',
        roles: ['admin'],
        'https://your-app.com/roles': ['premium'],
      };
      // Should return the first match (direct roles property)
      expect(getRoles(user)).toEqual(['admin']);
    });
  });

  describe('UserSession type', () => {
    it('should include roles as required property', () => {
      const session: UserSession = {
        sub: 'auth0|123',
        name: 'Test User',
        email: 'test@example.com',
        email_verified: true,
        picture: 'https://example.com/avatar.jpg',
        roles: ['premium'],
      };

      expect(session.roles).toBeDefined();
      expect(Array.isArray(session.roles)).toBe(true);
    });

    it('should allow empty roles array', () => {
      const session: UserSession = {
        sub: 'auth0|123',
        roles: [],
      };

      expect(session.roles).toEqual([]);
    });

    it('should allow multiple roles', () => {
      const session: UserSession = {
        sub: 'auth0|123',
        roles: ['member', 'premium', 'admin'],
      };

      expect(session.roles.length).toBe(3);
      expect(session.roles).toContain('premium');
    });
  });
});
