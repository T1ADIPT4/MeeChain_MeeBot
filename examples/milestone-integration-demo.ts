/**
 * Milestone Integration Demo
 * Demonstrates how to use milestone tracking with MeeBot sprite feedback
 */

import { MeeBot } from '../components/MeeBot.js'
import {
  readMilestoneLog,
  getLatestMilestone,
  getCompletedMilestones,
  getMilestoneProgress,
  appendToMilestoneLog,
  isMilestoneCompleted,
  parseMilestoneFromCommit,
  getMilestoneMessageFromCommit
} from '../utils/milestoneReader.js'

console.log('🎯 MeeChain Milestone Integration Demo\n')
console.log('=' .repeat(60))

// Demo 1: Reading milestone log
console.log('\n📋 Demo 1: Reading Milestone Log')
console.log('-'.repeat(60))

const logs = readMilestoneLog()
if (logs.length > 0) {
  console.log(`Found ${logs.length} milestone entries:`)
  logs.forEach(log => console.log(`  ${log}`))
} else {
  console.log('No milestone.log found - starting fresh!')
}

// Demo 2: Get milestone progress
console.log('\n📊 Demo 2: Milestone Progress')
console.log('-'.repeat(60))

const progress = getMilestoneProgress()
console.log(`Completed: ${progress.completed}/${progress.total} (${progress.percentage}%)`)

const milestones = ['M1', 'M2', 'M3', 'M4', 'M5']
milestones.forEach(m => {
  const completed = isMilestoneCompleted(m)
  console.log(`  ${completed ? '✅' : '⏳'} ${m}`)
})

// Demo 3: Simulating milestone completion
console.log('\n🚀 Demo 3: Simulating Milestone Completion')
console.log('-'.repeat(60))

// Simulate M1 completion
if (!isMilestoneCompleted('M1')) {
  console.log('\n🟢 Completing M1: Deploy Dashboard')
  appendToMilestoneLog('M1', 'Deploy dashboard online!')
  MeeBot.milestoneFeedback('M1')
  console.log('Status: M1 marked as complete')
}

// Simulate M2 completion
if (!isMilestoneCompleted('M2')) {
  console.log('\n🟣 Completing M2: NFT Minting Pipeline')
  appendToMilestoneLog('M2', 'Minting pipeline ready!')
  MeeBot.milestoneFeedback('M2')
  console.log('Status: M2 marked as complete')
}

// Demo 4: Checking latest milestone
console.log('\n🔍 Demo 4: Latest Milestone')
console.log('-'.repeat(60))

const latest = getLatestMilestone()
if (latest) {
  console.log(`Latest: ${latest}`)
  
  // Trigger MeeBot feedback for latest
  const completed = getCompletedMilestones()
  if (completed.length > 0) {
    const lastMilestone = completed[completed.length - 1]
    console.log(`\nMeeBot reacting to ${lastMilestone.milestoneId}...`)
    MeeBot.milestoneFeedback(lastMilestone.milestoneId, lastMilestone.message)
  }
} else {
  console.log('No milestones completed yet')
}

// Demo 5: Parsing commit messages
console.log('\n💬 Demo 5: Parsing Git Commit Messages')
console.log('-'.repeat(60))

const sampleCommits = [
  'M1: Add deploy dashboard with fallback viewer',
  'M2: Implement NFT minting pipeline',
  'M3: Integrate sprite feedback system',
  'fix: Resolve badge minting issue',
  'M4: Complete fallback validation tests',
  'docs: Update README with milestone info'
]

sampleCommits.forEach(commit => {
  const milestoneId = parseMilestoneFromCommit(commit)
  if (milestoneId) {
    const message = getMilestoneMessageFromCommit(commit)
    console.log(`✅ ${commit}`)
    console.log(`   → Milestone: ${milestoneId}, Message: "${message}"`)
    
    // Trigger sprite feedback
    MeeBot.milestoneFeedback(milestoneId, message || undefined)
  } else {
    console.log(`⚪ ${commit} (no milestone marker)`)
  }
})

// Demo 6: All milestone sprites
console.log('\n🎨 Demo 6: All MeeBot Milestone Sprites')
console.log('-'.repeat(60))

const allMilestones = [
  { id: 'M1', name: 'Deploy Dashboard', message: 'Deploy dashboard online!' },
  { id: 'M2', name: 'Minting Pipeline', message: 'Minting pipeline ready!' },
  { id: 'M3', name: 'Sprite Integration', message: 'Milestone linked!' },
  { id: 'M4', name: 'Fallback Validation', message: 'Fallback validated!' },
  { id: 'M5', name: 'Production Release', message: 'Production ready!' }
]

console.log('\nDemonstrating all milestone sprite feedback:\n')
allMilestones.forEach((milestone, index) => {
  setTimeout(() => {
    console.log(`\n${index + 1}. ${milestone.id}: ${milestone.name}`)
    MeeBot.milestoneFeedback(milestone.id, milestone.message)
  }, index * 1000) // Stagger by 1 second each
})

// Demo 7: Progress summary
setTimeout(() => {
  console.log('\n📈 Demo 7: Final Progress Summary')
  console.log('-'.repeat(60))
  
  const finalProgress = getMilestoneProgress()
  const completedList = getCompletedMilestones()
  
  console.log(`\nTotal Progress: ${finalProgress.completed}/${finalProgress.total} milestones`)
  console.log(`Completion Rate: ${finalProgress.percentage}%`)
  
  if (completedList.length > 0) {
    console.log('\nCompleted Milestones:')
    completedList.forEach(m => {
      console.log(`  ${m.color} ${m.milestoneId}: ${m.message}`)
    })
  }
  
  if (finalProgress.percentage === 100) {
    console.log('\n🎉 All milestones completed! Project is production ready!')
    MeeBot.milestoneFeedback('M5', 'Production ready! 🚀')
  } else {
    const remaining = 5 - finalProgress.completed
    console.log(`\n⏳ ${remaining} milestone${remaining > 1 ? 's' : ''} remaining`)
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('✨ Demo Complete! Check milestone.log for entries.')
  console.log('='.repeat(60))
}, 6000) // After all sprites have shown
