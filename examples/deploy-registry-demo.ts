/**
 * Deploy Registry Example
 * Demonstrates how to use the multi-chain contract deployment registry
 */

import {
  loadRegistry,
  getNetworkConfig,
  getBadgeContract,
  getQuestContract,
  getFallbackContract,
  getAvailableNetworks,
} from '../src/config/registryLoader.js'
import { mintBadge, fallbackMintBadge, setPrimaryNetwork, setFallbackNetwork } from '../src/minting/badgeMinter.js'

console.log('🌐 Deploy Registry Example\n')

/**
 * Example 1: Load and inspect the registry
 */
function example1_LoadRegistry() {
  console.log('=== Example 1: Load and Inspect Registry ===\n')
  
  const registry = loadRegistry()
  console.log(`Registry Version: ${registry.version}`)
  console.log(`Last Updated: ${registry.lastUpdated}`)
  console.log(`Available Networks: ${getAvailableNetworks().join(', ')}\n`)
}

/**
 * Example 2: Get network configurations
 */
function example2_NetworkConfigs() {
  console.log('=== Example 2: Network Configurations ===\n')
  
  const networks = ['ethereum', 'polygon', 'arbitrum'] as const
  
  networks.forEach(network => {
    const config = getNetworkConfig(network)
    console.log(`${network.toUpperCase()}:`)
    console.log(`  Chain ID: ${config.chainId}`)
    console.log(`  Badge Contract: ${config.badgeContract}`)
    console.log(`  Quest Contract: ${config.questContract}`)
    console.log(`  Fallback Contract: ${config.fallbackContract}\n`)
  })
}

/**
 * Example 3: Get specific contract addresses
 */
function example3_ContractAddresses() {
  console.log('=== Example 3: Get Contract Addresses ===\n')
  
  const polygonBadge = getBadgeContract('polygon')
  const ethereumQuest = getQuestContract('ethereum')
  const arbitrumFallback = getFallbackContract('arbitrum')
  
  console.log(`Polygon Badge Contract: ${polygonBadge}`)
  console.log(`Ethereum Quest Contract: ${ethereumQuest}`)
  console.log(`Arbitrum Fallback Contract: ${arbitrumFallback}\n`)
}

/**
 * Example 4: Mint badge with default network
 */
async function example4_MintWithDefaultNetwork() {
  console.log('=== Example 4: Mint Badge with Default Network ===\n')
  
  const userId = 'user-001'
  const questId = 'quest-001'
  
  // By default, mints on Polygon
  const tx = await mintBadge(userId, questId)
  
  console.log(`Badge minted successfully!`)
  console.log(`  Transaction Hash: ${tx.txHash}`)
  console.log(`  Network: ${tx.network}`)
  console.log(`  Contract: ${tx.contractAddress}`)
  console.log(`  Chain Type: ${tx.chain}\n`)
}

/**
 * Example 5: Mint badge with specific network
 */
async function example5_MintWithSpecificNetwork() {
  console.log('=== Example 5: Mint Badge with Specific Network ===\n')
  
  const userId = 'user-002'
  const questId = 'quest-002'
  
  // Explicitly specify Ethereum
  const tx = await mintBadge(userId, questId, 'ethereum')
  
  console.log(`Badge minted on Ethereum!`)
  console.log(`  Transaction Hash: ${tx.txHash}`)
  console.log(`  Network: ${tx.network}`)
  console.log(`  Contract: ${tx.contractAddress}`)
  console.log(`  Chain Type: ${tx.chain}\n`)
}

/**
 * Example 6: Fallback minting
 */
async function example6_FallbackMinting() {
  console.log('=== Example 6: Fallback Minting ===\n')
  
  const userId = 'user-003'
  const questId = 'quest-003'
  
  // By default, fallback uses Ethereum
  const tx = await fallbackMintBadge(userId, questId)
  
  console.log(`Badge minted via fallback!`)
  console.log(`  Transaction Hash: ${tx.txHash}`)
  console.log(`  Network: ${tx.network}`)
  console.log(`  Contract: ${tx.contractAddress}`)
  console.log(`  Chain Type: ${tx.chain}\n`)
}

/**
 * Example 7: Configure custom networks
 */
async function example7_CustomNetworks() {
  console.log('=== Example 7: Configure Custom Networks ===\n')
  
  // Set Arbitrum as primary network
  setPrimaryNetwork('arbitrum')
  console.log('✅ Primary network set to Arbitrum')
  
  // Set Polygon as fallback network
  setFallbackNetwork('polygon')
  console.log('✅ Fallback network set to Polygon\n')
  
  // Mint with new configuration
  const userId = 'user-004'
  const questId = 'quest-004'
  
  const tx = await mintBadge(userId, questId)
  
  console.log(`Badge minted with custom config!`)
  console.log(`  Network: ${tx.network}`)
  console.log(`  Contract: ${tx.contractAddress}\n`)
  
  // Reset to defaults for next examples
  setPrimaryNetwork('polygon')
  setFallbackNetwork('ethereum')
}

/**
 * Example 8: QuestManager integration pattern
 */
async function example8_QuestManagerPattern() {
  console.log('=== Example 8: QuestManager Integration Pattern ===\n')
  
  // This shows how QuestManager would use the registry
  const network = 'polygon'
  const badgeContractAddress = getBadgeContract(network)
  const questContractAddress = getQuestContract(network)
  
  console.log(`QuestManager Configuration:`)
  console.log(`  Network: ${network}`)
  console.log(`  Badge Contract: ${badgeContractAddress}`)
  console.log(`  Quest Contract: ${questContractAddress}`)
  console.log(`\n  → Use these addresses for blockchain interactions\n`)
}

// Run all examples
async function runAllExamples() {
  console.log('🚀 Running Deploy Registry Examples\n')
  
  example1_LoadRegistry()
  example2_NetworkConfigs()
  example3_ContractAddresses()
  await example4_MintWithDefaultNetwork()
  await example5_MintWithSpecificNetwork()
  await example6_FallbackMinting()
  await example7_CustomNetworks()
  await example8_QuestManagerPattern()
  
  console.log('✅ All examples completed!\n')
}

runAllExamples().catch(console.error)
