/**
 * Badge Minting Service
 * Integrates with MeeChainSupply to mint badges on successful replay/supply
 */

import { logEvent } from '../utils/logger.js';
import { mintBadge, fallbackMintBadge } from '../minting/badgeMinter.js';
import type { SupportedNetwork } from '../config/registryTypes.js';

export interface BadgeMintConfig {
  enabled: boolean;
  network?: SupportedNetwork;
  fallbackNetwork?: SupportedNetwork;
  badgeTypes: {
    replay: string;
    supply: string;
    firstSupply: string;
  };
}

export interface BadgeMintResult {
  success: boolean;
  badgeId?: string;
  txHash?: string;
  error?: string;
}

export class BadgeMintingService {
  private config: BadgeMintConfig;
  private firstSupplyUsers: Set<string>;

  /**
   * Constructor
   * @param config - Badge minting configuration
   */
  constructor(config: BadgeMintConfig) {
    this.config = config;
    this.firstSupplyUsers = new Set();

    logEvent('badge-minting-service-init', {
      enabled: config.enabled,
      network: config.network,
      badgeTypes: config.badgeTypes
    }, 'info');
  }

  /**
   * Mint badge for replay confirmation
   * @param userId - User ID
   * @param amount - Amount supplied
   * @returns Badge mint result
   */
  async mintReplayBadge(
    userId: string,
    amount: string
  ): Promise<BadgeMintResult> {
    if (!this.config.enabled) {
      return { success: false, error: 'Badge minting disabled' };
    }

    try {
      logEvent('badge-mint-replay-start', {
        userId,
        amount,
        badgeType: this.config.badgeTypes.replay
      }, 'info');

      const transaction = await mintBadge(
        userId,
        this.config.badgeTypes.replay,
        this.config.network
      );

      logEvent('badge-mint-replay-success', {
        userId,
        badgeId: transaction.badgeId,
        txHash: transaction.txHash
      }, 'info');

      return {
        success: true,
        badgeId: transaction.badgeId,
        txHash: transaction.txHash
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      logEvent('badge-mint-replay-error', {
        userId,
        error: errorMessage
      }, 'error');

      // Try fallback
      return this.fallbackMintReplayBadge(userId, amount);
    }
  }

  /**
   * Fallback mint badge for replay confirmation
   * @param userId - User ID
   * @param amount - Amount supplied
   * @returns Badge mint result
   */
  private async fallbackMintReplayBadge(
    userId: string,
    amount: string
  ): Promise<BadgeMintResult> {
    try {
      logEvent('badge-mint-replay-fallback-start', {
        userId,
        amount
      }, 'warn');

      const transaction = await fallbackMintBadge(
        userId,
        this.config.badgeTypes.replay,
        this.config.fallbackNetwork
      );

      logEvent('badge-mint-replay-fallback-success', {
        userId,
        badgeId: transaction.badgeId,
        txHash: transaction.txHash
      }, 'info');

      return {
        success: true,
        badgeId: transaction.badgeId,
        txHash: transaction.txHash
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      logEvent('badge-mint-replay-fallback-error', {
        userId,
        error: errorMessage
      }, 'error');

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Mint badge for successful supply
   * @param userId - User ID
   * @param amount - Amount supplied
   * @returns Badge mint result
   */
  async mintSupplyBadge(
    userId: string,
    amount: string
  ): Promise<BadgeMintResult> {
    if (!this.config.enabled) {
      return { success: false, error: 'Badge minting disabled' };
    }

    try {
      // Check if this is the first supply for this user
      const isFirstSupply = !this.firstSupplyUsers.has(userId);
      const badgeType = isFirstSupply
        ? this.config.badgeTypes.firstSupply
        : this.config.badgeTypes.supply;

      logEvent('badge-mint-supply-start', {
        userId,
        amount,
        badgeType,
        isFirstSupply
      }, 'info');

      const transaction = await mintBadge(
        userId,
        badgeType,
        this.config.network
      );

      // Mark user as having received first supply badge
      if (isFirstSupply) {
        this.firstSupplyUsers.add(userId);
      }

      logEvent('badge-mint-supply-success', {
        userId,
        badgeId: transaction.badgeId,
        txHash: transaction.txHash,
        isFirstSupply
      }, 'info');

      return {
        success: true,
        badgeId: transaction.badgeId,
        txHash: transaction.txHash
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      logEvent('badge-mint-supply-error', {
        userId,
        error: errorMessage
      }, 'error');

      // Try fallback
      return this.fallbackMintSupplyBadge(userId, amount);
    }
  }

  /**
   * Fallback mint badge for successful supply
   * @param userId - User ID
   * @param amount - Amount supplied
   * @returns Badge mint result
   */
  private async fallbackMintSupplyBadge(
    userId: string,
    amount: string
  ): Promise<BadgeMintResult> {
    try {
      const isFirstSupply = !this.firstSupplyUsers.has(userId);
      const badgeType = isFirstSupply
        ? this.config.badgeTypes.firstSupply
        : this.config.badgeTypes.supply;

      logEvent('badge-mint-supply-fallback-start', {
        userId,
        amount,
        badgeType
      }, 'warn');

      const transaction = await fallbackMintBadge(
        userId,
        badgeType,
        this.config.fallbackNetwork
      );

      // Mark user as having received first supply badge
      if (isFirstSupply) {
        this.firstSupplyUsers.add(userId);
      }

      logEvent('badge-mint-supply-fallback-success', {
        userId,
        badgeId: transaction.badgeId,
        txHash: transaction.txHash
      }, 'info');

      return {
        success: true,
        badgeId: transaction.badgeId,
        txHash: transaction.txHash
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      logEvent('badge-mint-supply-fallback-error', {
        userId,
        error: errorMessage
      }, 'error');

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Generate dynamic badge metadata
   * @param userId - User ID
   * @param badgeType - Badge type
   * @param metadata - Additional metadata
   * @returns Badge metadata object
   */
  generateBadgeMetadata(
    userId: string,
    badgeType: string,
    metadata?: Record<string, any>
  ): Record<string, any> {
    const baseMetadata = {
      name: `${badgeType} Badge`,
      description: `Awarded for ${badgeType} achievement`,
      userId,
      timestamp: Date.now(),
      ...metadata
    };

    // Add special attributes for first supply
    if (badgeType === this.config.badgeTypes.firstSupply) {
      baseMetadata.description = 'Awarded to pioneers who completed their first supply';
      baseMetadata.rarity = 'rare';
    }

    logEvent('badge-metadata-generated', {
      userId,
      badgeType,
      metadata: baseMetadata
    }, 'debug');

    return baseMetadata;
  }

  /**
   * Check if user has received first supply badge
   * @param userId - User ID
   * @returns True if user has first supply badge
   */
  hasFirstSupplyBadge(userId: string): boolean {
    return this.firstSupplyUsers.has(userId);
  }

  /**
   * Enable or disable badge minting
   * @param enabled - Enable flag
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    logEvent('badge-minting-enabled-changed', { enabled }, 'info');
  }

  /**
   * Get configuration
   * @returns Current configuration
   */
  getConfig(): BadgeMintConfig {
    return { ...this.config };
  }
}
