import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shouldEnforceEmailVerification, markFirstLoginComplete } from '@/lib/email-verification';

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

// Mock auth0 module
vi.mock('@/lib/auth0', () => ({
  getSession: vi.fn(),
}));

import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth0';

describe('Email Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('shouldEnforceEmailVerification', () => {
    it('should not enforce if user is not logged in', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const result = await shouldEnforceEmailVerification();

      expect(result).toEqual({
        shouldEnforce: false,
        isVerified: false,
        isFirstLogin: false,
      });
    });

    it('should not enforce if email is verified', async () => {
      vi.mocked(getSession).mockResolvedValue({
        sub: 'auth0|123',
        email: 'test@example.com',
        email_verified: true,
        roles: [],
      });

      const result = await shouldEnforceEmailVerification();

      expect(result).toEqual({
        shouldEnforce: false,
        isVerified: true,
        isFirstLogin: false,
      });
    });

    it('should not enforce on first login (no cookie)', async () => {
      const mockCookieStore = {
        get: vi.fn().mockReturnValue(undefined),
        set: vi.fn(),
      };
      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      vi.mocked(getSession).mockResolvedValue({
        sub: 'auth0|123',
        email: 'test@example.com',
        email_verified: false,
        roles: [],
      });

      const result = await shouldEnforceEmailVerification();

      expect(result).toEqual({
        shouldEnforce: false,
        isVerified: false,
        isFirstLogin: true,
      });
    });

    it('should enforce on subsequent login if email not verified', async () => {
      const mockCookieStore = {
        get: vi.fn().mockReturnValue({ name: 'first_login_auth0|123', value: 'true' }),
        set: vi.fn(),
      };
      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      vi.mocked(getSession).mockResolvedValue({
        sub: 'auth0|123',
        email: 'test@example.com',
        email_verified: false,
        roles: [],
      });

      const result = await shouldEnforceEmailVerification();

      expect(result).toEqual({
        shouldEnforce: true,
        isVerified: false,
        isFirstLogin: false,
      });
    });
  });

  describe('markFirstLoginComplete', () => {
    it('should set first login cookie', async () => {
      const mockCookieStore = {
        get: vi.fn(),
        set: vi.fn(),
      };
      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      await markFirstLoginComplete('auth0|123');

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'first_login_auth0|123',
        'true',
        expect.objectContaining({
          maxAge: 30 * 24 * 60 * 60,
          httpOnly: true,
          sameSite: 'lax',
        })
      );
    });
  });
});
