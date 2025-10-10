#!/usr/bin/env ts-node
/**
 * Update Registry Script for MeeChain
 * Programmatically updates deploy-registry.json with new contract addresses
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { DeployRegistry, NetworkConfig, SupportedNetwork } from '../src/config/registryTypes.js'

interface UpdateOptions {
  network: SupportedNetwork
  badgeContract?: string
  questContract?: string
  fallbackContract?: string
  chainId?: number
}

/**
 * Update the deploy registry with new configuration
 */
function updateRegistry(options: UpdateOptions): void {
  const registryPath = join(process.cwd(), 'config/deploy-registry.json')
  
  try {
    // Read current registry
    const registryData = readFileSync(registryPath, 'utf-8')
    const registry: DeployRegistry = JSON.parse(registryData)
    
    const { network, badgeContract, questContract, fallbackContract, chainId } = options
    
    // Get or create network config
    let networkConfig = registry.networks[network]
    if (!networkConfig) {
      console.log(`⚠️  Network ${network} not found, creating new entry...`)
      networkConfig = {
        chainId: chainId || getDefaultChainId(network),
        badgeContract: '',
        questContract: '',
        fallbackContract: ''
      }
      registry.networks[network] = networkConfig
    }
    
    // Track changes
    const changes: string[] = []
    
    // Update contracts if provided
    if (badgeContract) {
      networkConfig.badgeContract = badgeContract
      changes.push(`badgeContract: ${badgeContract}`)
    }
    
    if (questContract) {
      networkConfig.questContract = questContract
      changes.push(`questContract: ${questContract}`)
    }
    
    if (fallbackContract) {
      networkConfig.fallbackContract = fallbackContract
      changes.push(`fallbackContract: ${fallbackContract}`)
    }
    
    if (chainId !== undefined) {
      networkConfig.chainId = chainId
      changes.push(`chainId: ${chainId}`)
    }
    
    // Update metadata
    registry.lastUpdated = new Date().toISOString()
    
    // Write back to file
    writeFileSync(registryPath, JSON.stringify(registry, null, 2))
    
    console.log(`✅ Registry updated successfully`)
    console.log(`   Network: ${network}`)
    changes.forEach(change => console.log(`   - ${change}`))
    console.log(`   Last Updated: ${registry.lastUpdated}`)
  } catch (error) {
    console.error(`❌ Failed to update registry:`, error)
    throw error
  }
}

/**
 * Get default chain ID for known networks
 */
function getDefaultChainId(network: string): number {
  const chainIds: Record<string, number> = {
    ethereum: 1,
    polygon: 137,
    arbitrum: 42161,
    optimism: 10,
    base: 8453,
    avalanche: 43114
  }
  return chainIds[network] || 0
}

/**
 * Batch update multiple networks
 */
function batchUpdateRegistry(updates: UpdateOptions[]): void {
  console.log(`\n🔄 Batch updating ${updates.length} network(s)...\n`)
  
  updates.forEach((options, index) => {
    console.log(`[${index + 1}/${updates.length}]`)
    updateRegistry(options)
    console.log('')
  })
  
  console.log(`✨ Batch update complete!`)
}

/**
 * Parse command line arguments
 */
