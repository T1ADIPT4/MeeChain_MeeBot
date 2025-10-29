/**
 * Badge System Tests
 * Test badge catalog, metadata, and mock blockchain service integration
 */

import { 
  BADGE_CATALOG, 
  getBadgeById, 
  getAllBadges, 
  getBadgesByCategory,
  getBadgesByRarity,
  BadgeMetadata 
} from '../src/config/badgeCatalog';

describe('Badge Catalog', () => {
  describe('BADGE_CATALOG', () => {
    it('should have valid badge definitions', () => {
      const badges = Object.values(BADGE_CATALOG);
      expect(badges.length).toBeGreaterThan(0);
      
      badges.forEach(badge => {
        expect(badge).toHaveProperty('id');
        expect(badge).toHaveProperty('name');
        expect(badge).toHaveProperty('description');
        expect(badge).toHaveProperty('imageURI');
        expect(badge).toHaveProperty('category');
        expect(badge).toHaveProperty('rarity');
        
        // Validate types
        expect(typeof badge.id).toBe('number');
        expect(typeof badge.name).toBe('string');
        expect(typeof badge.description).toBe('string');
        expect(typeof badge.imageURI).toBe('string');
        expect(['achievement', 'milestone', 'special', 'quest']).toContain(badge.category);
        expect(['common', 'rare', 'epic', 'legendary']).toContain(badge.rarity);
      });
    });

    it('should have unique badge IDs', () => {
      const badges = Object.values(BADGE_CATALOG);
      const ids = badges.map(badge => badge.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have non-empty names and descriptions', () => {
      const badges = Object.values(BADGE_CATALOG);
      badges.forEach(badge => {
        expect(badge.name.length).toBeGreaterThan(0);
        expect(badge.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getBadgeById', () => {
    it('should return correct badge for valid ID', () => {
      const badge = getBadgeById(1);
      expect(badge).toBeDefined();
      expect(badge?.id).toBe(1);
      expect(badge?.name).toBe('Pioneer');
    });

    it('should return undefined for invalid ID', () => {
      const badge = getBadgeById(9999);
      expect(badge).toBeUndefined();
    });
  });

  describe('getAllBadges', () => {
    it('should return all badges', () => {
      const allBadges = getAllBadges();
      const catalogSize = Object.keys(BADGE_CATALOG).length;
      expect(allBadges).toHaveLength(catalogSize);
    });

    it('should return array of BadgeMetadata', () => {
      const allBadges = getAllBadges();
      allBadges.forEach(badge => {
        expect(badge).toHaveProperty('id');
        expect(badge).toHaveProperty('name');
        expect(badge).toHaveProperty('category');
        expect(badge).toHaveProperty('rarity');
      });
    });
  });

  describe('getBadgesByCategory', () => {
    it('should return badges for achievement category', () => {
      const achievementBadges = getBadgesByCategory('achievement');
      expect(achievementBadges.length).toBeGreaterThan(0);
      achievementBadges.forEach(badge => {
        expect(badge.category).toBe('achievement');
      });
    });

    it('should return badges for milestone category', () => {
      const milestoneBadges = getBadgesByCategory('milestone');
      expect(milestoneBadges.length).toBeGreaterThan(0);
      milestoneBadges.forEach(badge => {
        expect(badge.category).toBe('milestone');
      });
    });

    it('should return badges for quest category', () => {
      const questBadges = getBadgesByCategory('quest');
      expect(questBadges.length).toBeGreaterThan(0);
      questBadges.forEach(badge => {
        expect(badge.category).toBe('quest');
      });
    });

    it('should return badges for special category', () => {
      const specialBadges = getBadgesByCategory('special');
      expect(specialBadges.length).toBeGreaterThan(0);
      specialBadges.forEach(badge => {
        expect(badge.category).toBe('special');
      });
    });
  });

  describe('getBadgesByRarity', () => {
    it('should return badges for common rarity', () => {
      const commonBadges = getBadgesByRarity('common');
      expect(commonBadges.length).toBeGreaterThan(0);
      commonBadges.forEach(badge => {
        expect(badge.rarity).toBe('common');
      });
    });

    it('should return badges for rare rarity', () => {
      const rareBadges = getBadgesByRarity('rare');
      expect(rareBadges.length).toBeGreaterThan(0);
      rareBadges.forEach(badge => {
        expect(badge.rarity).toBe('rare');
      });
    });

    it('should return badges for epic rarity', () => {
      const epicBadges = getBadgesByRarity('epic');
      expect(epicBadges.length).toBeGreaterThan(0);
      epicBadges.forEach(badge => {
        expect(badge.rarity).toBe('epic');
      });
    });

    it('should return badges for legendary rarity', () => {
      const legendaryBadges = getBadgesByRarity('legendary');
      expect(legendaryBadges.length).toBeGreaterThan(0);
      legendaryBadges.forEach(badge => {
        expect(badge.rarity).toBe('legendary');
      });
    });
  });

  describe('Badge Distribution', () => {
    it('should have a good distribution of categories', () => {
      const allBadges = getAllBadges();
      const categories = allBadges.map(b => b.category);
      const uniqueCategories = new Set(categories);
      
      // Should have at least 3 different categories
      expect(uniqueCategories.size).toBeGreaterThanOrEqual(3);
    });

    it('should have a good distribution of rarities', () => {
      const allBadges = getAllBadges();
      const rarities = allBadges.map(b => b.rarity);
      const uniqueRarities = new Set(rarities);
      
      // Should have at least 3 different rarities
      expect(uniqueRarities.size).toBeGreaterThanOrEqual(3);
    });

    it('should have more common badges than legendary', () => {
      const commonBadges = getBadgesByRarity('common');
      const legendaryBadges = getBadgesByRarity('legendary');
      
      // Common badges should be more than legendary
      expect(commonBadges.length).toBeGreaterThanOrEqual(legendaryBadges.length);
    });
  });

  describe('Badge Content Quality', () => {
    it('should have descriptive names', () => {
      const allBadges = getAllBadges();
      allBadges.forEach(badge => {
        expect(badge.name.length).toBeGreaterThanOrEqual(3);
        expect(badge.name).not.toMatch(/^\s+|\s+$/); // No leading/trailing whitespace
      });
    });

    it('should have detailed descriptions', () => {
      const allBadges = getAllBadges();
      allBadges.forEach(badge => {
        expect(badge.description.length).toBeGreaterThanOrEqual(10);
        expect(badge.description).not.toMatch(/^\s+|\s+$/); // No leading/trailing whitespace
      });
    });

    it('should have valid image URIs', () => {
      const allBadges = getAllBadges();
      allBadges.forEach(badge => {
        expect(badge.imageURI).toMatch(/^(ipfs:\/\/|https?:\/\/)/);
      });
    });
  });
});

describe('Badge System Integration', () => {
  describe('Blockchain Service Mock', () => {
    it('should have fetchOwnedBadges function', async () => {
      const { fetchOwnedBadges } = await import('../viewer/services/blockchainService');
      expect(typeof fetchOwnedBadges).toBe('function');
    });

    it('should have mintBadge function', async () => {
      const { mintBadge } = await import('../viewer/services/blockchainService');
      expect(typeof mintBadge).toBe('function');
    });

    it('fetchOwnedBadges should return array of numbers', async () => {
      const { fetchOwnedBadges } = await import('../viewer/services/blockchainService');
      const mockAddress = '0x1234567890abcdef';
      const badges = await fetchOwnedBadges(mockAddress);
      
      expect(Array.isArray(badges)).toBe(true);
      badges.forEach(badgeId => {
        expect(typeof badgeId).toBe('number');
      });
    });

    it('mintBadge should return success status and badge ID', async () => {
      const { mintBadge } = await import('../viewer/services/blockchainService');
      const mockAddress = '0x1234567890abcdef';
      const mockQuestId = 'quest-1';
      
      const result = await mintBadge(mockAddress, mockQuestId);
      
      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
      
      if (result.success) {
        expect(result).toHaveProperty('badgeId');
        expect(typeof result.badgeId).toBe('number');
      }
    });
  });
});
