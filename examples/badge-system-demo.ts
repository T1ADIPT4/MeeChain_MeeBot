/**
 * Badge System Demo
 * Demonstrates the complete Badge System with NFT/SBT integration
 */

import {
  getContributorProfile,
  recordAction,
  recordAuditLog,
  linkSBTToken,
  getLeaderboard,
  getBadgeDefinitions,
  type ContributorAction
} from '../src/services/contributorReputationService.js'

import {
  mintBadgeNFT,
  onBadgeUnlocked
} from '../src/services/badgeMintingService.js'

import {
  generateWatchdogMetadata,
  metadataToJSON
} from '../src/utils/badgeMetadataGenerator.js'

console.log('🎯 Badge System Demo\n')
console.log('='.repeat(60))

// Demo user addresses
const users = {
  alice: '0xAlice1234567890123456789012345678901234',
  bob: '0xBob1234567890123456789012345678901234567',
  charlie: '0xCharlie1234567890123456789012345678'
}

async function runDemo() {
  console.log('\n📋 Step 1: Show available badges')
  console.log('='.repeat(60))
  const badges = getBadgeDefinitions()
  badges.forEach(badge => {
    console.log(`${badge.name}`)
    console.log(`  Description: ${badge.description}`)
    console.log(`  Requirement: ${badge.requirement.type} x ${badge.requirement.count}`)
    console.log()
  })

  console.log('\n👤 Step 2: Alice records refund flag actions')
  console.log('='.repeat(60))
  
  // Alice flags 5 refund logs
  for (let i = 1; i <= 5; i++) {
    const action: ContributorAction = {
      type: 'refund_flag',
      refundId: `refund-00${i}`,
      timestamp: new Date(),
      valid: true
    }
    
    const result = await recordAction(users.alice, action)
    console.log(`Action ${i}: Flagged ${action.refundId}`)
    console.log(`  Score: ${result.newScore}`)
    
    if (result.badgesUnlocked.length > 0) {
      console.log(`  🎉 Badge Unlocked: ${result.badgesUnlocked[0].name}`)
    }
  }

  console.log('\n📝 Step 3: Bob creates DAO proposals')
  console.log('='.repeat(60))
  
  // Bob creates 3 proposals
  for (let i = 1; i <= 3; i++) {
    const action: ContributorAction = {
      type: 'proposal_create',
      proposalId: `proposal-00${i}`,
      timestamp: new Date(),
      valid: true
    }
    
    const result = await recordAction(users.bob, action)
    console.log(`Proposal ${i}: Created ${action.proposalId}`)
    console.log(`  Score: ${result.newScore}`)
    
    if (result.badgesUnlocked.length > 0) {
      console.log(`  🎉 Badge Unlocked: ${result.badgesUnlocked[0].name}`)
    }
  }

  console.log('\n🔍 Step 4: Charlie completes audits')
  console.log('='.repeat(60))
  
  // Charlie completes 10 audits
  for (let i = 1; i <= 10; i++) {
    const action: ContributorAction = {
      type: 'audit_complete',
      refundId: `audit-00${i}`,
      timestamp: new Date(),
      valid: true
    }
    
    const result = await recordAction(users.charlie, action)
    
    // Also record audit log
    recordAuditLog(
      users.charlie,
      `refund-${i}`,
      'approved',
      'Transaction verified and approved'
    )
    
    if (i === 10) {
      console.log(`Completed ${i} audits`)
      console.log(`  Score: ${result.newScore}`)
      if (result.badgesUnlocked.length > 0) {
        console.log(`  🎉 Badge Unlocked: ${result.badgesUnlocked[0].name}`)
      }
    }
  }

  console.log('\n🏅 Step 5: View contributor profiles')
  console.log('='.repeat(60))
  
  const aliceProfile = getContributorProfile(users.alice)
  console.log(`\nAlice (${users.alice})`)
  console.log(`  Score: ${aliceProfile.score}`)
  console.log(`  Badges: ${aliceProfile.badges.map(b => b.name).join(', ')}`)
  console.log(`  Actions: ${aliceProfile.actions.length}`)

  const bobProfile = getContributorProfile(users.bob)
  console.log(`\nBob (${users.bob})`)
  console.log(`  Score: ${bobProfile.score}`)
  console.log(`  Badges: ${bobProfile.badges.map(b => b.name).join(', ')}`)
  console.log(`  Actions: ${bobProfile.actions.length}`)

  const charlieProfile = getContributorProfile(users.charlie)
  console.log(`\nCharlie (${users.charlie})`)
  console.log(`  Score: ${charlieProfile.score}`)
  console.log(`  Badges: ${charlieProfile.badges.map(b => b.name).join(', ')}`)
  console.log(`  Actions: ${charlieProfile.actions.length}`)
  console.log(`  Audit Logs: ${charlieProfile.auditLogs.length}`)

  console.log('\n🏆 Step 6: View Leaderboard')
  console.log('='.repeat(60))
  
  const leaderboard = getLeaderboard(3)
  leaderboard.forEach((profile, index) => {
    console.log(`\n${index + 1}. ${profile.address}`)
    console.log(`   Score: ${profile.score}`)
    console.log(`   Badges: ${profile.badges.length}`)
  })

  console.log('\n🎨 Step 7: Generate Badge Metadata')
  console.log('='.repeat(60))
  
  const watchdogMetadata = generateWatchdogMetadata(users.alice, 5)
  console.log('\nWatchdog Badge Metadata:')
  console.log(metadataToJSON(watchdogMetadata))

  console.log('\n🪙 Step 8: Mint Badge NFT for Alice')
  console.log('='.repeat(60))
  
  const mintResult = await mintBadgeNFT({
    contributorAddress: users.alice,
    badgeType: 'watchdog',
    badgeName: '🛡️ Watchdog',
    description: 'Awarded for flagging 5 valid refund logs',
    actionCount: 5
  })

  if (mintResult.success) {
    console.log('\n✅ Badge NFT Minted Successfully!')
    console.log(`  Token ID: ${mintResult.tokenId}`)
    console.log(`  TX Hash: ${mintResult.txHash}`)
    console.log(`  Metadata URI: ipfs://${mintResult.metadataURI}`)
  } else {
    console.log(`\n❌ Minting Failed: ${mintResult.error}`)
  }

  console.log('\n📦 Step 9: View Alice\'s SBT Tokens')
  console.log('='.repeat(60))
  
  const updatedAliceProfile = getContributorProfile(users.alice)
  console.log(`\nSBT Tokens: ${updatedAliceProfile.sbtTokens.length}`)
  updatedAliceProfile.sbtTokens.forEach(token => {
    console.log(`  - ${token.name}`)
    console.log(`    Token ID: ${token.tokenId}`)
    console.log(`    Contract: ${token.contractAddress}`)
    console.log(`    Metadata: ${token.metadataURI}`)
  })

  console.log('\n🔄 Step 10: Demonstrate automatic badge unlock & mint')
  console.log('='.repeat(60))
  
  // Create a new user
  const diana = '0xDiana1234567890123456789012345678901'
  console.log(`\nDiana completes 5 disputes...`)
  
  for (let i = 1; i <= 5; i++) {
    const action: ContributorAction = {
      type: 'dispute_resolve',
      refundId: `dispute-00${i}`,
      timestamp: new Date(),
      valid: true
    }
    
    const result = await recordAction(diana, action)
    
    // Automatically mint NFT when badge is unlocked
    if (result.badgesUnlocked.length > 0) {
      const badge = result.badgesUnlocked[0]
      console.log(`\n🎉 Badge Unlocked: ${badge.name}`)
      console.log(`  Automatically minting NFT...`)
      
      await onBadgeUnlocked(
        diana,
        badge.id,
        badge.name,
        badge.description,
        result.newScore
      )
    }
  }

  const dianaProfile = getContributorProfile(diana)
  console.log(`\nDiana's Profile:`)
  console.log(`  Score: ${dianaProfile.score}`)
  console.log(`  Badges: ${dianaProfile.badges.length}`)
  console.log(`  SBT Tokens: ${dianaProfile.sbtTokens.length}`)

  console.log('\n✨ Demo Complete!')
  console.log('='.repeat(60))
  console.log('\n📊 Final Statistics:')
  console.log(`  Total Contributors: ${getLeaderboard(100).length}`)
  console.log(`  Total Badge Types: ${badges.length}`)
  console.log(`  Total Actions Recorded: ${
    [users.alice, users.bob, users.charlie, diana]
      .map(addr => getContributorProfile(addr).actions.length)
      .reduce((a, b) => a + b, 0)
  }`)
}

// Run the demo
runDemo().catch(console.error)
