#!/usr/bin/env ts-node
/**
 * Validate Registry Script for MeeChain
 * Validates the integrity and correctness of deploy-registry.json
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import type { DeployRegistry, NetworkConfig } from '../src/config/registryTypes.js'

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  networkCount: number
  networks: string[]
}

/**
 * Validate contract address format
 */
function isValidAddress(address: string): boolean {
  // Check if it starts with 0x and has at least some content
  // Allow alphanumeric for testing/mock addresses
  return /^0x[a-zA-Z0-9]+$/.test(address) && address.length >= 3
}

/**
 * Validate network configuration
 */
function validateNetworkConfig(
  network: string,
  config: NetworkConfig,
  errors: string[],
  warnings: string[]
): void {
  // Check chain ID
  if (!config.chainId || config.chainId <= 0) {
    errors.push(`${network}: Invalid or missing chainId`)
  }
  
  // Check contract addresses
  const contracts = [
    { name: 'badgeContract', value: config.badgeContract },
    { name: 'questContract', value: config.questContract },
    { name: 'fallbackContract', value: config.fallbackContract }
  ]
  
  for (const contract of contracts) {
    if (!contract.value) {
      warnings.push(`${network}: Missing ${contract.name}`)
    } else if (!isValidAddress(contract.value)) {
      errors.push(`${network}: Invalid ${contract.name} address format: ${contract.value}`)
    }
  }
  
  // Check for duplicate addresses
  const addresses = [config.badgeContract, config.questContract, config.fallbackContract]
    .filter(addr => addr && addr !== '')
  
  const uniqueAddresses = new Set(addresses)
  if (addresses.length !== uniqueAddresses.size) {
    warnings.push(`${network}: Duplicate contract addresses detected`)
  }
}

/**
 * Validate the entire registry
 */
function validateRegistry(): ValidationResult {
  const registryPath = join(process.cwd(), 'config/deploy-registry.json')
  
  const errors: string[] = []
  const warnings: string[] = []
  
  try {
    // Read and parse registry
    const registryData = readFileSync(registryPath, 'utf-8')
    const registry: DeployRegistry = JSON.parse(registryData)
    
    // Check version
    if (!registry.version) {
      errors.push('Missing version field')
    } else if (!/^\d+\.\d+\.\d+$/.test(registry.version)) {
      warnings.push(`Version format should be semver (e.g., 1.0.0): ${registry.version}`)
    }
    
    // Check lastUpdated
    if (!registry.lastUpdated) {
      warnings.push('Missing lastUpdated field')
    } else {
      const lastUpdate = new Date(registry.lastUpdated)
      if (isNaN(lastUpdate.getTime())) {
        errors.push(`Invalid lastUpdated date: ${registry.lastUpdated}`)
      }
    }
    
    // Check networks
    if (!registry.networks || typeof registry.networks !== 'object') {
      errors.push('Missing or invalid networks object')
      return {
        valid: false,
        errors,
        warnings,
        networkCount: 0,
        networks: []
      }
    }
    
    const networkNames = Object.keys(registry.networks)
    
    if (networkNames.length === 0) {
      errors.push('No networks configured')
    }
    
    // Validate each network
    for (const network of networkNames) {
      const config = registry.networks[network]
      validateNetworkConfig(network, config, errors, warnings)
    }
    
    // Check for cross-network issues
    const allChainIds = networkNames.map(n => registry.networks[n].chainId)
    const uniqueChainIds = new Set(allChainIds)
    if (allChainIds.length !== uniqueChainIds.size) {
      warnings.push('Duplicate chain IDs detected across networks')
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      networkCount: networkNames.length,
      networks: networkNames
    }
  } catch (error) {
    if (error instanceof Error) {
      errors.push(`Failed to read or parse registry: ${error.message}`)
    } else {
      errors.push('Failed to read or parse registry: Unknown error')
    }
    
    return {
      valid: false,
      errors,
      warnings,
      networkCount: 0,
      networks: []
    }
  }
}

/**
 * Display validation results
 */
function displayResults(result: ValidationResult): void {
  console.log(`\n🔍 Registry Validation Results\n`)
  console.log(`Networks: ${result.networkCount}`)
  if (result.networks.length > 0) {
    console.log(`  ${result.networks.join(', ')}`)
  }
  console.log('')
  
  // Display errors
  if (result.errors.length > 0) {
    console.log(`❌ Errors (${result.errors.length}):`)
    result.errors.forEach(error => console.log(`   - ${error}`))
    console.log('')
  }
  
  // Display warnings
  if (result.warnings.length > 0) {
    console.log(`⚠️  Warnings (${result.warnings.length}):`)
    result.warnings.forEach(warning => console.log(`   - ${warning}`))
    console.log('')
  }
  
  // Overall status
  if (result.valid) {
    if (result.warnings.length > 0) {
      console.log(`✅ Registry is valid (with warnings)`)
    } else {
      console.log(`✅ Registry is valid`)
    }
  } else {
    console.log(`❌ Registry validation failed`)
  }
}

/**
 * Validate with specific checks
 */
function validateWithOptions(options: { strict?: boolean; verbose?: boolean }): ValidationResult {
  const result = validateRegistry()
  
  if (options.verbose) {
    displayResults(result)
  }
  
  if (options.strict && result.warnings.length > 0) {
    // In strict mode, warnings are treated as errors
    result.valid = false
    result.errors.push(...result.warnings.map(w => `[STRICT] ${w}`))
    result.warnings = []
  }
  
  return result
}

/**
 * Parse command line arguments
 */
function parseArgs(): { strict: boolean; verbose: boolean } {
  const args = process.argv.slice(2)
  
  if (args.includes('--help')) {
    console.log(`
Usage: ts-node scripts/validateRegistry.ts [options]

Options:
  --strict     Treat warnings as errors
  --verbose    Display detailed results (default: true)
  --help       Show this help message

Examples:
  npm run registry:validate
  npm run registry:validate -- --strict
`)
    process.exit(0)
  }
  
  const strict = args.includes('--strict')
  const verbose = !args.includes('--quiet')
  
  return { strict, verbose }
}

// Run if called directly
const isMainModule = process.argv[1] && process.argv[1].endsWith('validateRegistry.ts')
if (isMainModule) {
  try {
    const options = parseArgs()
    const result = validateWithOptions(options)
    
    if (!options.verbose) {
      displayResults(result)
    }
    
    process.exit(result.valid ? 0 : 1)
  } catch (error) {
    console.error('❌ Validation error:', error)
    process.exit(1)
  }
}

export { validateRegistry, validateWithOptions, isValidAddress, validateNetworkConfig }

/**
 * Validate Deploy Registry Script for MeeChain
 * Ensures deploy-registry.json has all required fields and valid data
 */

import fs from 'fs'
import path from 'path'
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
  const registryPath = path.resolve(process.cwd(), 'config/deploy-registry.json')
  const errors: ValidationError[] = []
  const warnings: string[] = []
  
  console.log(`🔍 Validating deploy registry...`)
  
  // Check if file exists
  if (!fs.existsSync(registryPath)) {
    errors.push({
      field: 'file',
      message: 'deploy-registry.json not found',
    })
    return { valid: false, errors, warnings }
  }
  
  // Parse JSON
  let registry: DeployRegistry
  try {
    const registryData = fs.readFileSync(registryPath, 'utf-8')
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
      if (!(field in config)) {
        errors.push({
          field,
          message: `Missing ${field}`,
          network: networkName,
        })
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
function isValidAddress(address: string): boolean {
  return typeof address === 'string' && address.startsWith('0x')
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
