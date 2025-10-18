/**
 * Contributor Reputation Service
 * Detects unlocked badges, triggers minting, and hydrates API responses
 */

import { logEvent } from '../utils/logger.js';
import { 
  getNewlyUnlockedBadges, 
  getBadgeMetadata,
  type BadgeMetadata 
} from '../config/contributor-badges.js';
import { 
  BadgeSBTService,
  type BadgeMintResult,
  type BadgeState 
} from './badge-sbt-service.js';

export interface UserReputation {
  userId: string;
  walletAddress?: string;
  progress: Record<string, number>;
  currentBadges: number[];
  reputation: number;
}

export interface BadgeUnlockResult {
  newlyUnlocked: number[];
  alreadyOwned: number[];
  mintResults?: BadgeMintResult[];
}

export interface HydratedBadgeResponse {
  badges: Array<{
    id: number;
    metadata: BadgeMetadata;
    owned: boolean;
    unlocked: boolean;
  }>;
  newlyMinted: number[];
  totalReputation: number;
}

/**
 * Contributor Reputation Service Class
 */
export class ContributorReputationService {
  private badgeSBTService?: BadgeSBTService;

  constructor(badgeSBTService?: BadgeSBTService) {
    this.badgeSBTService = badgeSBTService;
  }

  /**
   * Check for newly unlocked badges based on user progress
   * @param userReputation User reputation data
   * @returns Badge unlock result
   */
  async checkUnlockedBadges(
    userReputation: UserReputation
  ): Promise<BadgeUnlockResult> {
    try {
      logEvent('reputation-check-start', {
        userId: userReputation.userId,
        currentBadges: userReputation.currentBadges.length,
      }, 'debug');

      // Get newly unlocked badges
      const newlyUnlocked = getNewlyUnlockedBadges(
        userReputation.currentBadges,
        userReputation.progress
      );

      logEvent('reputation-check-complete', {
        userId: userReputation.userId,
        newlyUnlocked: newlyUnlocked.length,
        badges: newlyUnlocked,
      });

      return {
        newlyUnlocked,
        alreadyOwned: userReputation.currentBadges,
      };
    } catch (error) {
      logEvent('reputation-check-error', {
        userId: userReputation.userId,
        error: String(error),
      }, 'error');

      return {
        newlyUnlocked: [],
        alreadyOwned: userReputation.currentBadges,
      };
    }
  }

  /**
   * Trigger minting for newly unlocked badges
   * @param walletAddress User's wallet address
   * @param badgeIds Badge IDs to mint
   * @returns Mint result
   */
  async triggerBadgeMinting(
    walletAddress: string,
    badgeIds: number[]
  ): Promise<BadgeMintResult> {
    try {
      if (!this.badgeSBTService) {
        throw new Error('Badge SBT service not configured');
      }

      if (badgeIds.length === 0) {
        return {
          success: true,
          badgeIds: [],
        };
      }

      logEvent('reputation-mint-trigger', {
        walletAddress,
        badgeIds,
      }, 'debug');

      // Use batch minting for efficiency
      const result = await this.badgeSBTService.batchMintBadges(
        walletAddress,
        badgeIds
      );

      logEvent('reputation-mint-complete', {
        walletAddress,
        success: result.success,
        mintedCount: result.badgeIds.length,
        txHash: result.txHash,
      });

      return result;
    } catch (error) {
      logEvent('reputation-mint-error', {
        walletAddress,
        badgeIds,
        error: String(error),
      }, 'error');

      return {
        success: false,
        badgeIds: [],
        error: String(error),
      };
    }
  }

  /**
   * Get badge state from blockchain
   * @param walletAddress User's wallet address
   * @returns Badge state
   */
  async getBadgeStateFromChain(
    walletAddress: string
  ): Promise<BadgeState | null> {
    try {
      if (!this.badgeSBTService) {
        throw new Error('Badge SBT service not configured');
      }

      return await this.badgeSBTService.getBadgeState(walletAddress);
    } catch (error) {
      logEvent('reputation-get-state-error', {
        walletAddress,
        error: String(error),
      }, 'error');

      return null;
    }
  }

