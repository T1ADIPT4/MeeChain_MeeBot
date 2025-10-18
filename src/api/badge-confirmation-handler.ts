/**
 * Badge Confirmation API Handler
 * Handles /logs/flag/confirm endpoint for badge state confirmation
 */

import { logEvent } from '../utils/logger.js';
import { 
  ContributorReputationService,
  createReputationService,
  type UserReputation,
  type HydratedBadgeResponse
} from '../services/contributor-reputation-service.js';
import { 
  BadgeSBTService,
  createBadgeSBTService 
} from '../services/badge-sbt-service.js';

export interface BadgeConfirmationRequest {
  userId: string;
  walletAddress?: string;
  progress?: Record<string, number>;
  currentBadges?: number[];
  reputation?: number;
  triggerMinting?: boolean;
}

export interface BadgeConfirmationResponse {
  success: boolean;
  userId: string;
  badges: HydratedBadgeResponse['badges'];
  newlyMintedBadges: number[];
  totalReputation: number;
  mintResult?: {
    txHash?: string;
    error?: string;
  };
  timestamp: string;
}

/**
 * Badge Confirmation Handler
 */
export class BadgeConfirmationHandler {
  private reputationService: ContributorReputationService;
  private badgeSBTService?: BadgeSBTService;

  constructor(
    rpcUrl?: string,
    contractAddress?: string,
    privateKey?: string
  ) {
    // Initialize badge SBT service if config provided
    if (rpcUrl && contractAddress) {
      this.badgeSBTService = createBadgeSBTService({
        rpcUrl,
        contractAddress,
        privateKey,
      });
    }

    // Initialize reputation service
    this.reputationService = createReputationService(this.badgeSBTService);
  }

  /**
   * Handle badge confirmation request
   * @param request Badge confirmation request
   * @returns Badge confirmation response
   */
  async handleConfirmation(
    request: BadgeConfirmationRequest
  ): Promise<BadgeConfirmationResponse> {
    try {
      logEvent('badge-confirmation-start', {
        userId: request.userId,
        walletAddress: request.walletAddress,
        triggerMinting: request.triggerMinting,
      }, 'debug');

      // Build user reputation object
      const userReputation: UserReputation = {
        userId: request.userId,
        walletAddress: request.walletAddress,
        progress: request.progress || {},
        currentBadges: request.currentBadges || [],
        reputation: request.reputation || 0,
      };

      // Hydrate API response with badge information
      const hydratedResponse = await this.reputationService.hydrateAPIResponse(
        userReputation,
        request.triggerMinting || false
      );

      // Build response
      const response: BadgeConfirmationResponse = {
        success: true,
        userId: request.userId,
        badges: hydratedResponse.badges,
        newlyMintedBadges: hydratedResponse.newlyMinted,
        totalReputation: hydratedResponse.totalReputation,
        timestamp: new Date().toISOString(),
      };

      logEvent('badge-confirmation-success', {
        userId: request.userId,
        newlyMintedCount: hydratedResponse.newlyMinted.length,
        totalBadges: hydratedResponse.badges.filter(b => b.owned).length,
      });

      return response;
    } catch (error) {
      logEvent('badge-confirmation-error', {
        userId: request.userId,
        error: String(error),
      }, 'error');

      return {
        success: false,
        userId: request.userId,
        badges: [],
        newlyMintedBadges: [],
        totalReputation: request.reputation || 0,
        mintResult: {
          error: String(error),
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get badge state for a user (without minting)
   * @param userId User ID
   * @param walletAddress Optional wallet address
   * @returns Badge state
   */
  async getBadgeState(
    userId: string,
    walletAddress?: string
  ): Promise<BadgeConfirmationResponse> {
    return this.handleConfirmation({
      userId,
      walletAddress,
      triggerMinting: false,
    });
  }

  /**
   * Trigger badge minting for newly unlocked badges
   * @param request Badge confirmation request
   * @returns Badge confirmation response with mint results
   */
  async triggerMinting(
    request: BadgeConfirmationRequest
  ): Promise<BadgeConfirmationResponse> {
    return this.handleConfirmation({
      ...request,
      triggerMinting: true,
    });
  }
}

/**
 * Create a badge confirmation handler instance
 * @param config Configuration object
 * @returns BadgeConfirmationHandler instance
 */
export function createBadgeConfirmationHandler(config?: {
  rpcUrl?: string;
  contractAddress?: string;
  privateKey?: string;
}): BadgeConfirmationHandler {
  return new BadgeConfirmationHandler(
    config?.rpcUrl,
    config?.contractAddress,
    config?.privateKey
  );
}

/**
 * Express/HTTP handler example
 */
export async function handleBadgeConfirmationEndpoint(
  req: any,
  res: any,
  handler: BadgeConfirmationHandler
): Promise<void> {
  try {
    const request: BadgeConfirmationRequest = req.body;

    // Validate request
    if (!request.userId) {
      res.status(400).json({
        success: false,
        error: 'userId is required',
      });
      return;
    }

    // Handle confirmation
    const response = await handler.handleConfirmation(request);

    // Send response
    res.status(200).json(response);
  } catch (error) {
    logEvent('badge-confirmation-endpoint-error', {
      error: String(error),
    }, 'error');

    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
