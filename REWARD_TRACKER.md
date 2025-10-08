# Reward Tracker System - Implementation Guide

This document describes the Reward Tracker system for MeeChain MeeBot, which tracks badge rewards earned by users through quest completion.

## 🎯 Overview

The Reward Tracker system provides:
- **Badge tracking**: Records all badges earned by users
- **Fallback awareness**: Distinguishes between normal and fallback minting
- **Timestamp tracking**: Records when each badge was earned
- **MeeBot integration**: Provides emotional feedback through sprite and TTS
- **User dashboard**: Displays all earned badges with status

## 📁 File Structure

```
tracker/
  ├── RewardLog.ts          # Type definitions for reward entries
  ├── RewardTracker.ts      # Core tracking functionality
  └── RewardDashboard.tsx   # React component for displaying rewards
```

## 🔧 Core Components

### 1. RewardLog.ts - Type Definitions

```typescript
export type RewardEntry = {
  userId: string
  questId: string
  badgeId: string
  timestamp: number
  fallbackUsed: boolean
}
```

### 2. RewardTracker.ts - Tracking Logic

**Functions:**
- `trackReward(entry: RewardEntry)` - Track a new reward
- `getUserRewards(userId: string)` - Get all rewards for a user
- `getAllRewards()` - Get all tracked rewards
- `clearRewards()` - Clear all tracked rewards (testing)

### 3. RewardDashboard.tsx - Display Component

React component that:
- Displays all badges earned by a user
- Shows quest ID, badge ID, timestamp, and fallback status
- Integrates with MeeBot for proud feedback

## 🔌 Integration with QuestManager

The Reward Tracker is automatically integrated into the quest completion flow:

```typescript
// In QuestManager.ts
import { trackReward } from '../tracker/RewardTracker.js'
import { MeeBot } from '../components/MeeBot.js'

// After successful minting
trackReward({
  userId,
  questId,
  badgeId: badgeTx.badgeId,
  timestamp: Date.now(),
  fallbackUsed: false
})

MeeBot.setSprite('celebrate')
MeeBot.speak('คุณได้รับ badge แล้ว เยี่ยมมาก!')
```

## 📊 Usage Examples

### Track Rewards Automatically

Rewards are tracked automatically when quests are completed:

```typescript
import { handleQuestCompletion } from './src/QuestManager'
import { updateUserProgress } from './src/verifiers/questVerifier'

// Update progress
updateUserProgress(userId, questId, 'login', 1)
updateUserProgress(userId, questId, 'profile-setup', 1)

// Complete quest (reward is tracked automatically)
const result = await handleQuestCompletion(userId, questId)
```

### View User Rewards

```typescript
import { getUserRewards } from './tracker/RewardTracker'

const rewards = getUserRewards(userId)
console.log(`Total badges: ${rewards.length}`)

rewards.forEach(reward => {
  console.log(`Badge ${reward.badgeId} from quest ${reward.questId}`)
  console.log(`Status: ${reward.fallbackUsed ? 'Fallback' : 'Normal'}`)
  console.log(`Earned at: ${new Date(reward.timestamp).toLocaleString()}`)
})
```

### Display Reward Dashboard

```tsx
import { RewardDashboard } from './tracker/RewardDashboard'

function MyPage() {
  return <RewardDashboard userId="current-user-id" />
}
```

## 🎨 MeeBot Integration

The Reward Tracker integrates with MeeBot to provide emotional feedback:

### On Normal Minting
```typescript
MeeBot.setSprite('celebrate')
MeeBot.speak('คุณได้รับ badge แล้ว เยี่ยมมาก!')
```

### On Fallback Minting
```typescript
MeeBot.setSprite('confused')
MeeBot.speak('ระบบ fallback ทำงานแล้วครับ คุณยังได้รับ badge อยู่นะ')
```

### On Dashboard View
```typescript
MeeBot.setSprite('proud')
MeeBot.speak(`คุณได้รับทั้งหมด ${rewards.length} badge แล้วครับ เก่งมาก!`)
```

## 📈 Telemetry & Analytics

Reward data can be used for analytics:

```typescript
import { getAllRewards } from './tracker/RewardTracker'

const allRewards = getAllRewards()

// Calculate metrics
const totalBadges = allRewards.length
const fallbackBadges = allRewards.filter(r => r.fallbackUsed).length
const normalBadges = totalBadges - fallbackBadges
const fallbackRate = (fallbackBadges / totalBadges) * 100

console.log(`Total badges: ${totalBadges}`)
console.log(`Normal minting: ${normalBadges} (${100 - fallbackRate}%)`)
console.log(`Fallback minting: ${fallbackBadges} (${fallbackRate}%)`)
```

## ✅ Key Features

| Feature | Description |
|---------|-------------|
| **Automatic Tracking** | Rewards are tracked automatically on quest completion |
| **Fallback Awareness** | Distinguishes between normal and fallback minting |
| **Timestamp Recording** | Tracks when each badge was earned |
| **User Filtering** | Get rewards for specific users |
| **MeeBot Feedback** | Emotional responses through sprite and TTS |
| **Dashboard Ready** | React component for displaying rewards |
| **Telemetry Support** | Data can be analyzed for system health metrics |

## 🧪 Testing

Comprehensive tests are available in `tests/rewardTracker.test.ts`:

```bash
# Run reward tracker tests
npm test tests/rewardTracker.test.ts

# Run demo
npm run demo:reward-tracker
```

## 🔄 Future Enhancements

Potential extensions to the Reward Tracker:

1. **Persistent Storage**: Save rewards to database
2. **Badge Levels**: Track badge rarity or levels
3. **Achievements**: Unlock achievements based on badge combinations
4. **Leaderboard**: Compare badge counts across users
5. **Export/Import**: Allow users to export their badge history
6. **Notifications**: Alert users when they earn new badges

## 📚 Related Documentation

- [QUEST_SYSTEM.md](./QUEST_SYSTEM.md) - Quest verification system
- [INTEGRATION.md](./INTEGRATION.md) - Integration guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Overall system summary

## 🤝 Contributing

When adding new quest types:
1. Ensure `handleQuestCompletion` is used to complete the quest
2. Rewards will be tracked automatically
3. Add appropriate MeeBot feedback if needed
4. Update tests to validate reward tracking

---

Built with ❤️ for MeeChain MeeBot