  /**
   * Hydrate API response with badge information
   * @param userReputation User reputation data
   * @param includeMinting Whether to trigger minting for new badges
   * @returns Hydrated badge response
   */
  async hydrateAPIResponse(
    userReputation: UserReputation,
    includeMinting: boolean = false
  ): Promise<HydratedBadgeResponse> {
    try {
      logEvent('reputation-hydrate-start', {
        userId: userReputation.userId,
        includeMinting,
      }, 'debug');

      // Check for unlocked badges
      const unlockResult = await this.checkUnlockedBadges(userReputation);

      let newlyMinted: number[] = [];
      let onChainBadges: BadgeState | null = null;

      // If minting is enabled and user has wallet, mint new badges
      if (includeMinting && userReputation.walletAddress && unlockResult.newlyUnlocked.length > 0) {
        const mintResult = await this.triggerBadgeMinting(
          userReputation.walletAddress,
          unlockResult.newlyUnlocked
        );

        if (mintResult.success) {
          newlyMinted = mintResult.badgeIds;
        }

        // Get updated on-chain state
        onChainBadges = await this.getBadgeStateFromChain(userReputation.walletAddress);
      } else if (userReputation.walletAddress) {
        // Just get current on-chain state
        onChainBadges = await this.getBadgeStateFromChain(userReputation.walletAddress);
      }

      // Determine owned badges (either from chain or local state)
      const ownedBadges = onChainBadges 
        ? onChainBadges.badgeTypes 
        : [...userReputation.currentBadges, ...newlyMinted];

      // Get all possible badge IDs (1-10 from catalog)
      const allBadgeIds = Array.from({ length: 10 }, (_, i) => i + 1);

      // Hydrate badge information
      const badges = allBadgeIds.map((badgeId) => {
        const metadata = getBadgeMetadata(badgeId);
        const owned = ownedBadges.includes(badgeId);
        const unlocked = [...unlockResult.alreadyOwned, ...unlockResult.newlyUnlocked].includes(badgeId);

        return {
          id: badgeId,
          metadata: metadata!,
          owned,
          unlocked,
        };
      });

      // Calculate total reputation (10 points per badge)
      const totalReputation = ownedBadges.length * 10 + userReputation.reputation;

      logEvent('reputation-hydrate-complete', {
        userId: userReputation.userId,
        totalBadges: badges.length,
        ownedBadges: ownedBadges.length,
        newlyMinted: newlyMinted.length,
        totalReputation,
      });

      return {
        badges,
        newlyMinted,
        totalReputation,
      };
    } catch (error) {
      logEvent('reputation-hydrate-error', {
        userId: userReputation.userId,
        error: String(error),
      }, 'error');

      // Return minimal response on error
      return {
        badges: [],
        newlyMinted: [],
        totalReputation: userReputation.reputation,
      };
    }
  }

  /**
   * Update user progress and check for new badges
   * @param userId User ID
   * @param progressUpdate Progress updates
   * @param currentReputation Current user reputation
   * @returns Updated reputation with newly unlocked badges
   */
  async updateProgress(
    userId: string,
    progressUpdate: Record<string, number>,
    currentReputation: UserReputation
  ): Promise<UserReputation> {
    try {
      logEvent('reputation-progress-update', {
        userId,
        updates: progressUpdate,
      }, 'debug');

      // Merge progress updates
      const updatedProgress = {
        ...currentReputation.progress,
        ...progressUpdate,
      };

      // Check for newly unlocked badges
      const unlockResult = await this.checkUnlockedBadges({
        ...currentReputation,
        progress: updatedProgress,
      });

      // Add newly unlocked badges to current badges
      const updatedBadges = [
        ...currentReputation.currentBadges,
        ...unlockResult.newlyUnlocked,
      ];

      // Calculate reputation boost from new badges
      const reputationBoost = unlockResult.newlyUnlocked.length * 10;

      return {
        ...currentReputation,
        progress: updatedProgress,
        currentBadges: updatedBadges,
        reputation: currentReputation.reputation + reputationBoost,
      };
    } catch (error) {
      logEvent('reputation-progress-error', {
        userId,
        error: String(error),
      }, 'error');

      return currentReputation;
    }
  }
}

/**
 * Create a Contributor Reputation Service instance
 * @param badgeSBTService Optional badge SBT service for minting
 * @returns ContributorReputationService instance
 */
export function createReputationService(
  badgeSBTService?: BadgeSBTService
): ContributorReputationService {
  return new ContributorReputationService(badgeSBTService);
}
