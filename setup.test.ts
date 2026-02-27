import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * US-001: Install Auth0 Next.js SDK and configure environment
 * 
 * Tests verify that:
 * - @auth0/nextjs-auth0 is installed as a dependency
 * - .env.example exists with all required Auth0 variables
 * - .env.local (and all .env* files) are in .gitignore
 */
describe('US-001: Auth0 SDK and Environment Configuration', () => {
  const rootDir = path.resolve(__dirname);
  
  it('should have @auth0/nextjs-auth0 in package.json dependencies', () => {
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    
    expect(packageJson.dependencies).toBeDefined();
    expect(packageJson.dependencies['@auth0/nextjs-auth0']).toBeDefined();
    expect(typeof packageJson.dependencies['@auth0/nextjs-auth0']).toBe('string');
  });

  it('should have .env.example file', () => {
    const envExamplePath = path.join(rootDir, '.env.example');
    const exists = fs.existsSync(envExamplePath);
    
    expect(exists).toBe(true);
  });

  it('should have all required Auth0 variables in .env.example', () => {
    const envExamplePath = path.join(rootDir, '.env.example');
    const envExampleContent = fs.readFileSync(envExamplePath, 'utf-8');
    
    // Required Auth0 configuration variables
    const requiredVars = [
      'AUTH0_SECRET',
      'AUTH0_BASE_URL',
      'AUTH0_ISSUER_BASE_URL',
      'AUTH0_CLIENT_ID',
      'AUTH0_CLIENT_SECRET'
    ];
    
    requiredVars.forEach(varName => {
      expect(envExampleContent).toContain(varName);
    });
  });

  it('should have .env* files in .gitignore', () => {
    const gitignorePath = path.join(rootDir, '.gitignore');
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    
    // Check that .env files are ignored (either .env* or .env.local specifically)
    const hasEnvIgnore = gitignoreContent.includes('.env*') || 
                        gitignoreContent.includes('.env.local');
    
    expect(hasEnvIgnore).toBe(true);
  });

  it('should document Management API variables in .env.example', () => {
    const envExamplePath = path.join(rootDir, '.env.example');
    const envExampleContent = fs.readFileSync(envExamplePath, 'utf-8');
    
    // Management API is needed for resend verification email feature
    const managementApiVars = [
      'AUTH0_MANAGEMENT_API_CLIENT_ID',
      'AUTH0_MANAGEMENT_API_CLIENT_SECRET',
      'AUTH0_MANAGEMENT_API_AUDIENCE'
    ];
    
    managementApiVars.forEach(varName => {
      expect(envExampleContent).toContain(varName);
    });
  });
});
