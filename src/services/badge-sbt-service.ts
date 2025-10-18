/**
 * Badge SBT Service
 * Handles minting and querying of Soulbound Token badges
 */

import { ethers } from 'ethers';
import { logEvent } from '../utils/logger.js';

// ABI for MeeChainBadgeSBT contract (minimal interface)
const BADGE_SBT_ABI = [
  'function mintBadge(address to, uint256 badgeType) external',
  'function batchMintBadges(address to, uint256[] calldata badgeTypes) external',
  'function getBadgesOf(address user) external view returns (uint256[])',
  'function getBadgeType(uint256 tokenId) external view returns (uint256)',
  'function hasBadgeType(address user, uint256 badgeType) external view returns (bool)',
  'function tokenURI(uint256 tokenId) external view returns (string)',
  'event BadgeMinted(address indexed to, uint256 indexed tokenId, uint256 indexed badgeType)',
];

export interface BadgeMintResult {
  success: boolean;
  txHash?: string;
  badgeIds: number[];
  error?: string;
}

export interface BadgeState {
  tokenIds: number[];
  badgeTypes: number[];
  metadataURIs: string[];
}

/**
 * Badge SBT Service Class
 */
export class BadgeSBTService {
  private provider: ethers.Provider;
  private contract: ethers.Contract;
  private signer?: ethers.Signer;

  constructor(
    rpcUrl: string,
    contractAddress: string,
    privateKey?: string
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    
    if (privateKey) {
      this.signer = new ethers.Wallet(privateKey, this.provider);
      this.contract = new ethers.Contract(contractAddress, BADGE_SBT_ABI, this.signer);
    } else {
      this.contract = new ethers.Contract(contractAddress, BADGE_SBT_ABI, this.provider);
    }
  }

  /**
   * Mint a single badge to an address
   * @param toAddress Address to mint badge to
   * @param badgeType Type of badge to mint
   * @returns Mint result with transaction hash
   */
  async mintBadge(
    toAddress: string,
    badgeType: number
  ): Promise<BadgeMintResult> {
    try {
      if (!this.signer) {
        throw new Error('No signer configured for minting');
      }

      logEvent('badge-sbt-mint-start', {
        toAddress,
        badgeType,
      }, 'debug');

      // Check if user already has this badge type
      const hasBadge = await this.contract.hasBadgeType(toAddress, badgeType);
      if (hasBadge) {
        logEvent('badge-sbt-already-owned', {
          toAddress,
          badgeType,
        }, 'debug');

        return {
          success: false,
          badgeIds: [],
          error: 'User already owns this badge type',
        };
      }

      // Mint the badge
      const tx = await this.contract.mintBadge(toAddress, badgeType);
      const receipt = await tx.wait();

      logEvent('badge-sbt-mint-success', {
        toAddress,
        badgeType,
        txHash: receipt.hash,
      });

      return {
        success: true,
        txHash: receipt.hash,
        badgeIds: [badgeType],
      };
    } catch (error) {
      logEvent('badge-sbt-mint-error', {
        toAddress,
        badgeType,
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
   * Mint multiple badges to an address in a single transaction
   * @param toAddress Address to mint badges to
   * @param badgeTypes Array of badge types to mint
   * @returns Mint result with transaction hash
   */
  async batchMintBadges(
    toAddress: string,
    badgeTypes: number[]
  ): Promise<BadgeMintResult> {
    try {
      if (!this.signer) {
        throw new Error('No signer configured for minting');
      }

      logEvent('badge-sbt-batch-mint-start', {
        toAddress,
        badgeTypes,
      }, 'debug');

      // Filter out badges the user already has
      const badgesToMint: number[] = [];
      for (const badgeType of badgeTypes) {
        const hasBadge = await this.contract.hasBadgeType(toAddress, badgeType);
        if (!hasBadge) {
          badgesToMint.push(badgeType);
        }
      }

      if (badgesToMint.length === 0) {
        logEvent('badge-sbt-no-new-badges', {
          toAddress,
          badgeTypes,
        }, 'debug');

        return {
          success: true,
          badgeIds: [],
        };
      }

      // Batch mint the badges
      const tx = await this.contract.batchMintBadges(toAddress, badgesToMint);
      const receipt = await tx.wait();

      logEvent('badge-sbt-batch-mint-success', {
        toAddress,
        badgeTypes: badgesToMint,
        txHash: receipt.hash,
      });

      return {
        success: true,
        txHash: receipt.hash,
        badgeIds: badgesToMint,
      };
    } catch (error) {
      logEvent('badge-sbt-batch-mint-error', {
        toAddress,
        badgeTypes,
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
   * Get all badge state for a user
   * @param userAddress Address to query
   * @returns Badge state with token IDs and types
   */
  async getBadgeState(userAddress: string): Promise<BadgeState> {
    try {
      logEvent('badge-sbt-get-state-start', {
        userAddress,
      }, 'debug');

      // Get all token IDs owned by user
      const tokenIds = await this.contract.getBadgesOf(userAddress);

      // Get badge types for each token
      const badgeTypes: number[] = [];
      const metadataURIs: string[] = [];

      for (const tokenId of tokenIds) {
        const badgeType = await this.contract.getBadgeType(tokenId);
        const uri = await this.contract.tokenURI(tokenId);
        
        badgeTypes.push(Number(badgeType));
        metadataURIs.push(uri);
      }

      logEvent('badge-sbt-get-state-success', {
        userAddress,
        tokenCount: tokenIds.length,
      }, 'debug');

      return {
        tokenIds: tokenIds.map(Number),
        badgeTypes,
        metadataURIs,
      };
    } catch (error) {
      logEvent('badge-sbt-get-state-error', {
        userAddress,
        error: String(error),
      }, 'error');

      return {
        tokenIds: [],
        badgeTypes: [],
        metadataURIs: [],
      };
    }
  }

  /**
   * Check if user has a specific badge type
   * @param userAddress Address to check
   * @param badgeType Badge type to check for
   * @returns True if user has badge type
   */
  async hasBadgeType(userAddress: string, badgeType: number): Promise<boolean> {
    try {
      return await this.contract.hasBadgeType(userAddress, badgeType);
    } catch (error) {
      logEvent('badge-sbt-has-badge-error', {
        userAddress,
        badgeType,
        error: String(error),
      }, 'error');

      return false;
    }
  }

  /**
   * Get badge types owned by user
   * @param userAddress Address to query
   * @returns Array of badge type IDs
   */
  async getBadgeTypes(userAddress: string): Promise<number[]> {
    try {
      const state = await this.getBadgeState(userAddress);
      return state.badgeTypes;
    } catch (error) {
      logEvent('badge-sbt-get-types-error', {
        userAddress,
        error: String(error),
      }, 'error');

      return [];
    }
  }
}

/**
 * Create a Badge SBT Service instance
 * @param config Configuration object
 * @returns BadgeSBTService instance
 */
export function createBadgeSBTService(config: {
  rpcUrl: string;
  contractAddress: string;
  privateKey?: string;
}): BadgeSBTService {
  return new BadgeSBTService(
    config.rpcUrl,
    config.contractAddress,
    config.privateKey
  );
}
