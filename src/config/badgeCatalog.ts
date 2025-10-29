/**
 * Badge Catalog
 * Define all available badge types in the MeeChain ecosystem
 */

export interface BadgeMetadata {
  id: number;
  name: string;
  description: string;
  imageURI: string;
  category: 'achievement' | 'milestone' | 'special' | 'quest';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

/**
 * Badge catalog containing all badge definitions
 */
export const BADGE_CATALOG: Record<number, BadgeMetadata> = {
  1: {
    id: 1,
    name: "Pioneer",
    description: "First steps in MeeChain - Complete your first quest",
    imageURI: "ipfs://QmPioneerBadge",
    category: 'achievement',
    rarity: 'common'
  },
  2: {
    id: 2,
    name: "Quest Master",
    description: "Complete 10 quests successfully",
    imageURI: "ipfs://QmQuestMasterBadge",
    category: 'milestone',
    rarity: 'rare'
  },
  3: {
    id: 3,
    name: "Early Adopter",
    description: "Join MeeChain in the early days",
    imageURI: "ipfs://QmEarlyAdopterBadge",
    category: 'special',
    rarity: 'epic'
  },
  4: {
    id: 4,
    name: "Community Champion",
    description: "Active contributor to the MeeChain community",
    imageURI: "ipfs://QmCommunityChampionBadge",
    category: 'achievement',
    rarity: 'rare'
  },
  5: {
    id: 5,
    name: "Flow Master",
    description: "Create and publish your first workflow",
    imageURI: "ipfs://QmFlowMasterBadge",
    category: 'quest',
    rarity: 'common'
  },
  6: {
    id: 6,
    name: "Token Holder",
    description: "Hold MEE tokens in your wallet",
    imageURI: "ipfs://QmTokenHolderBadge",
    category: 'milestone',
    rarity: 'common'
  },
  7: {
    id: 7,
    name: "Supply Hero",
    description: "Complete a supply verification successfully",
    imageURI: "ipfs://QmSupplyHeroBadge",
    category: 'quest',
    rarity: 'rare'
  },
  8: {
    id: 8,
    name: "Badge Collector",
    description: "Collect 5 different badges",
    imageURI: "ipfs://QmBadgeCollectorBadge",
    category: 'milestone',
    rarity: 'epic'
  },
  9: {
    id: 9,
    name: "Legendary Contributor",
    description: "Make exceptional contributions to MeeChain",
    imageURI: "ipfs://QmLegendaryContributorBadge",
    category: 'special',
    rarity: 'legendary'
  },
  10: {
    id: 10,
    name: "Daily Streak",
    description: "Complete daily quests for 7 consecutive days",
    imageURI: "ipfs://QmDailyStreakBadge",
    category: 'achievement',
    rarity: 'rare'
  }
};

/**
 * Get badge metadata by ID
 * @param badgeId Badge ID
 * @returns Badge metadata or undefined if not found
 */
export function getBadgeById(badgeId: number): BadgeMetadata | undefined {
  return BADGE_CATALOG[badgeId];
}

/**
 * Get all badges
 * @returns Array of all badge metadata
 */
export function getAllBadges(): BadgeMetadata[] {
  return Object.values(BADGE_CATALOG);
}

/**
 * Get badges by category
 * @param category Badge category
 * @returns Array of badges in the category
 */
export function getBadgesByCategory(category: BadgeMetadata['category']): BadgeMetadata[] {
  return Object.values(BADGE_CATALOG).filter(badge => badge.category === category);
}

/**
 * Get badges by rarity
 * @param rarity Badge rarity
 * @returns Array of badges with the specified rarity
 */
export function getBadgesByRarity(rarity: BadgeMetadata['rarity']): BadgeMetadata[] {
  return Object.values(BADGE_CATALOG).filter(badge => badge.rarity === rarity);
}
