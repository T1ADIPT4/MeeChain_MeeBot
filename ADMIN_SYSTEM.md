# Admin System and Leaderboard Documentation

## 📊 Overview

The Admin System provides comprehensive reward tracking, leaderboard functionality, and administrative controls for the MeeChain quest and badge system.

---

## 🎯 Core Components

### 1. Reward Tracker (`tracker/RewardTracker.ts`)

Tracks all badge rewards issued to users across the system.

#### Features:
- **Automatic Tracking**: Integrated with QuestManager to auto-track all badge minting
- **User Filtering**: Get rewards for specific users
- **Quest Filtering**: Get rewards for specific quests
- **Leaderboard Data**: Generate user rankings by badge count
- **Fallback Awareness**: Tracks whether rewards were issued via fallback chain

#### API:

```typescript
import {
  trackReward,
  getAllRewards,
  getUserRewards,
  getQuestRewards,
  getRewardCountByUser,
  clearRewards
} from './tracker/RewardTracker'

// Track a reward (automatically called by QuestManager)
trackReward({
  userId: 'user123',
  questId: 'quest-tts-001',
  badgeId: 'badge-tts-001',
  timestamp: Date.now(),
  fallbackUsed: false
})

// Get all rewards
const allRewards = getAllRewards()

// Get rewards for a specific user
const userRewards = getUserRewards('user123')

// Get rewards for a specific quest
const questRewards = getQuestRewards('quest-tts-001')

// Get badge counts by user (for leaderboard)
const leaderboard = getRewardCountByUser()
// Returns: { 'user1': 5, 'user2': 3, 'user3': 1 }
```

---

### 2. Reward Exporter (`tracker/RewardExporter.ts`)

Exports reward logs and statistics for analysis, auditing, or external systems.

#### Features:
- **Log Export**: Export all reward records to JSON
- **Statistics**: Generate aggregated reward statistics
- **Fallback Rate**: Track percentage of rewards issued via fallback
- **Quest Distribution**: See reward counts per quest type

#### API:

```typescript
import { exportRewardLog, exportRewardStats } from './tracker/RewardExporter'

// Export reward log
const result = exportRewardLog('./logs/reward-log.json')
console.log(`Exported ${result.count} rewards`)

// Export statistics
const stats = exportRewardStats()
console.log(stats)
/*
{
  totalRewards: 150,
  totalUsers: 42,
  fallbackRate: 0.15,  // 15% of rewards used fallback
  rewardsByQuest: {
    'quest-tts-001': 50,
    'quest-001': 35,
    'quest-002': 25
  }
}
*/
```

---

### 3. Admin Actions (`admin/AdminActions.ts`)

Administrative functions for manual badge management.

#### Features:
- **Manual Badge Granting**: Issue badges directly to users
- **Automatic Tracking**: Manual badges are tracked like regular rewards
- **Special Quest Support**: Can grant badges for special events

#### API:

```typescript
import { triggerManualBadge } from './admin/AdminActions'

// Grant a manual badge
triggerManualBadge('user123', 'special-event-quest')
// Creates: manual-special-event-quest-{timestamp}
```

---

### 4. Leaderboard Component (`admin/Leaderboard.tsx`)

React component displaying user rankings by badge count.

#### Features:
- **Real-time Rankings**: Shows current leaderboard based on tracked rewards
- **Badge Counts**: Displays number of badges per user
- **Sorted Display**: Users sorted by badge count (highest first)

#### Usage:

```tsx
import { Leaderboard } from './admin/Leaderboard'

function MyApp() {
  return (
    <div>
      <h1>MeeChain Leaderboard</h1>
      <Leaderboard />
    </div>
  )
}
```

#### Output:
```
🏆 Leaderboard
1. user123 – 15 badge
2. user456 – 12 badge
3. user789 – 8 badge
```

---

### 5. Admin Panel Component (`admin/AdminPanel.tsx`)

Complete administrative interface combining all admin features.

#### Features:
- **Export Controls**: One-click reward log export
- **Manual Badges**: Quick access to grant special badges
- **Integrated Leaderboard**: View rankings in the same interface
- **MeeBot Integration**: Visual and audio feedback for admin actions

#### Usage:

```tsx
import { AdminPanel } from './admin/AdminPanel'

function AdminPage() {
  return <AdminPanel />
}
```

#### Interface:
- **Export Reward Log Button**: Downloads/exports all reward data
- **Grant Special Badge Button**: Issues a manual badge (currently to user123)
- **Leaderboard Display**: Shows current rankings

---

## 🔄 Integration with Quest System

The reward tracking is **automatically integrated** with the QuestManager:

```typescript
// When a quest is completed, rewards are automatically tracked
const result = await handleQuestCompletion('user123', 'quest-tts-001')

// If successful, reward is tracked automatically
if (result.success) {
  // Reward is already in the tracker with:
  // - userId: 'user123'
  // - questId: 'quest-tts-001'
  // - badgeId: from transaction
  // - timestamp: from transaction
  // - fallbackUsed: true/false based on minting chain
}
```

---

## 🧪 Testing

Comprehensive test suite in `tests/rewardTracking.test.ts`:

```bash
# Run all tests
npm test

# Run only reward tracking tests
npm test -- tests/rewardTracking.test.ts
```

