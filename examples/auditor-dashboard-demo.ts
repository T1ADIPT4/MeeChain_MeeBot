/**
 * Auditor Dashboard Demo
 * Demonstrates the complete Auditor Dashboard with Reputation and Badge System
 */

import { initializeMockData, getSampleAuditors } from '../utils/auditorMockData.js'
import { getRefundLogs, submitFlag, validateFlag, completeReview } from '../src/services/auditorService.js'
import { getReputation, updateReputation } from '../src/services/reputationService.js'
import { getUserBadges, getBadgeProgress, BADGE_RULES } from '../src/services/badgeService.js'

console.log('🎯 Auditor Dashboard with Reputation & Badge System Demo\n')
console.log('=' .repeat(70))

async function runDemo() {
  // Initialize mock data
  console.log('\n📊 Step 1: Initializing Mock Data')
  console.log('-'.repeat(70))
  await initializeMockData()

  // Get sample auditor
  const auditors = getSampleAuditors()
  const auditor = auditors[0]
  console.log(`\n👤 Auditor: ${auditor}`)

  // Show refund logs
  console.log('\n📋 Step 2: View Refund Logs')
  console.log('-'.repeat(70))
  const logs = getRefundLogs()
  console.log(`Total refund logs: ${logs.length}`)
  logs.forEach((log, i) => {
    console.log(`  ${i + 1}. ${log.requester.slice(0, 10)}... - ${log.status} - ${log.confirmationTime.toLocaleDateString()}`)
    if (log.flagged) {
      console.log(`     🚩 Flagged: ${log.flagReason}`)
    }
  })

  // Show auditor reputation
  console.log('\n🏆 Step 3: Auditor Reputation')
  console.log('-'.repeat(70))
  const reputation = getReputation(auditor)
  console.log(`Score: ${reputation.score}`)
  console.log(`Flags: ${reputation.flags}`)
  console.log(`Reviews: ${reputation.reviews}`)
  console.log(`Last Updated: ${reputation.lastUpdated.toLocaleString()}`)

  // Show badges
  console.log('\n🏅 Step 4: Auditor Badges')
  console.log('-'.repeat(70))
  const badges = getUserBadges(auditor)
  if (badges.length > 0) {
    console.log(`Unlocked badges: ${badges.length}`)
    badges.forEach((badge) => {
      console.log(`  ${badge.icon} ${badge.name}`)
      console.log(`     ${badge.description}`)
      console.log(`     Unlocked: ${badge.unlockedAt?.toLocaleDateString()}`)
    })
  } else {
    console.log('No badges unlocked yet')
  }

  // Show badge progress
  console.log('\n📊 Step 5: Badge Progress')
  console.log('-'.repeat(70))
  const progress = getBadgeProgress(auditor, reputation)
  progress.forEach((p) => {
    const status = p.unlocked ? '✓' : '○'
    console.log(`  ${status} ${p.rule.name} - ${p.progress}`)
  })

  // Demonstrate reputation flow
  console.log('\n🔄 Step 6: Reputation Flow Demo')
  console.log('-'.repeat(70))
  
  // Create a new refund log for demo
  const { createRefundLog } = await import('../src/services/auditorService.js')
  const newLog = createRefundLog({
    requester: '0xNewUser123456789012345678901234567890AB',
    status: 'success',
    confirmationTime: new Date(),
    refundTx: '0xnew123abc456def789012345678901234567890',
    amount: '300 MEE',
    chain: 'polygon'
  })
  console.log(`\n✅ Created new refund log: ${newLog.id}`)

  // Auditor flags the log
  console.log(`\n🚩 Auditor flags the transaction...`)
  const flag = submitFlag(
    newLog.id,
    auditor,
    'Suspicious pattern: Multiple large refunds in short time period'
  )
  console.log(`   Flag submitted at: ${flag.timestamp.toLocaleString()}`)
  console.log(`   Reason: ${flag.reason}`)

  // DAO validates the flag
  console.log(`\n✅ DAO/Core Team validates the flag...`)
  await validateFlag(newLog.id, auditor, true)
  console.log(`   Flag validated successfully`)

  // Check updated reputation
  const updatedRep = getReputation(auditor)
  console.log(`\n🏆 Updated Reputation:`)
  console.log(`   Score: ${reputation.score} → ${updatedRep.score} (+10)`)
  console.log(`   Flags: ${reputation.flags} → ${updatedRep.flags} (+1)`)

  // Check for new badges
  const updatedBadges = getUserBadges(auditor)
  const newBadges = updatedBadges.filter(
    b => !badges.find(ob => ob.id === b.id)
  )
  if (newBadges.length > 0) {
    console.log(`\n🎉 New badges unlocked:`)
    newBadges.forEach((badge) => {
      console.log(`   ${badge.icon} ${badge.name}`)
    })
  }

  // Show all available badge rules
  console.log('\n📜 Step 7: All Available Badges')
  console.log('-'.repeat(70))
  BADGE_RULES.forEach((rule) => {
    console.log(`${rule.icon} ${rule.name}`)
    console.log(`   ${rule.description}`)
  })

  // Demonstrate filters
  console.log('\n🔍 Step 8: Filter Examples')
  console.log('-'.repeat(70))
  
  const successLogs = getRefundLogs({ status: 'success' })
  console.log(`✅ Success logs: ${successLogs.length}`)
  
  const flaggedLogs = getRefundLogs({ flagged: true })
  console.log(`🚩 Flagged logs: ${flaggedLogs.length}`)

  // Summary
  console.log('\n' + '='.repeat(70))
  console.log('✨ Demo Complete!\n')
  console.log('The Auditor Dashboard includes:')
  console.log('  ✓ Refund transaction log tracking')
  console.log('  ✓ Flag submission system')
  console.log('  ✓ Reputation scoring')
  console.log('  ✓ Badge unlock system')
  console.log('  ✓ Progress tracking')
  console.log('  ✓ Filter and search capabilities')
  console.log('\n🎯 Integration Points:')
  console.log('  • React components ready in /components')
  console.log('  • Services ready in /src/services')
  console.log('  • Types defined in /src/types')
  console.log('  • Mock data in /utils')
  console.log('\n📚 Next Steps:')
  console.log('  1. Integrate with existing dashboard')
  console.log('  2. Connect to real database (MongoDB/Firebase)')
  console.log('  3. Add authentication/authorization')
  console.log('  4. Connect to DAO voting system')
  console.log('  5. Add real-time updates')
}

runDemo().catch(console.error)
