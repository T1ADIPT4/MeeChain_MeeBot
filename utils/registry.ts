/**
 * Registry Utility for MeeChain Dashboard
 * Simplified interface for accessing deploy-registry.json in UI components
 */

import { getBadgeContract, getQuestContract, getFallbackContract } from '../src/config/registryLoader.js'

/**
 * Get contract address by chain and type
 * @param chain - Network name (ethereum, polygon, arbitrum, etc.)
 * @param type - Contract type (badge, quest, fallback)
 * @returns Contract address for the specified chain and type
 */
export function getContractAddress(
  chain: string,
  type: 'badge' | 'quest' | 'fallback'
): string {
  const map = {
    badge: getBadgeContract,
    quest: getQuestContract,
    fallback: getFallbackContract
  }

  try {
    return map[type](chain as any)
  } catch (error) {
    console.error(`Failed to get ${type} contract for ${chain}:`, error)
    return 'N/A'
  }
}
