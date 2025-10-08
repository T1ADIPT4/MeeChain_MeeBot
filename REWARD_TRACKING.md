# Reward Tracking System Documentation

## Overview

The Reward Tracking System provides a comprehensive solution for tracking, displaying, and exporting badge rewards in the MeeChain quest system. It automatically records when users earn badges, whether through normal or fallback minting, and provides tools for analytics and reporting.

## 📁 File Structure

```
tracker/
  RewardTypes.ts          ← Type definitions for reward entries
  RewardTracker.ts        ← Core tracking functionality (log storage & retrieval)
  RewardDashboard.tsx     ← React component for displaying user badges
  RewardExporter.ts       ← Export reward logs to JSON files
```

## 🧩 Components

### 1. RewardTypes.ts - Type Definitions

Defines the structure of a reward entry:

```typescript
export type RewardEntry = {
  userId: string          // User who earned the badge
  questId: string         // Quest that was completed
  badgeId: string         // Unique badge identifier
  timestamp: number       // Unix timestamp (milliseconds)
  fallbackUsed: boolean   // Whether fallback minting was used
}
```

### 2. RewardTracker.ts - Core Tracking

Main tracking functionality with three key functions:

#### `trackReward(entry: RewardEntry): void`
Records a new reward entry in the log.

```typescript
import { trackReward } from './tracker/RewardTracker'

trackReward({
  userId: 'user123',
  questId: 'quest-tts-001',
  badgeId: 'badge-tts-001',
  timestamp: Date.now(),
  fallbackUsed: false
})
```

#### `getUserRewards(userId: string): RewardEntry[]`
Retrieves all rewards for a specific user.

```typescript
import { getUserRewards } from './tracker/RewardTracker'

const userRewards = getUserRewards('user123')
console.log(`User has ${userRewards.length} badges`)
```

#### `getAllRewards(): RewardEntry[]`
Returns a copy of all tracked rewards in the system.

```typescript
import { getAllRewards } from './tracker/RewardTracker'

const allRewards = getAllRewards()
const fallbackCount = allRewards.filter(r => r.fallbackUsed).length
```

### 3. RewardDashboard.tsx - UI Component

React component that displays a user's badges with MeeBot feedback.

```tsx
import { RewardDashboard } from './tracker/RewardDashboard'

// In your app
<RewardDashboard userId="user123" />
```

**Features:**
- Shows total badge count
- Lists all badges with quest ID, badge ID, timestamp, and minting method
- MeeBot provides encouraging feedback
- Uses 'proud' sprite and congratulatory message

**Output format:**
```
🎖️ Badge ที่คุณได้รับ

• เควส: quest-tts-001 | Badge: badge-tts-001 | เวลา: 10/8/2025, 7:00:00 PM | 🚀 ปกติ
• เควส: quest-001 | Badge: badge-001-fallback | เวลา: 10/8/2025, 7:30:00 PM | ✅ fallback
```

### 4. RewardExporter.ts - Export Functionality

Exports reward logs to JSON files for backup, audit, or analytics.

```typescript
import { exportRewardLog } from './tracker/RewardExporter'

// Export to default location (./reward-log.json)
exportRewardLog()

// Export to custom path
exportRewardLog('./logs/rewards-2025-10-08.json')
```

**Output format:**
```json
[
  {
    "userId": "user123",
    "questId": "quest-tts-001",
    "badgeId": "badge-tts-001",
    "timestamp": 1759950260566,
    "fallbackUsed": false
  },
  {
    "userId": "user456",
    "questId": "quest-001",
    "badgeId": "badge-001-fallback",
    "timestamp": 1759950260820,
    "fallbackUsed": true
  }
]
```

## 🔌 Integration

The reward tracking system is automatically integrated into `QuestManager.ts`. When a quest is completed successfully:

1. **Normal Minting**: Tracked with `fallbackUsed: false`
2. **Fallback Minting**: Tracked with `fallbackUsed: true`
3. **Failed Quests**: Not tracked

**Integration code in QuestManager:**

```typescript
import { trackReward } from '../tracker/RewardTracker.js'

// After successful badge minting
trackReward({
  userId,
  questId,
  badgeId: badgeTx.badgeId,
  timestamp: badgeTx.timestamp.getTime(),
  fallbackUsed: false  // or true for fallback
})
```

## 🛠️ Usage Examples

### Example 1: Track a reward when quest completes
```typescript
import { handleQuestCompletion } from './src/QuestManager'
import { getUserRewards } from './tracker/RewardTracker'

// Complete quest (tracking happens automatically)
const result = await handleQuestCompletion('user123', 'quest-tts-001')

// Check user's rewards
const rewards = getUserRewards('user123')
console.log(`User earned ${rewards.length} badges`)
```

### Example 2: Build a leaderboard
```typescript
import { getAllRewards } from './tracker/RewardTracker'

const allRewards = getAllRewards()

// Group by user
const userStats = new Map()
allRewards.forEach(reward => {
  const count = userStats.get(reward.userId) || 0
  userStats.set(reward.userId, count + 1)
})

// Sort by badge count
const leaderboard = Array.from(userStats.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)

console.log('🏆 Top 10 Badge Earners:')
leaderboard.forEach(([userId, count], index) => {
  console.log(`${index + 1}. ${userId}: ${count} badges`)
})
```