function parseArgs(): UpdateOptions | UpdateOptions[] {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Usage: ts-node scripts/updateRegistry.ts [options]

Options:
  --network <name>          Network to update (required)
  --badge <address>         Badge contract address
  --quest <address>         Quest contract address
  --fallback <address>      Fallback contract address
  --chain-id <id>           Chain ID
  --batch <json>            Batch update from JSON array
  --help                    Show this help message

Examples:
  # Update single contract
  ts-node scripts/updateRegistry.ts --network polygon --badge 0x123...

  # Update multiple contracts
  ts-node scripts/updateRegistry.ts --network ethereum --badge 0x123... --quest 0x456...

  # Update with custom chain ID
  ts-node scripts/updateRegistry.ts --network optimism --chain-id 10 --badge 0x789...

  # Batch update
  npm run registry:update -- --batch '[{"network":"ethereum","badgeContract":"0x123"}]'
`)
    process.exit(0)
  }
  
  // Check for batch mode
  const batchIndex = args.indexOf('--batch')
  if (batchIndex >= 0) {
    const batchJson = args[batchIndex + 1]
    return JSON.parse(batchJson) as UpdateOptions[]
  }
  
  // Single update mode
  const networkIndex = args.indexOf('--network')
  if (networkIndex < 0) {
    throw new Error('--network is required')
  }
  
  const network = args[networkIndex + 1] as SupportedNetwork
  
  const badgeIndex = args.indexOf('--badge')
  const badgeContract = badgeIndex >= 0 ? args[badgeIndex + 1] : undefined
  
  const questIndex = args.indexOf('--quest')
  const questContract = questIndex >= 0 ? args[questIndex + 1] : undefined
  
  const fallbackIndex = args.indexOf('--fallback')
  const fallbackContract = fallbackIndex >= 0 ? args[fallbackIndex + 1] : undefined
  
  const chainIdIndex = args.indexOf('--chain-id')
  const chainId = chainIdIndex >= 0 ? parseInt(args[chainIdIndex + 1]) : undefined
  
  return { network, badgeContract, questContract, fallbackContract, chainId }
}

// Run if called directly
const isMainModule = process.argv[1] && process.argv[1].endsWith('updateRegistry.ts')
if (isMainModule) {
  try {
    const options = parseArgs()
    
    if (Array.isArray(options)) {
      batchUpdateRegistry(options)
    } else {
      console.log(`\n🔄 Updating registry...\n`)
      updateRegistry(options)
      console.log(`\n✨ Update complete!`)
    }
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

export { updateRegistry, batchUpdateRegistry }
/**
 * Update Deploy Registry Script for MeeChain
 * Automatically updates deploy-registry.json with new contract deployments
 */

import fs from 'fs'
import path from 'path'
import type { SupportedNetwork } from '../src/config/registryTypes.js'
import type { DeployRegistry } from '../src/config/registryTypes.js'

export interface RegistryUpdate {
  badgeContract?: string
  questContract?: string
  fallbackContract?: string
}

/**
 * Update the deploy registry with new contract addresses
 * @param network - Network to update
 * @param contracts - Contract addresses to update
 */
export function updateRegistry(
  network: SupportedNetwork,
  contracts: RegistryUpdate
): void {
  const registryPath = path.resolve(process.cwd(), 'config/deploy-registry.json')
  
  console.log(`📝 Updating registry for ${network}...`)
  
  // Read existing registry
  let registry: DeployRegistry
  try {
    const registryData = fs.readFileSync(registryPath, 'utf-8')
    registry = JSON.parse(registryData)
  } catch (error) {
    throw new Error(`Failed to read deploy-registry.json: ${error}`)
  }
  
  // Ensure network exists in registry
  if (!registry.networks[network]) {
    throw new Error(`Network ${network} not found in registry`)
  }
  
  // Update contract addresses
  registry.networks[network] = {
    ...registry.networks[network],
    ...contracts,
  }
  
  // Update timestamp
  registry.lastUpdated = new Date().toISOString()
  
  // Write updated registry
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n')
  
  console.log(`✅ Registry updated successfully`)
  console.log(`   Network: ${network}`)
  if (contracts.badgeContract) {
    console.log(`   Badge Contract: ${contracts.badgeContract}`)
  }
  if (contracts.questContract) {
    console.log(`   Quest Contract: ${contracts.questContract}`)
  }
  if (contracts.fallbackContract) {
    console.log(`   Fallback Contract: ${contracts.fallbackContract}`)
  }
}

/**
 * Backup the current registry before making changes
 */
export function backupRegistry(): string {
  const registryPath = path.resolve(process.cwd(), 'config/deploy-registry.json')
  const backupPath = path.resolve(
    process.cwd(),
    `config/deploy-registry.backup.${Date.now()}.json`
  )
  
  try {
    fs.copyFileSync(registryPath, backupPath)
    console.log(`💾 Registry backed up to ${path.basename(backupPath)}`)
    return backupPath
  } catch (error) {
    throw new Error(`Failed to backup registry: ${error}`)
  }
}

/**
 * Restore registry from a backup
 * @param backupPath - Path to backup file
 */
export function restoreRegistry(backupPath: string): void {
  const registryPath = path.resolve(process.cwd(), 'config/deploy-registry.json')
  
  try {
    fs.copyFileSync(backupPath, registryPath)
    console.log(`♻️ Registry restored from backup`)
  } catch (error) {
    console.error(`❌ Failed to restore registry:`, error)
    throw error
  }
}
