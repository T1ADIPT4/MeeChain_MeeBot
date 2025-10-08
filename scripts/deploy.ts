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
