/**
 * Deploy-Registry Automation Demo
 * Demonstrates the automated deployment and registry management system
 */

import { deployAllContracts } from '../scripts/utils/deployer.js'
import { updateRegistry } from '../scripts/updateRegistry.js'
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
  console.log('\n📖 Demo 1: Viewing Current Registry')
  console.log('═'.repeat(60))
  
  const registry = loadRegistry()
  
  console.log(`\nRegistry Version: ${registry.version}`)
  console.log(`Last Updated: ${registry.lastUpdated}`)
  console.log(`\nAvailable Networks:`)
  
  Object.keys(registry.networks).forEach(network => {
    const config = registry.networks[network]
    console.log(`\n  ${network.toUpperCase()}:`)
    console.log(`    Chain ID: ${config.chainId}`)
    console.log(`    Badge Contract: ${config.badgeContract}`)
    console.log(`    Quest Contract: ${config.questContract}`)
    console.log(`    Fallback Contract: ${config.fallbackContract}`)
  })
}

/**
 * Demo 2: Validate registry
 */
async function demo2_ValidateRegistry() {
  console.log('\n\n🔍 Demo 2: Registry Validation')
  console.log('═'.repeat(60))
  
  const validation = validateRegistry()
  
  console.log(`\nValidation Status: ${validation.valid ? '✅ VALID' : '❌ INVALID'}`)
  console.log(`Networks Checked: ${validation.networks.join(', ')}`)
  
  if (validation.errors.length > 0) {
    console.log(`\n❌ Errors (${validation.errors.length}):`)
    validation.errors.forEach(error => console.log(`   - ${error}`))
  }
  
  if (validation.warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${validation.warnings.length}):`)
    validation.warnings.forEach(warning => console.log(`   - ${warning}`))
  }
  
  if (validation.valid) {
    console.log(`\n✅ All checks passed!`)
  }
}

/**
 * Demo 3: Simulate deployment to a network
 */
async function demo3_SimulateDeployment() {
  console.log('\n\n🚀 Demo 3: Simulated Deployment')
  console.log('═'.repeat(60))
  
  console.log('\nDeploying test contracts (simulation mode)...')
  console.log('Network: polygon')
  
  // Note: This is a demonstration - in a real scenario, we would deploy
  console.log('\n  Step 1: Deploy Badge Contract')
  console.log('  Step 2: Deploy Quest Contract')
  console.log('  Step 3: Deploy Fallback Contract')
  console.log('  Step 4: Update Registry')
  console.log('  Step 5: Validate Deployment')
  
  console.log('\n✅ Simulated deployment complete!')
  console.log('   (Registry not modified in demo mode)')
}

/**
 * Demo 4: Badge minting with registry
 */
async function demo4_MintBadgeWithRegistry() {
  console.log('\n\n🎖️  Demo 4: Badge Minting with Registry')
  console.log('═'.repeat(60))
  
  try {
    // Mint on default network
    console.log('\nMinting badge on default network (Polygon)...')
    const tx1 = await mintBadge('demo-user-001', 'demo-quest-001')
    console.log(`✅ Badge minted successfully:`)
    console.log(`   User: ${tx1.userId}`)
    console.log(`   Quest: ${tx1.questId}`)
    console.log(`   Network: ${tx1.network}`)
    console.log(`   Contract: ${tx1.contractAddress}`)
    console.log(`   TX Hash: ${tx1.txHash}`)
    
    // Mint on specific network
    console.log('\nMinting badge on Ethereum...')
    const tx2 = await mintBadge('demo-user-002', 'demo-quest-002', 'ethereum')
    console.log(`✅ Badge minted successfully:`)
    console.log(`   User: ${tx2.userId}`)
    console.log(`   Quest: ${tx2.questId}`)
    console.log(`   Network: ${tx2.network}`)
    console.log(`   Contract: ${tx2.contractAddress}`)
    console.log(`   TX Hash: ${tx2.txHash}`)
  } catch (error) {
    console.log(`❌ Minting failed: ${error}`)
  }
}

/**
 * Demo 5: Export logs and provenance
 */
async function demo5_ExportLogs() {
  console.log('\n\n📤 Demo 5: Exporting Logs and Provenance')
  console.log('═'.repeat(60))
  
  console.log('\nExporting logs to JSON...')
  try {
    const jsonPath = exportLogsToJSON('/tmp/demo-logs.json')
    console.log(`✅ Exported to: ${jsonPath}`)
    
    // Check file size
    const stats = fs.statSync(jsonPath)
    console.log(`   File size: ${stats.size} bytes`)
  } catch (error) {
    console.log(`⚠️  Export skipped (no logs available)`)
  }
  
  console.log('\nExporting registry with provenance...')
  try {
    const provenancePath = exportRegistryWithProvenance('/tmp/demo-registry-provenance.json')
    console.log(`✅ Exported to: ${provenancePath}`)
    
    const stats = fs.statSync(provenancePath)
    console.log(`   File size: ${stats.size} bytes`)
  } catch (error) {
    console.log(`⚠️  Export skipped (no logs available)`)
  }
}

/**
 * Demo 6: Multi-chain deployment workflow
 */
async function demo6_MultiChainWorkflow() {
  console.log('\n\n🌐 Demo 6: Multi-Chain Workflow')
  console.log('═'.repeat(60))
  
  console.log('\nDemonstrating multi-chain deployment pattern:')
  console.log('\n  1. Deploy to Ethereum (mainnet)')
  console.log('     → High security, higher gas fees')
  console.log('     → Primary badge minting')
  
  console.log('\n  2. Deploy to Polygon (L2)')
  console.log('     → Lower gas fees, fast transactions')
  console.log('     → Fallback badge minting')
  
  console.log('\n  3. Deploy to Arbitrum (L2)')
  console.log('     → Alternative L2 option')
  console.log('     → Additional fallback layer')
  
  console.log('\n  4. Registry automatically manages all networks')
  console.log('     → Transparent network selection')
  console.log('     → Automatic fallback on failure')
  
  console.log('\n✅ Multi-chain architecture ready!')
}

/**
 * Demo 7: Fallback-aware deployment
 */
async function demo7_FallbackAwareness() {
  console.log('\n\n🛡️  Demo 7: Fallback-Aware Deployment')
  console.log('═'.repeat(60))
  
  console.log('\nFallback mechanism demonstration:')
  console.log('\n  Scenario: Primary network (Ethereum) is congested')
  console.log('')
  console.log('  1. Attempt primary mint on Ethereum')
  console.log('     → Gas price too high / Network congested')
  console.log('     → TX fails or times out')
  
  console.log('\n  2. Automatic fallback to Polygon')
  console.log('     → Registry provides fallback contract address')
  console.log('     → Badge minted on Polygon instead')
  console.log('     → User gets badge without delay')
  
  console.log('\n  3. Tracking and analytics')
  console.log('     → Fallback event logged')
  console.log('     → Badge metadata includes actual network')
  console.log('     → Admin can view fallback success rate')
  
  console.log('\n✅ Fallback mechanism ensures reliability!')
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
