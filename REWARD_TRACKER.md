# Reward Tracker System Documentation

## 📖 Overview

The Reward Tracker system provides comprehensive tracking of badge rewards earned through quest completion. It integrates seamlessly with MeeBot for emotional feedback and includes analytics, export capabilities, and system health monitoring.

## 🏗️ Architecture

```
tracker/
├── RewardTracker.ts      - Core tracking functionality
├── RewardDashboard.tsx   - UI component for displaying rewards
└── RewardLog.ts          - Analytics and export functionality
```

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **Automatic Tracking** | Rewards are automatically tracked when quests are completed |
| **Fallback Detection** | Distinguishes between primary and fallback minting |
| **User Dashboard** | Display all badges earned by a user |
| **Analytics** | System-wide statistics and telemetry |
| **Export** | Export rewards as JSON or CSV |
| **MeeBot Integration** | Emotional feedback based on reward status |
| **System Health** | Monitor fallback rates and system stability |

---

## 📚 API Reference

### RewardTracker.ts

#### Core Functions

##### `trackReward(reward: RewardRecord): void`
Records a badge reward when a user completes a quest.

```typescript
trackReward({
  userId: 'user-123',
  questId: 'quest-tts-001',
  badgeId: 'badge-tts',
  timestamp: Date.now(),
  fallbackUsed: false,
  txHash: '0x123abc',
  chain: 'primary'
})
```

##### `getUserRewards(userId: string): RewardRecord[]`
Retrieves all rewards for a specific user.

```typescript
const rewards = getUserRewards('user-123')
console.log(`User has ${rewards.length} badges`)
```

##### `getUserRewardCount(userId: string): number`
Gets the total count of rewards for a user.

```typescript
const count = getUserRewardCount('user-123')
```

##### `getRewardsByQuest(questId: string): RewardRecord[]`
Filters rewards by quest ID.

```typescript
const ttsRewards = getRewardsByQuest('quest-tts-001')
```

##### `getPrimaryRewardsCount(): number`
Returns the count of rewards minted on the primary chain.

##### `getFallbackRewardsCount(): number`
Returns the count of rewards minted via fallback.

##### `getAllRewards(): RewardRecord[]`
Retrieves all rewards in the system.

##### `clearRewards(): void`
Clears all reward records (primarily for testing).

---

### RewardLog.ts

#### Analytics Functions

##### `getRewardStatistics(): RewardStatistics`
Generates comprehensive statistics about all rewards.

```typescript
const stats = getRewardStatistics()
console.log(`Total: ${stats.totalRewards}`)
console.log(`Fallback Rate: ${stats.fallbackPercentage}%`)
console.log(`Unique Users: ${stats.uniqueUsers}`)
```

**Returns:**
```typescript
{
  totalRewards: number
  primaryRewards: number
  fallbackRewards: number
  fallbackPercentage: number
  uniqueUsers: number
  uniqueQuests: number
  recentRewards: RewardRecord[]
}
```

##### `getUserRewardSummary(userId: string): UserSummary`
Gets a detailed summary for a specific user.

```typescript
const summary = getUserRewardSummary('user-123')
console.log(`Total Badges: ${summary.totalBadges}`)
console.log(`Quests: ${summary.questsCompleted.join(', ')}`)
```

##### `generateTelemetryReport(): TelemetryReport`
Generates a system health report with metrics.

```typescript
const report = generateTelemetryReport()
if (report.systemHealth.healthStatus === 'critical') {
  console.warn('High fallback rate detected!')
}
```

**Health Status Levels:**
- `healthy`: Fallback rate ≤ 20%
- `warning`: Fallback rate > 20% and ≤ 50%
- `critical`: Fallback rate > 50%

#### Export Functions

##### `exportRewardsAsJSON(userId?: string): string`
Exports rewards as JSON string.

```typescript
// Export all rewards
const allRewardsJson = exportRewardsAsJSON()

// Export for specific user
const userRewardsJson = exportRewardsAsJSON('user-123')
```

