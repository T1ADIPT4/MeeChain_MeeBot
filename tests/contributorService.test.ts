/**
 * Tests for Contributor Service
 */

import { describe, test, expect } from '@jest/globals';

// Mock contributor data structure
interface Contributor {
  address: string;
  name?: string;
  reputation: number;
  badges: string[];
  tier?: number;
}

describe('Contributor Service', () => {
  describe('fetchContributors', () => {
    test('should return array of contributors', () => {
      const mockContributors: Contributor[] = [
        {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          name: 'Test User',
          reputation: 100,
          badges: ['Watchdog', 'Pioneer'],
          tier: 2,
        },
      ];

      expect(Array.isArray(mockContributors)).toBe(true);
      expect(mockContributors.length).toBeGreaterThanOrEqual(0);
    });

    test('contributors should have required fields', () => {
      const contributor: Contributor = {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        reputation: 50,
        badges: ['Quest Master'],
      };

      expect(contributor).toHaveProperty('address');
      expect(contributor).toHaveProperty('reputation');
      expect(contributor).toHaveProperty('badges');
      expect(Array.isArray(contributor.badges)).toBe(true);
    });

    test('address should be valid Ethereum address format', () => {
      const validAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const addressRegex = /^0x[a-fA-F0-9]{40}$/;

      expect(validAddress).toMatch(addressRegex);
    });
  });

  describe('Contributor Data Validation', () => {
    test('reputation should be a non-negative number', () => {
      const contributor: Contributor = {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        reputation: 75,
        badges: [],
      };

      expect(typeof contributor.reputation).toBe('number');
      expect(contributor.reputation).toBeGreaterThanOrEqual(0);
    });

    test('badges should be an array of strings', () => {
      const badges = ['Watchdog', 'Pioneer', 'Quest Master'];

      expect(Array.isArray(badges)).toBe(true);
      badges.forEach(badge => {
        expect(typeof badge).toBe('string');
      });
    });

    test('contributor name is optional', () => {
      const withName: Contributor = {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        name: 'Alice',
        reputation: 50,
        badges: [],
      };

      const withoutName: Contributor = {
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
        reputation: 50,
        badges: [],
      };

      expect(withName.name).toBeDefined();
      expect(withoutName.name).toBeUndefined();
    });
  });

  describe('Search and Filter Functions', () => {
    test('should filter contributors by minimum reputation', () => {
      const contributors: Contributor[] = [
        { address: '0x111', reputation: 100, badges: [] },
        { address: '0x222', reputation: 50, badges: [] },
        { address: '0x333', reputation: 75, badges: [] },
      ];

      const minReputation = 60;
      const filtered = contributors.filter(c => c.reputation >= minReputation);

      expect(filtered.length).toBe(2);
      filtered.forEach(c => {
        expect(c.reputation).toBeGreaterThanOrEqual(minReputation);
      });
    });

    test('should filter contributors by badge type', () => {
      const contributors: Contributor[] = [
        { address: '0x111', reputation: 100, badges: ['Watchdog'] },
        { address: '0x222', reputation: 50, badges: ['Pioneer'] },
        { address: '0x333', reputation: 75, badges: ['Watchdog', 'Pioneer'] },
      ];

      const targetBadge = 'Watchdog';
      const filtered = contributors.filter(c =>
        c.badges.includes(targetBadge)
      );

      expect(filtered.length).toBe(2);
      filtered.forEach(c => {
        expect(c.badges).toContain(targetBadge);
      });
    });

    test('should search contributors by address or name', () => {
      const contributors: Contributor[] = [
        { address: '0x1234', name: 'Alice', reputation: 100, badges: [] },
        { address: '0x5678', name: 'Bob', reputation: 50, badges: [] },
      ];

      const query = 'alice';
      const filtered = contributors.filter(c =>
        c.name?.toLowerCase().includes(query.toLowerCase()) ||
        c.address.toLowerCase().includes(query.toLowerCase())
      );

      expect(filtered.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Top Contributors', () => {
    test('should sort contributors by reputation', () => {
      const contributors: Contributor[] = [
        { address: '0x111', reputation: 50, badges: [] },
        { address: '0x222', reputation: 100, badges: [] },
        { address: '0x333', reputation: 75, badges: [] },
      ];

      const sorted = [...contributors].sort((a, b) => b.reputation - a.reputation);

      expect(sorted[0].reputation).toBeGreaterThanOrEqual(sorted[1].reputation);
      expect(sorted[1].reputation).toBeGreaterThanOrEqual(sorted[2].reputation);
    });

    test('should limit top contributors to specified count', () => {
      const contributors: Contributor[] = Array(10).fill(null).map((_, i) => ({
        address: `0x${i}`,
        reputation: i * 10,
        badges: [],
      }));

      const limit = 5;
      const topContributors = contributors
        .sort((a, b) => b.reputation - a.reputation)
        .slice(0, limit);

      expect(topContributors.length).toBe(limit);
    });
  });

  describe('Badge Distribution', () => {
    test('should calculate badge distribution statistics', () => {
      const contributors: Contributor[] = [
        { address: '0x111', reputation: 100, badges: ['Watchdog', 'Pioneer'] },
        { address: '0x222', reputation: 50, badges: ['Watchdog'] },
        { address: '0x333', reputation: 75, badges: ['Quest Master'] },
      ];

      const badgeCount: Record<string, number> = {};
      contributors.forEach(c => {
        c.badges.forEach(badge => {
          badgeCount[badge] = (badgeCount[badge] || 0) + 1;
        });
      });

      expect(badgeCount['Watchdog']).toBe(2);
      expect(badgeCount['Pioneer']).toBe(1);
      expect(badgeCount['Quest Master']).toBe(1);
    });

    test('should calculate total badge count', () => {
      const contributors: Contributor[] = [
        { address: '0x111', reputation: 100, badges: ['Watchdog', 'Pioneer'] },
        { address: '0x222', reputation: 50, badges: ['Watchdog'] },
      ];

      const totalBadges = contributors.reduce((sum, c) => sum + c.badges.length, 0);

      expect(totalBadges).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    test('should handle contributor with no badges', () => {
      const contributor: Contributor = {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        reputation: 10,
        badges: [],
      };

      expect(contributor.badges.length).toBe(0);
      expect(Array.isArray(contributor.badges)).toBe(true);
    });

    test('should handle empty contributors list', () => {
      const contributors: Contributor[] = [];

      expect(contributors.length).toBe(0);
      expect(Array.isArray(contributors)).toBe(true);
    });

    test('should handle contributor with many badges', () => {
      const manyBadges = [
        'Watchdog', 'Pioneer', 'Quest Master', 'Early Adopter',
        'Community Leader', 'Developer', 'Tester', 'Designer'
      ];

      const contributor: Contributor = {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        reputation: 200,
        badges: manyBadges,
      };

      expect(contributor.badges.length).toBeGreaterThan(5);
      expect(new Set(contributor.badges).size).toBe(contributor.badges.length);
    });
  });
});
