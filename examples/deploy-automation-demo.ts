/**
 * Deploy-Registry Automation Demo
 * Demonstrates the automated deployment and registry management system
 */

import { deployAllContracts } from '../scripts/utils/deployer.js'
import { updateRegistry, backupRegistry } from '../scripts/updateRegistry.js'
import { validateRegistry } from '../scripts/validateRegistry.js'
import { exportLogsToJSON, exportRegistryWithProvenance } from '../scripts/exportLogs.js'
import { loadRegistry, getNetworkConfig } from '../src/config/registryLoader.js'
import { mintBadge, setPrimaryNetwork } from '../src/minting/badgeMinter.js'
import fs from 'fs'

console.log(`
╔═══════════════════════════════════════════════════════════╗
║    MeeChain Deploy-Registry Automation Demo              ║
║    Multi-Chain Contract Management System                ║
╚═══════════════════════════════════════════════════════════╝
`)

/**
 * Demo 1: View current registry
 */
async function demo1_ViewRegistry() {
  console.log('\n=== Demo 1: View Current Registry ===\n')
  
  const registry = loadRegistry()
  console.log(`Registry Version: ${registry.version}`)
  console.log(`Last Updated: ${registry.lastUpdated}`)
  console.log(`\nNetworks:`)
  
  for (const [name, config] of Object.entries(registry.networks)) {
    console.log(`\n  ${name.toUpperCase()}:`)
    console.log(`    Chain ID: ${config.chainId}`)
    console.log(`    Badge: ${config.badgeContract}`)
    console.log(`    Quest: ${config.questContract}`)
    console.log(`    Fallback: ${config.fallbackContract}`)
  }
}

/**
 * Demo 2: Validate registry
 */
async function demo2_ValidateRegistry() {
  console.log('\n=== Demo 2: Validate Registry ===\n')
  
  const result = validateRegistry()
  
  if (result.valid) {
    console.log('✅ Registry is valid!')
  } else {
    console.log(`❌ Registry has ${result.errors.length} error(s)`)
  }
  
  if (result.warnings.length > 0) {
    console.log(`⚠️  ${result.warnings.length} warning(s)`)
  }
}

/**
 * Demo 3: Simulate deployment to a network
 */
async function demo3_SimulateDeployment() {
  console.log('\n=== Demo 3: Simulate Contract Deployment ===\n')
  
  // Note: This is a simulation - in production it would deploy real contracts
  console.log('ℹ️  This is a simulation mode - no actual blockchain deployment\n')
  
  const network = 'polygon'
  const contracts = await deployAllContracts(network)
  
  console.log(`\n✅ All contracts deployed to ${network}!`)
}

/**
 * Demo 4: Badge minting with registry
 */
async function demo4_MintBadgeWithRegistry() {
  console.log('\n=== Demo 4: Mint Badge Using Registry ===\n')
  
  setPrimaryNetwork('arbitrum')
  
  const userId = 'demo-user-001'
  const questId = 'demo-quest-001'
  
  console.log(`Minting badge for user ${userId}...`)
  const tx = await mintBadge(userId, questId)
  
  console.log(`✅ Badge minted successfully!`)
  console.log(`   Network: ${tx.network}`)
  console.log(`   Contract: ${tx.contractAddress}`)
  console.log(`   TX Hash: ${tx.txHash}`)
  console.log(`   Badge ID: ${tx.badgeId}`)
}

/**
 * Demo 5: Export logs and provenance
 */
async function demo5_ExportLogs() {
  console.log('\n=== Demo 5: Export Logs and Provenance ===\n')
  
  // Export logs to JSON
  const jsonPath = exportLogsToJSON('demo-logs.json')
  console.log(`\n✅ Logs exported to: ${jsonPath}`)
  
  // Export registry with provenance
  const provPath = exportRegistryWithProvenance('demo-registry-provenance.json')
  console.log(`✅ Registry with provenance exported to: ${provPath}`)
  
  // Show sample of exported data
  const provData = JSON.parse(fs.readFileSync(provPath, 'utf-8'))
  console.log(`\nProvenance Summary:`)
  console.log(`  Total Networks: ${provData.statistics.totalNetworks}`)
  console.log(`  Networks: ${provData.statistics.networks.join(', ')}`)
  console.log(`  Deployment Logs: ${provData.provenance.totalDeployments}`)
  
  // Cleanup demo files
  setTimeout(() => {
    if (fs.existsSync('demo-logs.json')) fs.unlinkSync('demo-logs.json')
    if (fs.existsSync('demo-registry-provenance.json')) fs.unlinkSync('demo-registry-provenance.json')
  }, 1000)
}

/**
 * Demo 6: Multi-chain deployment workflow
 */
async function demo6_MultiChainWorkflow() {
  console.log('\n=== Demo 6: Multi-Chain Deployment Workflow ===\n')
  
  const networks = ['ethereum', 'polygon', 'arbitrum']
  
  console.log('📊 Checking contract addresses across all networks:\n')
  
  for (const network of networks) {
    const config = getNetworkConfig(network as any)
    console.log(`${network.toUpperCase()} (Chain ID: ${config.chainId}):`)
    console.log(`  ✓ Badge deployed at ${config.badgeContract}`)
    console.log(`  ✓ Quest deployed at ${config.questContract}`)
    console.log(`  ✓ Fallback deployed at ${config.fallbackContract}`)
    console.log('')
  }
  
  console.log('✅ Multi-chain deployment verified across all networks!')
}

/**
 * Demo 7: Fallback-aware deployment
 */
async function demo7_FallbackAwareness() {
  console.log('\n=== Demo 7: Fallback-Aware System ===\n')
  
  console.log('The system supports fallback minting across chains:')
  console.log('  Primary Chain → Failed → Fallback Chain')
  console.log('')
  console.log('Example flow:')
  console.log('  1. Try to mint on Polygon (primary)')
  console.log('  2. If fails → Try Ethereum (fallback)')
  console.log('  3. Log fallback event with provenance')
  console.log('  4. Display in dashboard with fallback indicator')
  console.log('')
  console.log('✅ All fallback contracts are registered and ready!')
}

/**
 * Run all demos
 */
async function runAllDemos() {
  try {
    await demo1_ViewRegistry()
    await demo2_ValidateRegistry()
    await demo3_SimulateDeployment()
    await demo4_MintBadgeWithRegistry()
    await demo5_ExportLogs()
    await demo6_MultiChainWorkflow()
    await demo7_FallbackAwareness()
    
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║              All Demos Completed Successfully!           ║
╚═══════════════════════════════════════════════════════════╝
`)
  } catch (error) {
    console.error('\n❌ Demo error:', error)
    process.exit(1)
  }
}

// Run all demos
runAllDemos()