##### `exportRewardsAsCSV(userId?: string): string`
Exports rewards as CSV string.

```typescript
const csv = exportRewardsAsCSV('user-123')
// Save to file or send to analytics service
```

---

### RewardDashboard.tsx

#### React Components

##### `<RewardDashboard userId={string} />`
Full dashboard component displaying all user badges with MeeBot feedback.

```tsx
import { RewardDashboard } from '../tracker/RewardDashboard'

<RewardDashboard userId="user-123" />
```

**Features:**
- Lists all badges with quest details
- Shows timestamp and fallback status
- Displays transaction hash
- MeeBot provides encouraging feedback based on badge count

##### `<RewardBadgeCount userId={string} />`
Compact badge counter for smaller UI areas.

```tsx
import { RewardBadgeCount } from '../tracker/RewardDashboard'

<RewardBadgeCount userId="user-123" />
```

---

## 🔗 Integration with QuestManager

The Reward Tracker is automatically integrated into the quest completion flow:

```typescript
// In QuestManager.ts
import { trackReward } from '../tracker/RewardTracker.js'

// After successful primary minting
trackReward({
  userId,
  questId,
  badgeId: badgeTx.badgeId,
  timestamp: badgeTx.timestamp.getTime(),
  fallbackUsed: false,
  txHash: badgeTx.txHash,
  chain: badgeTx.chain
})

// After successful fallback minting
trackReward({
  userId,
  questId,
  badgeId: fallbackTx.badgeId,
  timestamp: fallbackTx.timestamp.getTime(),
  fallbackUsed: true,
  txHash: fallbackTx.txHash,
  chain: fallbackTx.chain
})
```

---

## 🎮 Usage Examples

### Example 1: Complete Quest and View Rewards

```typescript
import { handleQuestCompletion } from './src/QuestManager'
import { getUserRewards } from './tracker/RewardTracker'
import { MeeBot } from './components/MeeBot'

// Complete quest
const result = await handleQuestCompletion('user-123', 'quest-tts-001')

if (result.success) {
  // MeeBot provides feedback
  if (result.fallback) {
    MeeBot.setSprite('confused')
    MeeBot.speak('ระบบ fallback ทำงานแล้วครับ คุณยังได้รับ badge อยู่นะ')
  } else {
    MeeBot.setSprite('celebrate')
    MeeBot.speak('คุณได้รับ badge แล้ว เยี่ยมมาก!')
  }
  
  // Check user's rewards
  const rewards = getUserRewards('user-123')
  console.log(`Total badges: ${rewards.length}`)
}
```

### Example 2: Display User Dashboard

```typescript
import { getUserRewardSummary } from './tracker/RewardLog'
import { MeeBot } from './components/MeeBot'

const summary = getUserRewardSummary('user-123')

MeeBot.setSprite('proud')
MeeBot.speak(`คุณได้รับทั้งหมด ${summary.totalBadges} badge แล้วครับ เก่งมาก!`)

console.log('User Summary:')
console.log(`  Total Badges: ${summary.totalBadges}`)
console.log(`  Primary: ${summary.primaryBadges}`)
console.log(`  Fallback: ${summary.fallbackBadges}`)
console.log(`  Quests: ${summary.questsCompleted.join(', ')}`)
```

### Example 3: Monitor System Health

```typescript
import { generateTelemetryReport } from './tracker/RewardLog'
import { MeeBot } from './components/MeeBot'

const report = generateTelemetryReport()

console.log(`System Health: ${report.systemHealth.healthStatus}`)
console.log(`Fallback Rate: ${report.systemHealth.fallbackRate}%`)

if (report.systemHealth.healthStatus === 'critical') {
  MeeBot.setSprite('sad')
  MeeBot.speak('เตือน! ระบบใช้ fallback บ่อยมาก ต้องแก้ไขด่วน')
} else if (report.systemHealth.healthStatus === 'warning') {
  MeeBot.setSprite('concerned')
  MeeBot.speak('ระบบมีการใช้ fallback บ่อยขึ้นนะ ควรตรวจสอบ')
} else {
  MeeBot.setSprite('happy')
  MeeBot.speak('ระบบทำงานได้ดีมากครับ!')
}
```

