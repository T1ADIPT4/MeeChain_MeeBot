#!/usr/bin/env ts-node
/**
 * Deploy Script for MeeChain
 * Deploys smart contracts and records their addresses in deploy-registry.json
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { DeployRegistry, NetworkConfig, SupportedNetwork } from '../src/config/registryTypes.js'

interface DeployOptions {
  contractType: 'Badge' | 'Quest' | 'Fallback'
  network: SupportedNetwork
  address?: string
  simulate?: boolean
}

/**
 * Simulate contract deployment
 * In real deployment, this would interact with blockchain
 */
async function deployContract(contractType: string, network: string): Promise<string> {
  console.log(`📦 Deploying ${contractType} contract to ${network}...`)
  
  // Simulate deployment time
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Generate a mock contract address
  const timestamp = Date.now().toString(16)
  const mockAddress = `0x${contractType.substring(0, 4)}${network.substring(0, 4)}${timestamp}`
  
  console.log(`✅ Deployed ${contractType} at ${mockAddress}`)
  return mockAddress
}

/**
 * Update the deploy registry with new contract address
 */
function updateRegistryFile(
  network: SupportedNetwork,
  contractType: 'Badge' | 'Quest' | 'Fallback',
  address: string
): void {
  const registryPath = join(process.cwd(), 'config/deploy-registry.json')
  
  try {
    // Read current registry
    const registryData = readFileSync(registryPath, 'utf-8')
    const registry: DeployRegistry = JSON.parse(registryData)
    
    // Ensure network exists
    if (!registry.networks[network]) {
      console.log(`⚠️  Network ${network} not found in registry, creating...`)
      registry.networks[network] = {
        chainId: getChainId(network),
        badgeContract: '',
        questContract: '',
        fallbackContract: ''
      }
    }
    
    // Update contract address
    const contractKey = `${contractType.toLowerCase()}Contract` as keyof NetworkConfig
    (registry.networks[network] as any)[contractKey] = address
    
    // Update metadata
    registry.lastUpdated = new Date().toISOString()
    
    // Write back to file
    writeFileSync(registryPath, JSON.stringify(registry, null, 2))
    console.log(`✅ Registry updated: ${network}.${contractKey} = ${address}`)
  } catch (error) {
    console.error(`❌ Failed to update registry:`, error)
    throw error
  }
}

/**
 * Get chain ID for a network
 */
function getChainId(network: SupportedNetwork): number {
  const chainIds: Record<SupportedNetwork, number> = {
    ethereum: 1,
    polygon: 137,
    arbitrum: 42161
  }
  return chainIds[network]
}

/**
 * Main deploy function
 */
async function deploy(options: DeployOptions): Promise<void> {
  const { contractType, network, address, simulate = true } = options
  
  console.log(`\n🚀 Starting deployment...`)
  console.log(`   Contract Type: ${contractType}`)
  console.log(`   Network: ${network}`)
  console.log(`   Mode: ${simulate ? 'Simulation' : 'Live'}`)
  console.log(``)
  
  // Deploy contract (or use provided address)
  let contractAddress: string
  if (address) {
    console.log(`📍 Using provided address: ${address}`)
    contractAddress = address
  } else if (simulate) {
    contractAddress = await deployContract(contractType, network)
  } else {
    throw new Error('Live deployment not implemented. Provide --address or use --simulate')
  }
  
  // Update registry
  updateRegistryFile(network, contractType, contractAddress)
  
  console.log(`\n✨ Deployment complete!`)
  console.log(`   ${contractType} Contract: ${contractAddress}`)
  console.log(`   Network: ${network}`)
  console.log(`\n💡 Next steps:`)
  console.log(`   1. Run: npm run registry:validate`)
  console.log(`   2. Verify the contract on block explorer`)
  console.log(`   3. Test the integration`)
}

/**
 * Parse command line arguments
 */