### Example 3: Analytics dashboard
```typescript
import { getAllRewards } from './tracker/RewardTracker'

const allRewards = getAllRewards()

const stats = {
  total: allRewards.length,
  normalMinting: allRewards.filter(r => !r.fallbackUsed).length,
  fallbackMinting: allRewards.filter(r => r.fallbackUsed).length,
  uniqueUsers: new Set(allRewards.map(r => r.userId)).size,
  uniqueQuests: new Set(allRewards.map(r => r.questId)).size
}

console.log('📊 System Analytics:')
console.log(`Total badges minted: ${stats.total}`)
console.log(`Normal minting: ${stats.normalMinting} (${(stats.normalMinting/stats.total*100).toFixed(1)}%)`)
console.log(`Fallback minting: ${stats.fallbackMinting} (${(stats.fallbackMinting/stats.total*100).toFixed(1)}%)`)
console.log(`Active users: ${stats.uniqueUsers}`)
console.log(`Active quests: ${stats.uniqueQuests}`)
```

### Example 4: Daily backup
```typescript
import { exportRewardLog } from './tracker/RewardExporter'

// Daily backup script
const date = new Date().toISOString().split('T')[0]
const backupPath = `./backups/rewards-${date}.json`

exportRewardLog(backupPath)
console.log(`✅ Daily backup saved to ${backupPath}`)
```

### Example 5: Filter rewards by criteria
```typescript
import { getAllRewards } from './tracker/RewardTracker'

const allRewards = getAllRewards()

// Get rewards from last 24 hours
const yesterday = Date.now() - (24 * 60 * 60 * 1000)
const recentRewards = allRewards.filter(r => r.timestamp > yesterday)

// Get rewards for specific quest
const ttsRewards = allRewards.filter(r => r.questId === 'quest-tts-001')

// Get fallback-only rewards
const fallbackRewards = allRewards.filter(r => r.fallbackUsed)

console.log(`Recent (24h): ${recentRewards.length}`)
console.log(`TTS Quest: ${ttsRewards.length}`)
console.log(`Fallback: ${fallbackRewards.length}`)
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run reward tracking tests only
npm test tests/rewardTracking.test.ts
```

**Test coverage includes:**
- ✅ Tracking reward entries
- ✅ Filtering by user ID
- ✅ Integration with quest completion
- ✅ Fallback flag tracking
- ✅ Export to JSON
- ✅ Edge cases (empty queries, non-existent users)

## 🎬 Demo

Run the interactive demo to see the reward tracking system in action:

```bash
npm run demo:reward-tracking
```

**The demo showcases:**
1. Normal quest completion and reward tracking
2. Fallback minting with reward tracking
3. Multiple users earning badges
4. Export functionality
5. Dashboard-style analytics

## 🎯 Future Extensions

| Feature | Description | Integration Point |
|---------|-------------|------------------|
| **Persistence** | Save rewards to database (Supabase, Firebase) | Replace in-memory `rewardLog` array |
| **NFT Integration** | Link badge IDs to actual NFT tokens | Add `nftTokenId` to `RewardEntry` |
| **Leaderboard UI** | Visual leaderboard component | New `RewardLeaderboard.tsx` component |
| **Analytics** | Send data to analytics platform | Call analytics API in `trackReward()` |
| **Notifications** | Push notifications for badges | Integrate notification service |
| **Social Sharing** | Share badge achievements | Add sharing buttons to dashboard |
| **Badge Rarity** | Track rare/special badges | Add `rarity` field to `RewardEntry` |
| **Achievements** | Milestone badges (10 badges, etc.) | Check count in `trackReward()` |

## 📦 API Reference

### RewardTracker

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `trackReward` | `entry: RewardEntry` | `void` | Add reward to log |
| `getUserRewards` | `userId: string` | `RewardEntry[]` | Get user's rewards |
| `getAllRewards` | None | `RewardEntry[]` | Get all rewards (copy) |

### RewardExporter

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `exportRewardLog` | `path?: string` | `void` | Export to JSON file |

### RewardDashboard

| Component | Props | Description |
|-----------|-------|-------------|
| `RewardDashboard` | `{ userId: string }` | Display user's badges |

## 🔍 Troubleshooting

### No rewards showing up?
- Ensure quest completion was successful (`result.success === true`)
- Check that the integration is in `QuestManager.ts`
- Verify user ID matches exactly

### Export file not found?
- Check file permissions in target directory
- Verify path is writable
- Use absolute paths for custom locations

### MeeBot not speaking?
- MeeBot feedback is console-based in this version
- In production, integrate with actual TTS service
- Check console logs for MeeBot messages

## 📝 Best Practices

1. **Regular Backups**: Use `exportRewardLog()` for daily/weekly backups
2. **User Privacy**: Consider GDPR compliance when storing user data
3. **Performance**: For large datasets, consider pagination in `getUserRewards()`
4. **Validation**: Validate badge IDs match your quest system
5. **Monitoring**: Track fallback usage rate to identify primary chain issues

## 🤝 Contributing

When extending the reward tracking system:

1. Add new fields to `RewardEntry` type if needed
2. Update tests in `tests/rewardTracking.test.ts`
3. Update this documentation
4. Maintain backward compatibility with existing rewards
5. Follow the existing code style and patterns

## 📄 License

MIT - Same as MeeChain MeeBot project

---

**Questions or issues?** Check the demo (`npm run demo:reward-tracking`) or tests (`npm test`) for working examples.