### Example 4: Export Rewards for Analysis

```typescript
import { exportRewardsAsJSON, exportRewardsAsCSV } from './tracker/RewardLog'

// Export as JSON
const jsonData = exportRewardsAsJSON('user-123')
// Send to analytics service or save to file

// Export as CSV for spreadsheet analysis
const csvData = exportRewardsAsCSV()
// Import into Excel, Google Sheets, etc.
```

---

## 🧪 Testing

The reward tracker includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run only reward tracker tests
npm run copilot-test-reward-tracker

# Run demo
npm run demo:reward-tracker
```

Test coverage includes:
- ✅ Basic reward tracking
- ✅ Fallback vs primary tracking
- ✅ User filtering
- ✅ Quest filtering
- ✅ Integration with QuestManager
- ✅ Statistics calculation
- ✅ Export functionality
- ✅ Telemetry reporting
- ✅ Edge cases

---

## 📊 Data Model

### RewardRecord Interface

```typescript
interface RewardRecord {
  userId: string              // User who earned the badge
  questId: string            // Quest that was completed
  badgeId: string           // ID of the badge NFT
  timestamp: number         // Unix timestamp (milliseconds)
  fallbackUsed: boolean    // Whether fallback minting was used
  txHash?: string         // Blockchain transaction hash
  chain?: 'primary' | 'fallback'  // Which chain was used
}
```

### RewardStatistics Interface

```typescript
interface RewardStatistics {
  totalRewards: number
  primaryRewards: number
  fallbackRewards: number
  fallbackPercentage: number
  uniqueUsers: number
  uniqueQuests: number
  recentRewards: RewardRecord[]
}
```

---

## 🎯 MeeBot Integration

MeeBot provides contextual emotional feedback throughout the reward tracking system:

| Scenario | MeeBot Sprite | MeeBot Message |
|----------|--------------|----------------|
| No badges yet | encouraging | ยังไม่มี badge เลยครับ ลองทำเควสดูนะ! |
| 1-4 badges | proud | คุณได้รับ X badge แล้วครับ เก่งมาก! |
| 5+ badges | celebrate | ว้าว! คุณได้รับทั้งหมด X badge แล้ว สุดยอดเลยครับ! |
| Primary mint success | celebrate | คุณได้รับ badge แล้ว เยี่ยมมาก! |
| Fallback mint success | confused | ระบบ fallback ทำงานแล้วครับ คุณยังได้รับ badge อยู่นะ |
| System healthy | happy | ระบบทำงานได้ดีมากครับ! |
| System warning | concerned | ระบบมีการใช้ fallback บ่อยขึ้นนะ ควรตรวจสอบ |
| System critical | sad | เตือน! ระบบใช้ fallback บ่อยมาก ต้องแก้ไขด่วน |

---

## 🔧 Configuration

The reward tracker uses in-memory storage by default. To integrate with a database:

```typescript
// Replace in RewardTracker.ts
const rewardDatabase: RewardRecord[] = []

// With database integration
import { db } from './database'

export function trackReward(reward: RewardRecord): void {
  // Save to database
  await db.rewards.create(reward)
  
  logEvent('reward-tracked', {
    userId: reward.userId,
    questId: reward.questId,
    badgeId: reward.badgeId,
    fallbackUsed: reward.fallbackUsed,
    chain: reward.chain
  })
}
```

---

## 🚀 Next Steps

The Reward Tracker system is ready for:

1. **Settings Page Integration** - Display user badges in settings
2. **NFT Football Integration** - Track football NFT achievements
3. **Advanced Analytics** - Time-series analysis, trends, predictions
4. **Leaderboards** - Compare users based on badges earned
5. **Achievement System** - Meta-achievements for earning multiple badges
6. **Social Sharing** - Share badge achievements on social media
7. **Notifications** - Alert users when they earn new badges

---

## 📝 License

Part of the MeeChain MeeBot project - MIT License