function parseArgs(): DeployOptions {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Usage: ts-node scripts/deploy.ts <ContractType> [options]

Contract Types:
  Badge       Deploy Badge contract
  Quest       Deploy Quest contract
  Fallback    Deploy Fallback contract

Options:
  --network <name>    Network to deploy to (ethereum|polygon|arbitrum)
  --address <addr>    Use existing contract address instead of deploying
  --simulate          Simulate deployment (default: true)
  --help              Show this help message

Examples:
  ts-node scripts/deploy.ts Badge --network polygon
  ts-node scripts/deploy.ts Quest --network ethereum --address 0x123...
  npm run deploy:badge -- --network arbitrum
`)
    process.exit(0)
  }
  
  const contractType = args[0] as 'Badge' | 'Quest' | 'Fallback'
  if (!['Badge', 'Quest', 'Fallback'].includes(contractType)) {
    throw new Error(`Invalid contract type: ${contractType}`)
  }
  
  const networkIndex = args.indexOf('--network')
  const network = (networkIndex >= 0 ? args[networkIndex + 1] : 'polygon') as SupportedNetwork
  
  const addressIndex = args.indexOf('--address')
  const address = addressIndex >= 0 ? args[addressIndex + 1] : undefined
  
  const simulate = !args.includes('--no-simulate')
  
  return { contractType, network, address, simulate }
}

// Run if called directly
const isMainModule = process.argv[1] && process.argv[1].endsWith('deploy.ts')
if (isMainModule) {
  try {
    const options = parseArgs()
    deploy(options).catch(error => {
      console.error('❌ Deployment failed:', error)
      process.exit(1)
    })
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

export { deploy, deployContract, updateRegistryFile }

/**
 * Main Deployment Script for MeeChain
 * Orchestrates contract deployment and registry updates
 */

import { deployAllContracts, verifyContract } from './utils/deployer.js'
import { updateRegistry, backupRegistry } from './updateRegistry.js'
import { validateRegistry } from './validateRegistry.js'
import type { SupportedNetwork } from '../src/config/registryTypes.js'

/**
 * Deploy contracts to a specific network and update registry
 * @param network - Target blockchain network
 */
async function deployToNetwork(network: SupportedNetwork): Promise<void> {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`🚀 Starting deployment to ${network.toUpperCase()}`)
  console.log(`${'='.repeat(60)}\n`)
  
  try {
    // Step 1: Backup current registry
    backupRegistry()
    
    // Step 2: Deploy all contracts
    const contracts = await deployAllContracts(network)
    
    // Step 3: Verify contracts
    console.log(`\n🔍 Verifying deployed contracts...\n`)
    const badgeValid = await verifyContract(contracts.badgeContract, network)
    const questValid = await verifyContract(contracts.questContract, network)
    const fallbackValid = await verifyContract(contracts.fallbackContract, network)
    
    if (!badgeValid || !questValid || !fallbackValid) {
      throw new Error('Contract verification failed')
    }
    
    // Step 4: Update registry
    console.log('')
    updateRegistry(network, contracts)
    
    // Step 5: Validate updated registry
    console.log('')
    const validation = validateRegistry()
    if (!validation.valid) {
      throw new Error('Registry validation failed after update')
    }
    
    console.log(`\n${'='.repeat(60)}`)
    console.log(`✅ Deployment to ${network.toUpperCase()} completed successfully!`)
    console.log(`${'='.repeat(60)}\n`)
    
  } catch (error) {
    console.error(`\n❌ Deployment failed: ${error}`)
    process.exit(1)
  }
}

/**
 * Main deployment function
 */
async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║         MeeChain Contract Deployment System              ║
║              Multi-Chain Registry Manager                ║
╚═══════════════════════════════════════════════════════════╝
`)
  
  // Get network from command line arguments
  const args = process.argv.slice(2)
  const network = args[0] as SupportedNetwork | undefined
  
  if (!network) {
    console.log('Usage: npm run deploy <network>')
    console.log('Available networks: ethereum, polygon, arbitrum')
    console.log('\nExample: npm run deploy arbitrum')
    process.exit(1)
  }
  
  const validNetworks: SupportedNetwork[] = ['ethereum', 'polygon', 'arbitrum']
  if (!validNetworks.includes(network)) {
    console.error(`❌ Invalid network: ${network}`)
    console.log(`Valid networks: ${validNetworks.join(', ')}`)
    process.exit(1)
  }
  
  await deployToNetwork(network)
}

// Run deployment
main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
