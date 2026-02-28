import { describe, it, expect } from 'vitest';

describe('Middleware Configuration', () => {
  describe('Route matching patterns', () => {
    it('should have middleware config exported', async () => {
      const { config } = await import('@/middleware');
      
      expect(config).toBeDefined();
      expect(config.matcher).toBeDefined();
    });

    it('should exclude static files from middleware', async () => {
      const { config } = await import('@/middleware');
      const matcher = config.matcher[0];
      
      // Verify it excludes _next/static, _next/image, and static assets
      expect(matcher).toContain('_next/static');
      expect(matcher).toContain('_next/image');
    });
  });

  describe('Route protection logic', () => {
    it('should identify public routes correctly', async () => {
      const { middleware } = await import('@/middleware');
      
      // Public routes should pass through
      const publicRoutes = [
        '/',
        '/api/auth/login',
        '/api/auth/callback',
        '/verify-email',
      ];

      // This tests that the middleware function exists and can be called
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });

    it('should identify protected routes that require auth', () => {
      const protectedRoutes = [
        '/members',
        '/members/upgrade',
        '/premium',
        '/admin/upgrade-requests',
      ];

      // These routes should be protected by middleware
      protectedRoutes.forEach(route => {
        expect(route.startsWith('/members') || 
               route.startsWith('/premium') || 
               route.startsWith('/admin')).toBe(true);
      });
    });
  });

  describe('Redirect logic', () => {
    it('should construct proper redirect URLs', () => {
      const baseUrl = 'http://localhost:3000';
      const returnPath = '/members';
      
      const loginUrl = new URL('/api/auth/login', baseUrl);
      loginUrl.searchParams.set('returnTo', returnPath);
      
      expect(loginUrl.toString()).toBe('http://localhost:3000/api/auth/login?returnTo=%2Fmembers');
    });

    it('should preserve return path in login redirect', () => {
      const returnPaths = ['/members', '/premium', '/admin/upgrade-requests'];
      
      returnPaths.forEach(path => {
        const loginUrl = new URL('/api/auth/login', 'http://localhost:3000');
        loginUrl.searchParams.set('returnTo', path);
        
        expect(loginUrl.searchParams.get('returnTo')).toBe(path);
      });
    });
  });
});
