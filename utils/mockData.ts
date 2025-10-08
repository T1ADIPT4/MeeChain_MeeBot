/**
 * Mock Data Utilities for Dashboard
 * Provides sample data for badges and fallback logs
 * In production, this would fetch from a database or blockchain
 */

import { getLogsByType } from '../src/utils/logger.js'
import type { SupportedNetwork } from '../src/config/registryTypes.js'

export interface UserBadge {
  badgeId: string
  questId: string
  userId: string
  chain?: SupportedNetwork
  timestamp?: Date
  txHash?: string
}

export interface FallbackLogEntry {
  userId: string
  questId: string
  chain?: SupportedNetwork
  timestamp: Date
  txHash?: string
  fallbackUsed: boolean
}

/**
 * Get user badges (mock implementation)
 * In production, this would query from database or blockchain
 * @param userId - User ID to get badges for
 * @returns Array of user badges
 */
export function getUserBadges(userId: string): UserBadge[] {
  // Mock data - in production this would come from database/blockchain
  const mockBadges: UserBadge[] = [
    {
      badgeId: 'badge-quest-001',
      questId: 'quest-001',
      userId: userId,
      chain: 'polygon',
      timestamp: new Date('2025-10-08'),
      txHash: '0xabc123...'
    },
    {
      badgeId: 'badge-quest-002',
      questId: 'quest-002',
      userId: userId,
      chain: 'ethereum',
      timestamp: new Date('2025-10-07'),
      txHash: '0xdef456...'
    },
    {
      badgeId: 'badge-quest-tts-001',
      questId: 'quest-tts-001',
      userId: userId,
      chain: 'arbitrum',
      timestamp: new Date('2025-10-06'),
      txHash: '0xghi789...'
    }
  ]

  return mockBadges
}

/**
 * Get fallback logs from the logging system
 * @returns Array of fallback log entries
 */
export function getFallbackLogs(): FallbackLogEntry[] {
  // Get actual fallback logs from the logger
  const fallbackMintLogs = getLogsByType('badge-fallback-minted')
  const fallbackSuccessLogs = getLogsByType('badge-fallback-mint-success')
  
  const logs: FallbackLogEntry[] = []
  
  // Combine both types of fallback logs
  const allFallbackLogs = [...fallbackMintLogs, ...fallbackSuccessLogs]
  
  for (const log of allFallbackLogs) {
    logs.push({
      userId: log.context.userId || 'unknown',
      questId: log.context.questId || 'unknown',
      chain: log.context.network as SupportedNetwork,
      timestamp: log.timestamp,
      txHash: log.context.tx,
      fallbackUsed: true
    })
  }
  
  // If no actual logs, provide mock data for demo purposes
  if (logs.length === 0) {
    return [
      {
        userId: 'user-001',
        questId: 'quest-001',
        chain: 'optimism' as any,
        timestamp: new Date('2025-10-08T10:30:00Z'),
        txHash: '0xfallback123...',
        fallbackUsed: true
      },
      {
        userId: 'user-002',
        questId: 'quest-002',
        chain: 'ethereum',
        timestamp: new Date('2025-10-08T09:15:00Z'),
        txHash: '0xfallback456...',
        fallbackUsed: true
      }
    ]
  }
  
  return logs
}

/**
 * Mint badge with admin override (mock implementation)
 * In production, this would interact with smart contracts
 * @param userId - User ID to mint badge for
 * @param questId - Quest ID for the badge
 * @param contractAddress - Contract address to use
 */
export function mintBadge(userId: string, questId: string, contractAddress: string): void {
  console.log(`[Admin Override] Minting badge for ${userId}, quest ${questId} at contract ${contractAddress}`)
  // In production, this would call the actual minting function
}
