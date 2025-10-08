// tracker/RewardTracker.ts

import { RewardEntry } from './RewardTypes.js'

const rewardLog: RewardEntry[] = []

export function trackReward(entry: RewardEntry) {
  rewardLog.push(entry)
  console.log('🎖️ Reward tracked:', entry)
}

export function getUserRewards(userId: string): RewardEntry[] {
  return rewardLog.filter(r => r.userId === userId)
}

export function getAllRewards(): RewardEntry[] {
  return [...rewardLog]
}
