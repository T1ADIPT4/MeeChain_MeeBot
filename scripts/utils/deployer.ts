/**
 * Contract Deployment Utilities for MeeChain
 * Helper functions for deploying contracts to multiple networks
 */

import { deployContract, updateRegistryFile } from '../deploy.js'
import type { SupportedNetwork } from '../../src/config/registryTypes.js'

export interface DeploymentResult {
  contractType: string
  network: string
  address: string
  timestamp: Date
}

/**
 * Deploy all contracts to a specific network
 * @param network - Network to deploy to
 * @returns Array of deployment results
 */
export async function deployAllContracts(network: SupportedNetwork): Promise<DeploymentResult[]> {
  console.log(`🚀 Deploying all contracts to ${network}...\n`)
  
  const results: DeploymentResult[] = []
  
  // Deploy Badge contract
  console.log('📦 Deploying Badge contract...')
  const badgeAddress = await deployContract('Badge', network)
  updateRegistryFile(network, 'Badge', badgeAddress)
  results.push({
    contractType: 'Badge',
    network,
    address: badgeAddress,
    timestamp: new Date(),
  })
  
  // Deploy Quest contract
  console.log('\n📦 Deploying Quest contract...')
  const questAddress = await deployContract('Quest', network)
  updateRegistryFile(network, 'Quest', questAddress)
  results.push({
    contractType: 'Quest',
    network,
    address: questAddress,
    timestamp: new Date(),
  })
  
  // Deploy Fallback contract
  console.log('\n📦 Deploying Fallback contract...')
  const fallbackAddress = await deployContract('Fallback', network)
  updateRegistryFile(network, 'Fallback', fallbackAddress)
  results.push({
    contractType: 'Fallback',
    network,
    address: fallbackAddress,
    timestamp: new Date(),
  })
  
  console.log(`\n✨ All contracts deployed to ${network}!`)
  return results
}

/**
 * Deploy contracts to multiple networks
 * @param networks - Array of networks to deploy to
 * @returns Map of network to deployment results
 */
export async function deployToMultipleNetworks(
  networks: SupportedNetwork[]
): Promise<Map<SupportedNetwork, DeploymentResult[]>> {
  console.log(`🌐 Deploying to ${networks.length} network(s): ${networks.join(', ')}\n`)
  
  const resultMap = new Map<SupportedNetwork, DeploymentResult[]>()
  
  for (const network of networks) {
    const results = await deployAllContracts(network)
    resultMap.set(network, results)
    console.log('')
  }
  
  console.log('🎉 Multi-network deployment complete!')
  return resultMap
}

/**
 * Validate deployment addresses
 * @param address - Contract address to validate
 * @returns True if address is valid
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]+$/.test(address) && address.length > 3
}

/**
 * Get deployment summary
 * @param results - Array of deployment results
 * @returns Summary object
 */
export function getDeploymentSummary(results: DeploymentResult[]): {
  total: number
  byType: Record<string, number>
  byNetwork: Record<string, number>
} {
  const summary = {
    total: results.length,
    byType: {} as Record<string, number>,
    byNetwork: {} as Record<string, number>,
  }
  
  results.forEach(result => {
    // Count by type
    summary.byType[result.contractType] = (summary.byType[result.contractType] || 0) + 1
    
    // Count by network
    summary.byNetwork[result.network] = (summary.byNetwork[result.network] || 0) + 1
  })
  
  return summary
}
