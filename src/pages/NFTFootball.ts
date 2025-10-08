/**
 * NFT Football Page for MeeChain
 * Main page logic for displaying NFT Football collection
 * Features: Modular, fallback-aware, MeeBot integration, quest-ready
 */

import { useFootballData } from '../hooks/useFootballData.js'
import { createFootballCards } from '../components/FootballCard.js'
import { MeeBot } from '../components/MeeBot.js'
import { updateUserProgress } from '../verifiers/questVerifier.js'

export interface NFTFootballPageOptions {
  apiEndpoint?: string
  userId?: string
  enableQuestTracking?: boolean
}

/**
 * NFT Football Page - Main rendering logic
 * @param options - Configuration options for the page
 * @returns Page render result with data and MeeBot state
 */
export async function renderNFTFootballPage(options: NFTFootballPageOptions = {}) {
  const {
    apiEndpoint = '/api/football-nfts',
    userId,
    enableQuestTracking = true
  } = options

  console.log('\n🏈 NFT Football Page - Loading...\n')

  // Set loading state
  MeeBot.setSprite('loading')

  // Fetch data using hook
  const { data, loading, error } = await useFootballData(apiEndpoint)

  // Handle loading state
  if (loading) {
    MeeBot.setSprite('loading')
    return {
      success: false,
      message: 'กำลังโหลดข้อมูล NFT Football...',
      data: [],
      meeBotState: {
        sprite: MeeBot.getSprite(),
        message: MeeBot.getLastMessage()
      }
    }
  }

  // Handle error state
  if (error) {
    MeeBot.setSprite('sad')
    MeeBot.speak('เกิดข้อผิดพลาดในการโหลดข้อมูล NFT Football')
    return {
      success: false,
      message: `Error: ${error.message}`,
      data: [],
      meeBotState: {
        sprite: MeeBot.getSprite(),
        message: MeeBot.getLastMessage()
      }
    }
  }

  // Handle empty data
  if (data.length === 0) {
    MeeBot.setSprite('confused')
    MeeBot.speak('ไม่พบข้อมูล NFT Football ในระบบ')
    return {
      success: false,
      message: 'ไม่มีข้อมูล NFT Football',
      data: [],
      meeBotState: {
        sprite: MeeBot.getSprite(),
        message: MeeBot.getLastMessage()
      }
    }
  }

  // Success! Display data
  MeeBot.setSprite('excited')
  MeeBot.speak(`พบ NFT Football ${data.length} รายการ!`)

  // Create football cards
  const cards = createFootballCards(data)

  // Display cards in console
  console.log('═'.repeat(40))
  console.log(`NFT Football Collection (${data.length} items)`)
  console.log('═'.repeat(40))
  cards.forEach((card, index) => {
    console.log(`\n[${index + 1}/${cards.length}]`)
    console.log(card.renderText())
  })
  console.log('\n' + '═'.repeat(40))

  // Quest integration: Track NFT viewing
  if (enableQuestTracking && userId) {
    // Example quest: View NFT Football cards
    const questId = 'quest-nft-football-001'
    updateUserProgress(userId, questId, 'nft-football-viewed', data.length)
    console.log(`\n✅ Quest progress updated: Viewed ${data.length} NFT Football cards`)
  }

  return {
    success: true,
    message: `Successfully loaded ${data.length} NFT Football cards`,
    data: cards,
    meeBotState: {
      sprite: MeeBot.getSprite(),
      message: MeeBot.getLastMessage()
    }
  }
}

/**
 * Display individual NFT Football card
 * @param nftId - ID of the NFT to display
 * @param options - Configuration options
 */
export async function displayFootballCard(nftId: string, options: NFTFootballPageOptions = {}) {
  const { apiEndpoint = '/api/football-nfts', userId, enableQuestTracking = true } = options

  MeeBot.setSprite('loading')
  const { data } = await useFootballData(apiEndpoint)

  const nft = data.find(n => n.id === nftId)

  if (!nft) {
    MeeBot.setSprite('confused')
    MeeBot.speak(`ไม่พบ NFT Football ID: ${nftId}`)
    return {
      success: false,
      message: `NFT not found: ${nftId}`,
      data: null
    }
  }

  MeeBot.setSprite('happy')
  MeeBot.speak(`พบ NFT: ${nft.name}`)

  const card = createFootballCards([nft])[0]
  console.log('\n' + card.renderText())

  // Quest integration: Track individual card views
  if (enableQuestTracking && userId) {
    const questId = 'quest-nft-football-001'
    updateUserProgress(userId, questId, 'nft-football-detailed-view', 1)
    console.log(`\n✅ Quest progress: Viewed NFT details`)
  }

  return {
    success: true,
    message: `Displaying ${nft.name}`,
    data: card,
    meeBotState: {
      sprite: MeeBot.getSprite(),
      message: MeeBot.getLastMessage()
    }
  }
}
