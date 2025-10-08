/**
 * Badge Minter for MeeChain
 * Handles badge minting with fallback mechanism for resilience
 */

import { logEvent } from '../utils/logger.js'
import { getBadgeContract, getFallbackContract } from '../config/registryLoader.js'
import type { SupportedNetwork } from '../config/registryTypes.js'

export interface BadgeTransaction {
  txHash: string
  userId: string
  questId: string
  badgeId: string
  timestamp: Date
  chain: 'primary' | 'fallback'
  contractAddress?: string
  network?: SupportedNetwork
}

// Simulated blockchain state
let mintingSuccess = true
let fallbackMintingSuccess = true

// Default network for badge minting (can be configured)
let primaryNetwork: SupportedNetwork = 'polygon'
let fallbackNetwork: SupportedNetwork = 'ethereum'

/**
 * Mint a badge on the primary chain
 * @param userId - User ID receiving the badge
 * @param questId - Quest ID that was completed
 * @param network - Optional network to use (defaults to primaryNetwork)
 * @returns Badge transaction details
 * @throws Error if minting fails
 */
export async function mintBadge(
  userId: string,
  questId: string,
  network?: SupportedNetwork
): Promise<BadgeTransaction> {
  const chainNetwork = network || primaryNetwork
  const contractAddress = getBadgeContract(chainNetwork)
  
  logEvent('badge-mint-start', { 
    userId, 
    questId, 
    chain: 'primary',
    network: chainNetwork,
    contractAddress 
  }, 'debug')

  // Simulate primary chain minting
  await new Promise((resolve) => setTimeout(resolve, 100))

  if (!mintingSuccess) {
    throw new Error('Primary chain minting failed')
  }

  const transaction: BadgeTransaction = {
    txHash: `0x${Math.random().toString(16).slice(2)}`,
    userId,
    questId,
    badgeId: `badge-${questId}`,
    timestamp: new Date(),
    chain: 'primary',
    contractAddress,
    network: chainNetwork,
  }

  logEvent('badge-mint-success', {
    userId,
    questId,
    tx: transaction.txHash,
    chain: 'primary',
    network: chainNetwork,
    contractAddress,
  })

  return transaction
}

/**
 * Mint a badge on the fallback chain
 * @param userId - User ID receiving the badge
 * @param questId - Quest ID that was completed
 * @param network - Optional network to use (defaults to fallbackNetwork)
 * @returns Badge transaction details
 * @throws Error if fallback minting also fails
 */
export async function fallbackMintBadge(
  userId: string,
  questId: string,
  network?: SupportedNetwork
): Promise<BadgeTransaction> {
  const chainNetwork = network || fallbackNetwork
  const contractAddress = getFallbackContract(chainNetwork)
  
  logEvent('badge-fallback-mint-start', { 
    userId, 
    questId, 
    chain: 'fallback',
    network: chainNetwork,
    contractAddress 
  }, 'debug')

  // Simulate fallback chain minting (usually more reliable)
  await new Promise((resolve) => setTimeout(resolve, 150))

  if (!fallbackMintingSuccess) {
    throw new Error('Fallback chain minting also failed')
  }

  const transaction: BadgeTransaction = {
    txHash: `0xfb${Math.random().toString(16).slice(2)}`,
    userId,
    questId,
    badgeId: `badge-${questId}-fallback`,
    timestamp: new Date(),
    chain: 'fallback',
    contractAddress,
    network: chainNetwork,
  }

  logEvent('badge-fallback-mint-success', {
    userId,
    questId,
    tx: transaction.txHash,
    chain: 'fallback',
    network: chainNetwork,
    contractAddress,
  })

  return transaction
}

/**
 * Verify if a badge exists for a user
 * @param userId - User ID to check
 * @param questId - Quest ID to check
 * @returns true if badge exists, false otherwise
 */
export async function verifyBadgeExists(
  userId: string,
  questId: string
): Promise<boolean> {
  // In production, this would query the blockchain or database
  logEvent('badge-verification', { userId, questId }, 'debug')
  return true
}

/**
 * Set primary chain minting status (for testing)
 * @param success - Whether primary minting should succeed
 */
export function setPrimaryMintingStatus(success: boolean): void {
  mintingSuccess = success
}

/**
 * Set fallback chain minting status (for testing)
 * @param success - Whether fallback minting should succeed
 */
export function setFallbackMintingStatus(success: boolean): void {
  fallbackMintingSuccess = success
}

/**
 * Set primary network for minting
 * @param network - Network to use for primary minting
 */
export function setPrimaryNetwork(network: SupportedNetwork): void {
  primaryNetwork = network
}

/**
 * Set fallback network for minting
 * @param network - Network to use for fallback minting
 */
export function setFallbackNetwork(network: SupportedNetwork): void {
  fallbackNetwork = network
}

/**
 * Get current primary network
 * @returns Current primary network
 */
export function getPrimaryNetwork(): SupportedNetwork {
  return primaryNetwork
}

/**
 * Get current fallback network
 * @returns Current fallback network
 */
export function getFallbackNetwork(): SupportedNetwork {
  return fallbackNetwork
}
