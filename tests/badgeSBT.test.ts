/**
 * Badge SBT Service Tests
 * Tests for badge minting and reputation services
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  BADGE_CATALOG,
  isBadgeUnlocked,
  getUnlockedBadges,
  getNewlyUnlockedBadges,
  getBadgeMetadata,
  getBadgesByCategory,
  getBadgesByRarity,
} from '../src/config/contributor-badges.js';
import {
  ContributorReputationService,
  createReputationService,
  type UserReputation,
} from '../src/services/contributor-reputation-service.js';

describe('Badge Catalog', () => {
  it('should have all badge metadata defined', () => {
    const badgeIds = Object.keys(BADGE_CATALOG).map(Number);
    expect(badgeIds.length).toBeGreaterThan(0);
    
    badgeIds.forEach((id) => {
      const badge = BADGE_CATALOG[id];
      expect(badge).toBeDefined();
      expect(badge.id).toBe(id);
      expect(badge.name).toBeTruthy();
      expect(badge.description).toBeTruthy();
      expect(badge.image).toBeTruthy();
      expect(['contributor', 'achievement', 'special']).toContain(badge.category);
      expect(['common', 'rare', 'epic', 'legendary']).toContain(badge.rarity);
    });
  });

  it('should get badge metadata by ID', () => {
    const badge = getBadgeMetadata(1);
    expect(badge).toBeDefined();
    expect(badge?.name).toBe('First Steps');
  });

  it('should return undefined for invalid badge ID', () => {
    const badge = getBadgeMetadata(999);
    expect(badge).toBeUndefined();
  });

  it('should filter badges by category', () => {
    const contributorBadges = getBadgesByCategory('contributor');
    expect(contributorBadges.length).toBeGreaterThan(0);
    contributorBadges.forEach((badge) => {
      expect(badge.category).toBe('contributor');
    });
  });

  it('should filter badges by rarity', () => {
    const rareBadges = getBadgesByRarity('rare');
    expect(rareBadges.length).toBeGreaterThan(0);
    rareBadges.forEach((badge) => {
      expect(badge.rarity).toBe('rare');
    });
  });
});

describe('Badge Unlock Logic', () => {
  it('should detect unlocked badges based on progress', () => {
    const userProgress = {
      'quest-001': 1,
      'quest-tts-001': 1,
    };

    expect(isBadgeUnlocked(1, userProgress)).toBe(true); // First Steps
    expect(isBadgeUnlocked(2, userProgress)).toBe(true); // TTS Pioneer
    expect(isBadgeUnlocked(3, userProgress)).toBe(false); // Code Contributor
  });

  it('should get all unlocked badges', () => {
    const userProgress = {
      'quest-001': 1,
      'quest-tts-001': 1,
    };

    const unlocked = getUnlockedBadges(userProgress);
    expect(unlocked).toContain(1);
    expect(unlocked).toContain(2);
    expect(unlocked.length).toBeGreaterThanOrEqual(2);
  });

  it('should detect newly unlocked badges', () => {
    const currentBadges = [1]; // Already has First Steps
    const userProgress = {
      'quest-001': 1,
      'quest-tts-001': 1,
    };

    const newlyUnlocked = getNewlyUnlockedBadges(currentBadges, userProgress);
    expect(newlyUnlocked).toContain(2); // TTS Pioneer is new
    expect(newlyUnlocked).not.toContain(1); // First Steps already owned
  });

  it('should handle threshold-based unlocks', () => {
    const userProgress = {
      'quests-completed': 10,
    };

    expect(isBadgeUnlocked(5, userProgress)).toBe(true); // Quest Master (10 quests)
    
    const progressNine = { 'quests-completed': 9 };
    expect(isBadgeUnlocked(5, progressNine)).toBe(false); // Not yet
  });
});

describe('Contributor Reputation Service', () => {
  let reputationService: ContributorReputationService;

  beforeEach(() => {
    reputationService = createReputationService();
  });

  it('should check for unlocked badges', async () => {
    const userReputation: UserReputation = {
      userId: 'test-user',
      progress: {
        'quest-001': 1,
        'quest-tts-001': 1,
      },
      currentBadges: [],
      reputation: 0,
    };

    const result = await reputationService.checkUnlockedBadges(userReputation);
    expect(result.newlyUnlocked.length).toBeGreaterThan(0);
    expect(result.newlyUnlocked).toContain(1); // First Steps
    expect(result.newlyUnlocked).toContain(2); // TTS Pioneer
  });

  it('should not return already owned badges as newly unlocked', async () => {
    const userReputation: UserReputation = {
      userId: 'test-user',
      progress: {
        'quest-001': 1,
        'quest-tts-001': 1,
      },
      currentBadges: [1], // Already has First Steps
      reputation: 0,
    };

    const result = await reputationService.checkUnlockedBadges(userReputation);
    expect(result.newlyUnlocked).not.toContain(1); // First Steps already owned
    expect(result.newlyUnlocked).toContain(2); // TTS Pioneer is new
  });

  it('should hydrate API response without minting', async () => {
    const userReputation: UserReputation = {
      userId: 'test-user',
      progress: {
        'quest-001': 1,
      },
      currentBadges: [1],
      reputation: 50,
    };

    const response = await reputationService.hydrateAPIResponse(userReputation, false);
    expect(response.badges.length).toBeGreaterThan(0);
    expect(response.newlyMinted.length).toBe(0); // No minting
    expect(response.totalReputation).toBeGreaterThanOrEqual(50);
    
    // Check badge status
    const firstSteps = response.badges.find((b) => b.id === 1);
    expect(firstSteps?.owned).toBe(true);
    expect(firstSteps?.unlocked).toBe(true);
  });

  it('should update user progress and detect new badges', async () => {
    const userReputation: UserReputation = {
      userId: 'test-user',
      progress: {
        'quest-001': 1,
      },
      currentBadges: [1],
      reputation: 10,
    };

    const progressUpdate = {
      'quest-tts-001': 1,
    };

    const updated = await reputationService.updateProgress(
      'test-user',
      progressUpdate,
      userReputation
    );

    expect(updated.progress['quest-tts-001']).toBe(1);
    expect(updated.currentBadges.length).toBeGreaterThan(userReputation.currentBadges.length);
    expect(updated.currentBadges).toContain(2); // TTS Pioneer unlocked
    expect(updated.reputation).toBeGreaterThan(userReputation.reputation); // Reputation boost
  });

  it('should calculate reputation correctly', async () => {
    const userReputation: UserReputation = {
      userId: 'test-user',
      progress: {
        'quest-001': 1,
        'quest-tts-001': 1,
      },
      currentBadges: [1, 2], // 2 badges = 20 reputation
      reputation: 50,
    };

    const response = await reputationService.hydrateAPIResponse(userReputation, false);
    expect(response.totalReputation).toBe(70); // 50 + (2 * 10)
  });
});

describe('Badge State Management', () => {
  it('should track owned, unlocked, and locked badges', () => {
    const userProgress = {
      'quest-001': 1,
      'quest-tts-001': 1,
    };
    const currentBadges = [1]; // Only owns First Steps

    const allBadgeIds = Array.from({ length: 10 }, (_, i) => i + 1);
    const unlocked = getUnlockedBadges(userProgress);
    
    const badges = allBadgeIds.map((id) => ({
      id,
      metadata: BADGE_CATALOG[id],
      owned: currentBadges.includes(id),
      unlocked: unlocked.includes(id),
    }));

    // First Steps: owned and unlocked
    expect(badges[0].owned).toBe(true);
    expect(badges[0].unlocked).toBe(true);

    // TTS Pioneer: unlocked but not owned
    expect(badges[1].owned).toBe(false);
    expect(badges[1].unlocked).toBe(true);

    // Code Contributor: locked (not unlocked)
    expect(badges[2].owned).toBe(false);
    expect(badges[2].unlocked).toBe(false);
  });
});
