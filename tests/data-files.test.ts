import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { PremiumContent, UpgradeRequest } from '../types/data';

describe('Data Files Structure', () => {
  const dataDir = join(process.cwd(), 'data');

  describe('premium-content.json', () => {
    it('should exist', () => {
      const filePath = join(dataDir, 'premium-content.json');
      expect(existsSync(filePath)).toBe(true);
    });

    it('should be valid JSON', () => {
      const filePath = join(dataDir, 'premium-content.json');
      const content = readFileSync(filePath, 'utf-8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    it('should contain an array', () => {
      const filePath = join(dataDir, 'premium-content.json');
      const content = JSON.parse(readFileSync(filePath, 'utf-8'));
      expect(Array.isArray(content)).toBe(true);
    });

    it('should have at least 3 sample workout items', () => {
      const filePath = join(dataDir, 'premium-content.json');
      const content: PremiumContent[] = JSON.parse(readFileSync(filePath, 'utf-8'));
      expect(content.length).toBeGreaterThanOrEqual(3);
    });

    it('should have valid structure for each item', () => {
      const filePath = join(dataDir, 'premium-content.json');
      const content: PremiumContent[] = JSON.parse(readFileSync(filePath, 'utf-8'));
      
      content.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('videoUrl');
        expect(typeof item.id).toBe('string');
        expect(typeof item.title).toBe('string');
        expect(typeof item.description).toBe('string');
        expect(typeof item.videoUrl).toBe('string');
        expect(item.id).not.toBe('');
        expect(item.title).not.toBe('');
      });
    });
  });

  describe('upgrade-requests.json', () => {
    it('should exist', () => {
      const filePath = join(dataDir, 'upgrade-requests.json');
      expect(existsSync(filePath)).toBe(true);
    });

    it('should be valid JSON', () => {
      const filePath = join(dataDir, 'upgrade-requests.json');
      const content = readFileSync(filePath, 'utf-8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    it('should be an array', () => {
      const filePath = join(dataDir, 'upgrade-requests.json');
      const content = JSON.parse(readFileSync(filePath, 'utf-8'));
      expect(Array.isArray(content)).toBe(true);
    });

    it('should validate structure if items exist', () => {
      const filePath = join(dataDir, 'upgrade-requests.json');
      const content: UpgradeRequest[] = JSON.parse(readFileSync(filePath, 'utf-8'));
      
      // If array has items, validate structure
      if (content.length > 0) {
        content.forEach((item) => {
          expect(item).toHaveProperty('userId');
          expect(item).toHaveProperty('email');
          expect(item).toHaveProperty('timestamp');
          expect(item).toHaveProperty('status');
          expect(typeof item.userId).toBe('string');
          expect(typeof item.email).toBe('string');
          expect(typeof item.timestamp).toBe('string');
          expect(['pending', 'approved', 'rejected']).toContain(item.status);
        });
      }
    });
  });

  describe('Example files', () => {
    it('premium-content.example.json should exist', () => {
      const filePath = join(dataDir, 'premium-content.example.json');
      expect(existsSync(filePath)).toBe(true);
    });

    it('upgrade-requests.example.json should exist', () => {
      const filePath = join(dataDir, 'upgrade-requests.example.json');
      expect(existsSync(filePath)).toBe(true);
    });

    it('premium-content.example.json should be valid', () => {
      const filePath = join(dataDir, 'premium-content.example.json');
      const content = readFileSync(filePath, 'utf-8');
      const parsed: PremiumContent[] = JSON.parse(content);
      expect(Array.isArray(parsed)).toBe(true);
      
      parsed.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('videoUrl');
      });
    });

    it('upgrade-requests.example.json should be valid', () => {
      const filePath = join(dataDir, 'upgrade-requests.example.json');
      const content = readFileSync(filePath, 'utf-8');
      const parsed: UpgradeRequest[] = JSON.parse(content);
      expect(Array.isArray(parsed)).toBe(true);
      
      parsed.forEach((item) => {
        expect(item).toHaveProperty('userId');
        expect(item).toHaveProperty('email');
        expect(item).toHaveProperty('timestamp');
        expect(item).toHaveProperty('status');
      });
    });
  });
});
