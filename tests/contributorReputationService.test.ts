/**
 * Tests for Contributor Reputation Service
 */

import {
  recordAction,
  getContributor,
  getAllContributors,
  getBadge,
  getAllBadges,
  clearAllContributors
} from '../src/services/contributorReputationService';

describe('Contributor Reputation Service', () => {
  beforeEach(() => {
    clearAllContributors();
  });

  describe('recordAction', () => {
    it('should create a new contributor on first action', () => {
      const address = '0x1234567890abcdef';
      const result = recordAction(address, 'flag_created', { test: 'data' });

      expect(result.address).toBe(address);
      expect(result.score).toBe(5); // flag_created gives 5 points
      expect(result.totalFlags).toBe(1);
      expect(result.actions.length).toBe(1);
    });

    it('should accumulate score for multiple actions', () => {
      const address = '0x1234567890abcdef';
      
      recordAction(address, 'flag_created');
      recordAction(address, 'flag_created');
      const result = recordAction(address, 'flag_validated');

      expect(result.score).toBe(60); // 5 + 5 + 50
      expect(result.totalFlags).toBe(2);
      expect(result.validatedFlags).toBe(1);
    });

    it('should reduce score for rejected flags', () => {
      const address = '0x1234567890abcdef';
      
      recordAction(address, 'flag_created');
      const result = recordAction(address, 'flag_rejected');

      expect(result.score).toBe(-15); // 5 - 20
      expect(result.totalFlags).toBe(1);
      expect(result.rejectedFlags).toBe(1);
    });

    it('should award Watchdog badge after 10 validated flags', () => {
      const address = '0x1234567890abcdef';
      
      // Create and validate 10 flags
      for (let i = 0; i < 10; i++) {
        recordAction(address, 'flag_created');
        recordAction(address, 'flag_validated');
      }

      const result = getContributor(address);
      expect(result?.validatedFlags).toBe(10);
      expect(result?.badges).toContain('watchdog');
    });

    it('should award Truth Seeker badge with 90%+ validation rate', () => {
      const address = '0x1234567890abcdef';
      
      // Create 10 flags, validate 9, reject 1
      for (let i = 0; i < 9; i++) {
        recordAction(address, 'flag_created');
        recordAction(address, 'flag_validated');
      }
      recordAction(address, 'flag_created');
      recordAction(address, 'flag_rejected');

      const result = getContributor(address);
      expect(result?.totalFlags).toBe(10);
      expect(result?.validatedFlags).toBe(9);
      // 90% validation rate should award Truth Seeker badge
      expect(result?.badges).toContain('truthSeeker');
    });

    it('should award Auditor OG badge at 1000+ score', () => {
      const address = '0x1234567890abcdef';
      
      // Validate 20 flags to get 1000+ score (20 * 50 = 1000, plus creation points)
      for (let i = 0; i < 20; i++) {
        recordAction(address, 'flag_created');
        recordAction(address, 'flag_validated');
      }

      const result = getContributor(address);
      expect(result?.score).toBeGreaterThanOrEqual(1000);
      expect(result?.badges).toContain('auditorOG');
    });
  });

  describe('getContributor', () => {
    it('should return null for non-existent contributor', () => {
      const result = getContributor('0xnonexistent');
      expect(result).toBeNull();
    });

    it('should return contributor stats', () => {
      const address = '0x1234567890abcdef';
      recordAction(address, 'flag_created');
      
      const result = getContributor(address);
      expect(result).not.toBeNull();
      expect(result?.address).toBe(address);
    });
  });

  describe('getAllContributors', () => {
    it('should return empty array when no contributors', () => {
      const result = getAllContributors();
      expect(result).toEqual([]);
    });

    it('should return all contributors', () => {
      recordAction('0xaddr1', 'flag_created');
      recordAction('0xaddr2', 'flag_created');
      recordAction('0xaddr3', 'flag_created');

      const result = getAllContributors();
      expect(result.length).toBe(3);
    });
  });

  describe('getBadge', () => {
    it('should return badge definition', () => {
      const badge = getBadge('watchdog');
      expect(badge).not.toBeNull();
      expect(badge?.name).toBe('Watchdog');
    });

    it('should return null for non-existent badge', () => {
      const badge = getBadge('nonexistent');
      expect(badge).toBeNull();
    });
  });

  describe('getAllBadges', () => {
    it('should return all badge definitions', () => {
      const badges = getAllBadges();
      expect(badges.length).toBeGreaterThan(0);
      expect(badges.some(b => b.id === 'watchdog')).toBe(true);
      expect(badges.some(b => b.id === 'truthSeeker')).toBe(true);
      expect(badges.some(b => b.id === 'auditorOG')).toBe(true);
    });
  });
});
