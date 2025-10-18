/**
 * Contributor Badge Catalog
 * Defines all available badges, their metadata, and unlock conditions
 */

export interface BadgeMetadata {
  id: number;
  name: string;
  description: string;
  image: string;
  category: 'contributor' | 'achievement' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockCondition: {
    type: 'quest' | 'reputation' | 'contribution' | 'special';
    requirement: string;
    threshold?: number;
  };
}

/**
 * Badge Catalog - All available badges in the system
 */
export const BADGE_CATALOG: Record<number, BadgeMetadata> = {
  1: {
    id: 1,
    name: 'First Steps',
    description: 'Complete your first quest in MeeChain',
    image: '/assets/badges/first-steps.svg',
    category: 'achievement',
    rarity: 'common',
    unlockCondition: {
      type: 'quest',
      requirement: 'quest-001',
      threshold: 1,
    },
  },
  2: {
    id: 2,
    name: 'TTS Pioneer',
    description: 'Enable Text-to-Speech for the first time',
    image: '/assets/badges/tts-pioneer.svg',
    category: 'achievement',
    rarity: 'common',
    unlockCondition: {
      type: 'quest',
      requirement: 'quest-tts-001',
      threshold: 1,
    },
  },
  3: {
    id: 3,
    name: 'Code Contributor',
    description: 'Make your first code contribution',
    image: '/assets/badges/code-contributor.svg',
    category: 'contributor',
    rarity: 'rare',
    unlockCondition: {
      type: 'contribution',
      requirement: 'github-pr-merged',
      threshold: 1,
    },
  },
  4: {
    id: 4,
    name: 'Bug Hunter',
    description: 'Report and help fix a bug',
    image: '/assets/badges/bug-hunter.svg',
    category: 'contributor',
    rarity: 'rare',
    unlockCondition: {
      type: 'contribution',
      requirement: 'github-issue-closed',
      threshold: 1,
    },
  },
  5: {
    id: 5,
    name: 'Quest Master',
    description: 'Complete 10 quests',
    image: '/assets/badges/quest-master.svg',
    category: 'achievement',
    rarity: 'epic',
    unlockCondition: {
      type: 'quest',
      requirement: 'quests-completed',
      threshold: 10,
    },
  },
  6: {
    id: 6,
    name: 'Community Champion',
    description: 'Reach 100 reputation points',
    image: '/assets/badges/community-champion.svg',
    category: 'contributor',
    rarity: 'epic',
    unlockCondition: {
      type: 'reputation',
      requirement: 'reputation-points',
      threshold: 100,
    },
  },
  7: {
    id: 7,
    name: 'Early Adopter',
    description: 'Join MeeChain in its early days',
    image: '/assets/badges/early-adopter.svg',
    category: 'special',
    rarity: 'legendary',
    unlockCondition: {
      type: 'special',
      requirement: 'early-signup',
      threshold: 1,
    },
  },
  8: {
    id: 8,
    name: 'NFT Collector',
    description: 'Mint your first NFT on MeeChain',
    image: '/assets/badges/nft-collector.svg',
    category: 'achievement',
    rarity: 'rare',
    unlockCondition: {
      type: 'quest',
      requirement: 'nft-minted',
      threshold: 1,
    },
  },
  9: {
    id: 9,
    name: 'Team Player',
    description: 'Collaborate on a team project',
    image: '/assets/badges/team-player.svg',
    category: 'contributor',
    rarity: 'rare',
    unlockCondition: {
      type: 'contribution',
      requirement: 'team-contribution',
      threshold: 1,
    },
  },
  10: {
    id: 10,
    name: 'MeeChain Legend',
    description: 'Complete all achievements and reach maximum reputation',
    image: '/assets/badges/meechain-legend.svg',
    category: 'special',
    rarity: 'legendary',
    unlockCondition: {
      type: 'special',
      requirement: 'all-achievements',
      threshold: 1,
    },
  },
};

/**
 * Check if a badge is unlocked based on user progress
 * @param badgeId Badge ID to check
 * @param userProgress User's progress data
 * @returns True if badge is unlocked
 */
export function isBadgeUnlocked(
  badgeId: number,
  userProgress: Record<string, number>
): boolean {
  const badge = BADGE_CATALOG[badgeId];
  if (!badge) {
    return false;
  }

  const { requirement, threshold = 1 } = badge.unlockCondition;
  const progress = userProgress[requirement] || 0;

  return progress >= threshold;
}

/**
 * Get all unlocked badge IDs for a user
 * @param userProgress User's progress data
 * @returns Array of unlocked badge IDs
 */
export function getUnlockedBadges(
  userProgress: Record<string, number>
): number[] {
  return Object.keys(BADGE_CATALOG)
    .map(Number)
    .filter((badgeId) => isBadgeUnlocked(badgeId, userProgress));
}

/**
 * Get newly unlocked badges since last check
 * @param currentBadges Currently owned badge IDs
 * @param userProgress User's progress data
 * @returns Array of newly unlocked badge IDs
 */
export function getNewlyUnlockedBadges(
  currentBadges: number[],
  userProgress: Record<string, number>
): number[] {
  const allUnlocked = getUnlockedBadges(userProgress);
  return allUnlocked.filter((badgeId) => !currentBadges.includes(badgeId));
}

/**
 * Get badge metadata by ID
 * @param badgeId Badge ID
 * @returns Badge metadata or undefined
 */
export function getBadgeMetadata(badgeId: number): BadgeMetadata | undefined {
  return BADGE_CATALOG[badgeId];
}

/**
 * Get all badges by category
 * @param category Badge category
 * @returns Array of badge metadata
 */
export function getBadgesByCategory(
  category: 'contributor' | 'achievement' | 'special'
): BadgeMetadata[] {
  return Object.values(BADGE_CATALOG).filter((badge) => badge.category === category);
}

/**
 * Get all badges by rarity
 * @param rarity Badge rarity
 * @returns Array of badge metadata
 */
export function getBadgesByRarity(
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
): BadgeMetadata[] {
  return Object.values(BADGE_CATALOG).filter((badge) => badge.rarity === rarity);
}
