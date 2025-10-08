/**
 * NFT Football Example - Demonstration
 * Shows how to use the NFT Football page with MeeBot and quest integration
 */

import { renderNFTFootballPage, displayFootballCard } from './pages/NFTFootball.js'
import { updateUserProgress } from './verifiers/questVerifier.js'

async function runFootballExamples() {
  console.log('⚽ MeeChain NFT Football - Example Demonstrations\n')

  // Example 1: Display all NFT Football cards
  console.log('\n' + '='.repeat(50))
  console.log('Example 1: Display All NFT Football Cards')
  console.log('='.repeat(50))

  const result1 = await renderNFTFootballPage({
    userId: 'user-football-001',
    enableQuestTracking: true
  })

  console.log(`\nResult: ${result1.success ? '✅ Success' : '❌ Failed'}`)
  console.log(`Message: ${result1.message}`)
  console.log(`MeeBot Sprite: ${result1.meeBotState.sprite}`)
  console.log(`MeeBot Message: ${result1.meeBotState.message}`)

  // Example 2: Display a specific NFT card
  console.log('\n' + '='.repeat(50))
  console.log('Example 2: Display Specific NFT Card')
  console.log('='.repeat(50))

  const result2 = await displayFootballCard('nft-football-001', {
    userId: 'user-football-001',
    enableQuestTracking: true
  })

  console.log(`\nResult: ${result2.success ? '✅ Success' : '❌ Failed'}`)
  console.log(`Message: ${result2.message}`)
  if (result2.meeBotState) {
    console.log(`MeeBot Sprite: ${result2.meeBotState.sprite}`)
    console.log(`MeeBot Message: ${result2.meeBotState.message}`)
  }

  // Example 3: Quest integration demonstration
  console.log('\n' + '='.repeat(50))
  console.log('Example 3: Quest Integration Demo')
  console.log('='.repeat(50))

  // Simulate user viewing NFTs for quest
  const userId = 'user-football-002'
  const questId = 'quest-nft-football-001'

  console.log(`\nSimulating quest: User ${userId} viewing NFT Football cards...`)
  
  // View collection
  await renderNFTFootballPage({
    userId,
    enableQuestTracking: true
  })

  // View individual cards
  await displayFootballCard('nft-football-002', { userId, enableQuestTracking: true })
  await displayFootballCard('nft-football-003', { userId, enableQuestTracking: true })

  console.log(`\n✅ Quest "${questId}" progress tracked for user ${userId}`)

  // Example 4: Error handling with fallback
  console.log('\n' + '='.repeat(50))
  console.log('Example 4: Fallback System Demonstration')
  console.log('='.repeat(50))

  console.log('\nAttempting to load from invalid API endpoint...')
  const result4 = await renderNFTFootballPage({
    apiEndpoint: '/api/invalid-endpoint',
    userId: 'user-football-003'
  })

  console.log(`\nFallback Result: ${result4.success ? '✅ Success (Fallback worked!)' : '❌ Failed'}`)
  console.log(`Cards loaded: ${result4.data.length}`)
  console.log(`MeeBot handled gracefully: ${result4.meeBotState.sprite}`)

  console.log('\n' + '='.repeat(50))
  console.log('✅ All NFT Football examples completed!')
  console.log('='.repeat(50) + '\n')
}

// Run examples
runFootballExamples().catch(console.error)
