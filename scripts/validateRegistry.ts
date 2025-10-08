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
