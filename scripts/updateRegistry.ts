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
    throw new Error(`Failed to restore registry: ${error}`)
  }
}
