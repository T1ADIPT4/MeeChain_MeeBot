#!/usr/bin/env ts-node
/**
 * Validate Registry Script for MeeChain
 * Validates the integrity and correctness of deploy-registry.json
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import type { DeployRegistry, NetworkConfig } from '../src/config/registryTypes.js'

export interface ValidationError {
  field: string
  message: string
  network?: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: string[]
}

/**
 * Validate the deploy registry
 * @returns Validation result with any errors or warnings
 */
export function validateRegistry(): ValidationResult {
  const registryPath = join(process.cwd(), 'config/deploy-registry.json')
  const errors: ValidationError[] = []
  const warnings: string[] = []
  
  console.log(`🔍 Validating deploy registry...`)
  
  // Check if file exists
  if (!readFileSync(registryPath, 'utf-8')) {
    errors.push({
      field: 'file',
      message: 'deploy-registry.json not found',
    })
    return { valid: false, errors, warnings }
  }
  
  // Parse JSON
  let registry: DeployRegistry
  try {
    const registryData = readFileSync(registryPath, 'utf-8')
    registry = JSON.parse(registryData)
  } catch (error) {
    errors.push({
      field: 'json',
      message: `Failed to parse JSON: ${error}`,
    })
    return { valid: false, errors, warnings }
  }
  
  // Validate top-level fields
  if (!registry.version) {
    errors.push({
      field: 'version',
      message: 'Missing version field',
    })
  }
  
  if (!registry.lastUpdated) {
    errors.push({
      field: 'lastUpdated',
      message: 'Missing lastUpdated field',
    })
  } else {
    // Check if lastUpdated is a valid ISO date
    const date = new Date(registry.lastUpdated)
    if (isNaN(date.getTime())) {
      errors.push({
        field: 'lastUpdated',
        message: 'Invalid date format (should be ISO 8601)',
      })
    }
  }
  
  if (!registry.networks) {
    errors.push({
      field: 'networks',
      message: 'Missing networks field',
    })
    return { valid: false, errors, warnings }
  }
  
  // Validate each network
  const requiredFields = ['badgeContract', 'questContract', 'fallbackContract', 'chainId']
  
  for (const [networkName, config] of Object.entries(registry.networks)) {
    // Check required fields
    for (const field of requiredFields) {
      if (!(field in config) || !(config as any)[field]) {
        warnings.push(`Missing ${field} in ${networkName}`)
      }
    }
    
    // Validate contract addresses (should start with 0x)
    const addressFields = ['badgeContract', 'questContract', 'fallbackContract']
    for (const field of addressFields) {
      const address = (config as any)[field]
      if (address && !isValidAddress(address)) {
        errors.push({
          field,
          message: `Invalid address format (should start with 0x)`,
          network: networkName,
        })
      }
    }
    
    // Validate chainId
    if ('chainId' in config) {
      const chainId = (config as NetworkConfig).chainId
      if (typeof chainId !== 'number' || chainId <= 0) {
        errors.push({
          field: 'chainId',
          message: 'chainId should be a positive number',
          network: networkName,
        })
      }
    }
  }
  
  // Check for common networks
  const commonNetworks = ['ethereum', 'polygon', 'arbitrum']
  for (const network of commonNetworks) {
    if (!registry.networks[network]) {
      warnings.push(`Common network '${network}' not found in registry`)
    }
  }
  
  const valid = errors.length === 0
  
  if (valid) {
    console.log(`✅ Registry validation passed`)
    if (warnings.length > 0) {
      console.log(`⚠️  ${warnings.length} warning(s):`)
      warnings.forEach(w => console.log(`   - ${w}`))
    }
  } else {
    console.log(`❌ Registry validation failed with ${errors.length} error(s)`)
    errors.forEach(e => {
      const location = e.network ? ` in ${e.network}` : ''
      console.log(`   - ${e.field}${location}: ${e.message}`)
    })
  }
  
  return { valid, errors, warnings }
}

/**
 * Check if a string is a valid Ethereum-style address
 */
export function isValidAddress(address: string): boolean {
  return typeof address === 'string' && /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validate registry and exit with error code if invalid
 */
export function validateRegistryOrExit(): void {
  const result = validateRegistry()
  if (!result.valid) {
    process.exit(1)
  }
}

// Run if called directly
const isMainModule = process.argv[1] && process.argv[1].endsWith('validateRegistry.ts')
if (isMainModule) {
  validateRegistryOrExit()
}
