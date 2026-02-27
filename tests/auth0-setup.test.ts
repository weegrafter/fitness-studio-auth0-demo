import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Auth0 Setup', () => {
  describe('API Route', () => {
    it('should have Auth0 dynamic route handler at /app/api/auth/[auth0]/route.ts', () => {
      const routePath = join(process.cwd(), 'app', 'api', 'auth', '[auth0]', 'route.ts');
      expect(existsSync(routePath)).toBe(true);
    });

    it('should export GET handler in Auth0 route', () => {
      const routePath = join(process.cwd(), 'app', 'api', 'auth', '[auth0]', 'route.ts');
      const routeContent = readFileSync(routePath, 'utf-8');
      
      // Check for auth0 import from lib
      expect(routeContent).toContain('@/lib/auth0');
      expect(routeContent).toContain('auth0');
      
      // Check for GET function that uses middleware
      expect(routeContent).toContain('export async function GET');
      expect(routeContent).toContain('auth0.middleware');
    });

    it('should have auth0 client instance in lib/auth0.ts', () => {
      const auth0LibPath = join(process.cwd(), 'lib', 'auth0.ts');
      expect(existsSync(auth0LibPath)).toBe(true);
      
      const auth0LibContent = readFileSync(auth0LibPath, 'utf-8');
      expect(auth0LibContent).toContain('@auth0/nextjs-auth0/server');
      expect(auth0LibContent).toContain('Auth0Client');
      expect(auth0LibContent).toContain('export const auth0');
    });
  });

  describe('Environment Variables', () => {
    it('should have .env.example template with all required Auth0 variables', () => {
      const envExamplePath = join(process.cwd(), '.env.example');
      expect(existsSync(envExamplePath)).toBe(true);
      
      const envContent = readFileSync(envExamplePath, 'utf-8');
      
      // Required Auth0 variables
      expect(envContent).toContain('AUTH0_SECRET');
      expect(envContent).toContain('AUTH0_BASE_URL');
      expect(envContent).toContain('AUTH0_ISSUER_BASE_URL');
      expect(envContent).toContain('AUTH0_CLIENT_ID');
      expect(envContent).toContain('AUTH0_CLIENT_SECRET');
    });

    it('should not contain real credentials in .env.example', () => {
      const envExamplePath = join(process.cwd(), '.env.example');
      const envContent = readFileSync(envExamplePath, 'utf-8');
      
      // Should not have actual secrets
      expect(envContent).not.toContain('sk_');
      expect(envContent).not.toContain('pk_');
    });
  });

  describe('Layout Configuration', () => {
    it('should have Auth0Provider in layout.tsx', () => {
      const layoutPath = join(process.cwd(), 'app', 'layout.tsx');
      const layoutContent = readFileSync(layoutPath, 'utf-8');
      
      // Check for Auth0Provider import
      expect(layoutContent).toContain('@auth0/nextjs-auth0/client');
      expect(layoutContent).toContain('Auth0Provider');
      
      // Check for Auth0Provider usage wrapping children
      expect(layoutContent).toContain('<Auth0Provider>');
      expect(layoutContent).toContain('</Auth0Provider>');
    });

    it('should wrap children with Auth0Provider in correct order', () => {
      const layoutPath = join(process.cwd(), 'app', 'layout.tsx');
      const layoutContent = readFileSync(layoutPath, 'utf-8');
      
      // Verify structure: Auth0Provider wraps children
      const auth0ProviderIndex = layoutContent.indexOf('<Auth0Provider>');
      const childrenIndex = layoutContent.indexOf('{children}');
      const closingProviderIndex = layoutContent.indexOf('</Auth0Provider>');
      
      expect(auth0ProviderIndex).toBeGreaterThan(0);
      expect(childrenIndex).toBeGreaterThan(auth0ProviderIndex);
      expect(closingProviderIndex).toBeGreaterThan(childrenIndex);
    });
  });

  describe('Package Dependencies', () => {
    it('should have @auth0/nextjs-auth0 in package.json dependencies', () => {
      const packagePath = join(process.cwd(), 'package.json');
      const packageContent = JSON.parse(readFileSync(packagePath, 'utf-8'));
      
      expect(packageContent.dependencies).toHaveProperty('@auth0/nextjs-auth0');
    });
  });

  describe('Type Definitions', () => {
    it('should have auth type definitions', () => {
      const authTypesPath = join(process.cwd(), 'types', 'auth.ts');
      expect(existsSync(authTypesPath)).toBe(true);
    });

    it('should define UserSession interface', () => {
      const authTypesPath = join(process.cwd(), 'types', 'auth.ts');
      const authTypesContent = readFileSync(authTypesPath, 'utf-8');
      
      expect(authTypesContent).toContain('interface UserSession');
      expect(authTypesContent).toContain('sub');
      expect(authTypesContent).toContain('email');
    });
  });

  describe('.gitignore Configuration', () => {
    it('should have .env.local in .gitignore', () => {
      const gitignorePath = join(process.cwd(), '.gitignore');
      const gitignoreContent = readFileSync(gitignorePath, 'utf-8');
      
      expect(gitignoreContent).toContain('.env');
    });
  });
});