### Test Coverage:
- ✅ **Reward Tracker** (4 tests)
  - Track rewards correctly
  - Filter by user
  - Filter by quest
  - Count badges per user

- ✅ **Reward Exporter** (2 tests)
  - Export log functionality
  - Export statistics with fallback rate

- ✅ **Admin Actions** (2 tests)
  - Manual badge granting
  - Multiple manual badges

- ✅ **Integration** (3 tests)
  - Auto-tracking on quest completion
  - Fallback chain tracking
  - Multiple quest completions

- ✅ **Leaderboard Data** (1 test)
  - Correct sorting and ranking

**Total: 12 tests, all passing ✅**

---

## 📈 Future Enhancements

The system is designed for easy extension:

### Recommended Additions:

1. **Leaderboard Filters**
   ```typescript
   // Filter by quest type
   getLeaderboardByQuest('quest-type-nft')
   
   // Filter by time period
   getLeaderboardByDateRange(startDate, endDate)
   
   // Filter by badge rarity
   getLeaderboardByRarity('legendary')
   ```

2. **Analytics Dashboard**
   - Badge distribution graphs
   - Quest completion rates
   - Fallback usage trends
   - User engagement metrics

3. **NFT Football Integration**
   - Link rewards to NFT Football voting system
   - Track votes as reward-eligible actions
   - Leaderboard for most active voters

4. **Chain Integration**
   - Connect to deploy-registry.json
   - Show which chain each badge was minted on
   - Display cross-chain badge statistics

5. **External System Export**
   ```typescript
   // Export to Supabase
   await exportToSupabase(rewards)
   
   // Export to Firebase
   await exportToFirebase(rewards)
   
   // Export for audit
   await exportAuditLog(startDate, endDate)
   ```

6. **MeeBot Enhancements**
   - Admin sprite states: 'reviewing', 'exporting', 'granting'
   - TTS feedback for admin actions
   - Animated congratulations for leaderboard leaders

---

## 🎨 MeeBot Integration

The Admin Panel uses MeeBot for visual feedback:

```typescript
MeeBot.setSprite('admin')  // Shows admin sprite
MeeBot.speak('เข้าสู่โหมดผู้ดูแลระบบแล้วครับ')  // Thai TTS feedback
```

Available admin-related sprites:
- `admin` - Admin mode
- `reviewing` - Reviewing data
- `exporting` - Exporting logs
- `manual-grant` - Granting manual badges

---

## 📝 Example Usage Scenarios

### Scenario 1: View Current Leaderboard
```typescript
import { Leaderboard } from './admin/Leaderboard'

// Simply render the component
<Leaderboard />
```

### Scenario 2: Grant Special Event Badge
```typescript
import { triggerManualBadge } from './admin/AdminActions'

// During special event
triggerManualBadge('attendee123', 'special-event-2024')
```

### Scenario 3: Export Monthly Report
```typescript
import { exportRewardLog, exportRewardStats } from './tracker/RewardExporter'

// Export full log
const log = exportRewardLog('./reports/monthly-rewards.json')

// Get statistics
const stats = exportRewardStats()
console.log(`Total badges this month: ${stats.totalRewards}`)
console.log(`Fallback usage: ${(stats.fallbackRate * 100).toFixed(2)}%`)
```

### Scenario 4: Check User Progress
```typescript
import { getUserRewards } from './tracker/RewardTracker'

const userBadges = getUserRewards('user123')
console.log(`User has ${userBadges.length} badges`)

userBadges.forEach(badge => {
  console.log(`- ${badge.questId} (${badge.fallbackUsed ? 'fallback' : 'primary'})`)
})
```

---

## 🔐 Security Considerations

### Access Control
The admin functions should be protected:

```typescript
// Example middleware (not implemented)
function requireAdmin(userId: string) {
  if (!isAdmin(userId)) {
    throw new Error('Admin access required')
  }
}

// Protected admin action
function secureManualBadge(adminId: string, userId: string, questId: string) {
  requireAdmin(adminId)
  triggerManualBadge(userId, questId)
}
```

### Audit Trail
All admin actions are logged via the reward tracker:
- Manual badges have distinctive IDs: `manual-{questId}-{timestamp}`
- All rewards tracked with timestamp
- Can be exported for audit purposes

---

## 📚 Related Documentation

- [QUEST_SYSTEM.md](./QUEST_SYSTEM.md) - Quest verification system
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Core implementation details
- [SETTINGS_SUPPORT.md](./SETTINGS_SUPPORT.md) - Settings and support pages
- [INTEGRATION.md](./INTEGRATION.md) - Integration guide

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Use in your application
import { AdminPanel } from './admin/AdminPanel'
import { Leaderboard } from './admin/Leaderboard'
import { trackReward, getAllRewards } from './tracker/RewardTracker'
```

---

## 💡 Tips

1. **Real-time Updates**: The leaderboard updates automatically as new rewards are tracked
2. **Manual Badges**: Use descriptive quest IDs for manual badges (e.g., 'holiday-event-2024')
3. **Export Regularly**: Export reward logs periodically for backup and analysis
4. **Monitor Fallback Rate**: High fallback rates may indicate primary chain issues
5. **Custom Leaderboards**: Use `getQuestRewards()` to create quest-specific leaderboards
