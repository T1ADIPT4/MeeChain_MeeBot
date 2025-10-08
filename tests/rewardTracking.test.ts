/**
 * Reward Tracking System Test Suite
 * Tests for reward tracking, dashboard, and export functionality
 */

import { handleQuestCompletion } from '../src/QuestManager'
import { updateTTSProgress } from '../src/verifiers/TTSQuestVerifier'
import { 
  trackReward, 
  getUserRewards, 
  getAllRewards 
} from '../tracker/RewardTracker'
import { exportRewardLog } from '../tracker/RewardExporter'
import { 
  setPrimaryMintingStatus, 
  setFallbackMintingStatus 
} from '../src/minting/badgeMinter'
import { clearLogs } from '../src/utils/logger'
import fs from 'fs'

describe('Reward Tracking System', () => {
  beforeEach(() => {
    clearLogs()
    setPrimaryMintingStatus(true)
    setFallbackMintingStatus(true)
  })

  describe('RewardTracker', () => {
    test('should track reward entry correctly', () => {
      const entry = {
        userId: 'user1',
        questId: 'quest-001',
        badgeId: 'badge-quest-001',
        timestamp: Date.now(),
        fallbackUsed: false
      }

      trackReward(entry)
      const userRewards = getUserRewards('user1')

      expect(userRewards.length).toBeGreaterThan(0)
      const lastReward = userRewards[userRewards.length - 1]
      expect(lastReward.userId).toBe('user1')
      expect(lastReward.questId).toBe('quest-001')
      expect(lastReward.badgeId).toBe('badge-quest-001')
      expect(lastReward.fallbackUsed).toBe(false)
    })

    test('should track multiple rewards for different users', () => {
      trackReward({
        userId: 'user1',
        questId: 'quest-001',
        badgeId: 'badge-quest-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      trackReward({
        userId: 'user2',
        questId: 'quest-002',
        badgeId: 'badge-quest-002',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      const user1Rewards = getUserRewards('user1')
      const user2Rewards = getUserRewards('user2')

      expect(user1Rewards.length).toBeGreaterThan(0)
      expect(user2Rewards.length).toBeGreaterThan(0)
      expect(user1Rewards[user1Rewards.length - 1].userId).toBe('user1')
      expect(user2Rewards[user2Rewards.length - 1].userId).toBe('user2')
    })

    test('should filter rewards by userId', () => {
      trackReward({
        userId: 'user1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      trackReward({
        userId: 'user1',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      trackReward({
        userId: 'user2',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      const user1Rewards = getUserRewards('user1')
      const filteredForUser1 = user1Rewards.filter(r => r.userId === 'user1')
      
      expect(filteredForUser1.length).toBe(user1Rewards.length)
      expect(user1Rewards.every(r => r.userId === 'user1')).toBe(true)
    })
  })

  describe('Quest Completion Integration', () => {
    test('should track reward when quest is completed successfully', async () => {
      const userId = 'reward-user-1'
      const questId = 'quest-tts-001'

      // Enable TTS to meet quest conditions
      updateTTSProgress(userId, 'tts-enabled', 1)

      const result = await handleQuestCompletion(userId, questId)

      expect(result.success).toBe(true)
      expect(result.fallback).toBeUndefined()

      const userRewards = getUserRewards(userId)
      const matchingRewards = userRewards.filter(r => 
        r.userId === userId && r.questId === questId
      )
      
      expect(matchingRewards.length).toBeGreaterThan(0)
      const reward = matchingRewards[matchingRewards.length - 1]
      expect(reward.fallbackUsed).toBe(false)
      expect(reward.badgeId).toContain('badge')
    })

    test('should track reward with fallback flag when fallback minting is used', async () => {
      const userId = 'reward-user-2'
      const questId = 'quest-tts-001'

      // Enable TTS to meet quest conditions
      updateTTSProgress(userId, 'tts-enabled', 1)

      // Simulate primary minting failure
      setPrimaryMintingStatus(false)

      const result = await handleQuestCompletion(userId, questId)

      expect(result.success).toBe(true)
      expect(result.fallback).toBe(true)

      const userRewards = getUserRewards(userId)
      const matchingRewards = userRewards.filter(r => 
        r.userId === userId && r.questId === questId
      )
      
      expect(matchingRewards.length).toBeGreaterThan(0)
      const reward = matchingRewards[matchingRewards.length - 1]
      expect(reward.fallbackUsed).toBe(true)
      expect(reward.badgeId).toContain('fallback')
    })

    test('should not track reward when quest completion fails', async () => {
      const userId = 'reward-user-3'
      const questId = 'quest-tts-001'

      // Don't enable TTS - quest should fail
      const initialRewardsCount = getUserRewards(userId).length

      const result = await handleQuestCompletion(userId, questId)

      expect(result.success).toBe(false)

      const finalRewardsCount = getUserRewards(userId).length
      expect(finalRewardsCount).toBe(initialRewardsCount)
    })
  })

  describe('RewardExporter', () => {
    test('should export reward log to JSON file', async () => {
      const testFilePath = '/tmp/test-reward-log.json'

      // Create some test rewards
      trackReward({
        userId: 'export-user-1',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      trackReward({
        userId: 'export-user-2',
        questId: 'quest-002',
        badgeId: 'badge-002',
        timestamp: Date.now(),
        fallbackUsed: true
      })

      // Export to file
      exportRewardLog(testFilePath)

      // Verify file exists and contains correct data
      expect(fs.existsSync(testFilePath)).toBe(true)

      const fileContent = fs.readFileSync(testFilePath, 'utf-8')
      const exportedData = JSON.parse(fileContent)

      expect(Array.isArray(exportedData)).toBe(true)
      expect(exportedData.length).toBeGreaterThan(0)

      // Verify structure
      const hasExportUser1 = exportedData.some((r: any) => r.userId === 'export-user-1')
      const hasExportUser2 = exportedData.some((r: any) => r.userId === 'export-user-2')
      
      expect(hasExportUser1 || hasExportUser2).toBe(true)

      // Cleanup
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath)
      }
    })

    test('should export all rewards from getAllRewards', () => {
      const before = getAllRewards().length

      trackReward({
        userId: 'test-user',
        questId: 'quest-001',
        badgeId: 'badge-001',
        timestamp: Date.now(),
        fallbackUsed: false
      })

      const after = getAllRewards().length
      expect(after).toBeGreaterThan(before)
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty userId query', () => {
      const rewards = getUserRewards('')
      expect(Array.isArray(rewards)).toBe(true)
    })

    test('should handle non-existent userId query', () => {
      const rewards = getUserRewards('non-existent-user-12345')
      expect(Array.isArray(rewards)).toBe(true)
    })

    test('should return copy of rewards array from getAllRewards', () => {
      const rewards1 = getAllRewards()
      const rewards2 = getAllRewards()
      
      // Should be different array instances
      expect(rewards1).not.toBe(rewards2)
      
      // But should have the same length
      expect(rewards1.length).toBe(rewards2.length)
    })
  })
})
