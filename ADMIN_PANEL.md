# Admin Panel & Leaderboard System

> Comprehensive admin dashboard and leaderboard system for MeeChain quest management with reward tracking, export capabilities, and manual badge administration.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Examples](#examples)

---

## 🎯 Overview

The Admin Panel & Leaderboard system provides comprehensive tools for monitoring and managing the MeeChain quest ecosystem:

- **Leaderboard**: Display user rankings based on badge count
- **Admin Dashboard**: System statistics, fallback usage tracking, and user management
- **Reward Tracking**: Automatic tracking of all badge rewards
- **Export Functionality**: Export reward logs for audit and analysis
- **Manual Badge Granting**: Admin override for special events or corrections
- **MeeBot Integration**: Admin mode sprite and TTS feedback

---

## ✨ Features

### 1. 🏆 Leaderboard

Display user rankings based on total badges earned:

```tsx
import { Leaderboard } from './admin/Leaderboard'

// In your React component
<Leaderboard />
```

Features:
- Automatic ranking by badge count
- Shows rank, username, and badge count
- Empty state handling
- Real-time updates when new badges are granted

### 2. 🛡️ Admin Panel

Comprehensive dashboard for system administrators:

```tsx
import { AdminPanel } from './admin/AdminPanel'

// In your React component
<AdminPanel />
```

Features:
- **System Statistics**: Total badges, users, fallback usage rate
- **Export Controls**: Export reward logs to JSON
- **Manual Badge Granting**: Admin override for special cases
- **MeeBot Integration**: Shows admin sprite and TTS feedback
- **Real-time Updates**: Live statistics as quests are completed

### 3. 📊 Reward Tracking

Automatic tracking of all badge rewards:

```typescript
import { trackReward, getAllRewards, getRewardsByUser } from './tracker/RewardTracker'

// Track a reward (automatically called by QuestManager)
trackReward({
  userId: 'user123',
  questId: 'quest-001',
  badgeId: 'badge-001',
  timestamp: Date.now(),
  fallbackUsed: false
})

// Get all rewards
const allRewards = getAllRewards()

// Get rewards for specific user
const userRewards = getRewardsByUser('user123')
```

### 4. 📤 Export Functionality

Export reward data for audit and analysis:

```typescript
import { exportRewardLog, exportRewardsByUser } from './tracker/RewardExporter'

// Export all rewards
exportRewardLog('./logs/reward-log.json')

// Export rewards for specific user
exportRewardsByUser('user123', './logs/user123-rewards.json')
```

### 5. ⚙️ Manual Badge Administration

Admin tools for special cases:

```typescript
import { triggerManualBadge, revokeBadge, resetQuestProgress } from './admin/AdminActions'

// Grant special badge
triggerManualBadge('user123', 'special-event-quest', 'admin-john')

// Revoke badge (placeholder)
revokeBadge('user123', 'badge-001', 'admin-john')

// Reset quest progress (placeholder)
resetQuestProgress('user123', 'quest-001', 'admin-john')
```

---

## 🏗️ Architecture

### Directory Structure

```
tracker/
  RewardTracker.ts        ← Core reward tracking functionality
  RewardExporter.ts       ← Export utilities

admin/
  AdminTypes.ts           ← Type definitions
  AdminActions.ts         ← Admin action functions
  Leaderboard.tsx         ← Leaderboard component
  AdminPanel.tsx          ← Admin dashboard component
```

### Data Flow

```
Quest Completion (QuestManager)
         ↓
   Badge Minted
         ↓
  trackReward() called
         ↓
   Reward Database
         ↓
  ┌──────┴──────┐
  ↓             ↓
Leaderboard   AdminPanel
```

### Integration Points

1. **QuestManager Integration**
   - `trackReward()` called automatically on successful quest completion
   - Tracks both primary and fallback minting
   - Records timestamp and fallback status

2. **Logger Integration**
   - All admin actions logged with `logEvent()`
   - Manual badge grants tracked
   - Admin attribution included

3. **MeeBot Integration**
   - Admin sprite mode activated in AdminPanel
   - TTS feedback for admin actions
   - Visual and audio confirmation

---

## 📖 Usage

### Running the Demo

```bash
npm run demo:admin-panel
```

This will:
1. Simulate multiple users completing quests
2. Display the leaderboard with rankings
3. Show system statistics
4. Demonstrate manual badge granting
5. Export reward logs

### Integration Example

```typescript
import { handleQuestCompletion } from './src/QuestManager'
import { getAllRewards, getBadgeCount } from './tracker/RewardTracker'

// Complete a quest (reward automatically tracked)
await handleQuestCompletion('user123', 'quest-001')

// Check leaderboard position
const allRewards = getAllRewards()
const userBadges = getBadgeCount('user123')
console.log(`User has ${userBadges} badges`)
```

### React Component Example

```tsx
import React from 'react'
import { AdminPanel } from './admin/AdminPanel'
import { Leaderboard } from './admin/Leaderboard'

function App() {
  return (
    <div>
      <h1>MeeChain Admin Dashboard</h1>
      <AdminPanel />
      <Leaderboard />
    </div>
  )
}
```

---

## 📚 API Reference

### RewardTracker

#### `trackReward(reward: RewardRecord): void`
Track a badge reward granted to a user.

```typescript
trackReward({
  userId: 'user123',
  questId: 'quest-001',
  badgeId: 'badge-001',
  timestamp: Date.now(),
  fallbackUsed: false
})
```

#### `getAllRewards(): RewardRecord[]`
Get all tracked rewards.

#### `getRewardsByUser(userId: string): RewardRecord[]`
Get all rewards for a specific user.

#### `getRewardsByQuest(questId: string): RewardRecord[]`
Get all rewards for a specific quest.

#### `getFallbackRewards(): RewardRecord[]`
Get all rewards that used fallback minting.

#### `getBadgeCount(userId: string): number`
Get total badge count for a user.

#### `clearRewards(): void`
Clear all reward records (for testing).

### RewardExporter

#### `exportRewardLog(filePath: string): string`
Export all rewards to a JSON file.

```typescript
const result = exportRewardLog('./logs/reward-log.json')
console.log(result) // "Successfully exported 10 rewards to ./logs/reward-log.json"
```

#### `getExportPreview(): { exportedAt: string, totalRewards: number, rewards: RewardRecord[] }`
Get preview of export data without writing to file.

#### `exportRewardsByUser(userId: string, filePath: string): string`
Export rewards for a specific user.

### AdminActions

#### `triggerManualBadge(userId: string, questId: string, triggeredBy?: string): void`
Manually grant a badge to a user (admin override).

```typescript
triggerManualBadge('user123', 'special-event', 'admin-john')
```

#### `revokeBadge(userId: string, badgeId: string, triggeredBy?: string): void`
Revoke a badge from a user (placeholder for future implementation).

#### `resetQuestProgress(userId: string, questId: string, triggeredBy?: string): void`
Reset user progress for a quest (placeholder for future implementation).

### Types

```typescript
export type RewardRecord = {
  userId: string
  questId: string
  badgeId: string
  timestamp: number
  fallbackUsed: boolean
}

export type AdminAction = {
  userId: string
  questId: string
  badgeId: string
  triggeredBy: string
  timestamp: number
}

export type LeaderboardEntry = {
  userId: string
  badgeCount: number
  rank: number
}

export type AdminStats = {
  totalBadges: number
  totalUsers: number
  fallbackUsageCount: number
  fallbackUsageRate: number
}
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm test tests/rewardTracker.test.ts
npm test tests/adminActions.test.ts
npm test tests/questRewardIntegration.test.ts
```

### Test Coverage

- **RewardTracker**: 13 tests
  - Track rewards
  - Filter by user, quest, fallback
  - Badge counting
  - Clear functionality

- **AdminActions**: 8 tests
  - Manual badge granting
  - Badge revocation logging
  - Quest progress reset logging
  - Admin attribution

- **Quest-Reward Integration**: 7 tests
  - Automatic tracking on quest completion
  - Fallback reward tracking
  - Multiple users and quests
  - Fallback usage statistics

### Example Test

```typescript
import { trackReward, getBadgeCount } from '../tracker/RewardTracker'

test('should track reward and update badge count', () => {
  trackReward({
    userId: 'user1',
    questId: 'quest-001',
    badgeId: 'badge-001',
    timestamp: Date.now(),
    fallbackUsed: false
  })

  expect(getBadgeCount('user1')).toBe(1)
})
```

---

## 💡 Examples

### Example 1: Admin Dashboard

```typescript
import { AdminPanel } from './admin/AdminPanel'
import { MeeBot } from './components/MeeBot'

// Admin enters the panel
function openAdminPanel() {
  MeeBot.setSprite('admin')
  MeeBot.speak('เข้าสู่โหมดผู้ดูแลระบบแล้วครับ')
  
  // Render admin panel
  return <AdminPanel />
}
```

### Example 2: Leaderboard Display

```typescript
import { Leaderboard } from './admin/Leaderboard'

function HomePage() {
  return (
    <div>
      <h1>MeeChain Quest System</h1>
      <Leaderboard />
    </div>
  )
}
```

### Example 3: Manual Badge for Event

```typescript
import { triggerManualBadge } from './admin/AdminActions'
import { MeeBot } from './components/MeeBot'

async function grantEventBadge(userId: string) {
  // Grant special event badge
  triggerManualBadge(userId, 'community-event-2024', 'admin-system')
  
  // Provide feedback
  MeeBot.setSprite('happy')
  MeeBot.speak('ยินดีด้วย! คุณได้รับ badge พิเศษจากอีเวนต์')
}
```

### Example 4: Export for Audit

```typescript
import { exportRewardLog } from './tracker/RewardExporter'

function monthlyAudit() {
  const timestamp = new Date().toISOString().split('T')[0]
  const result = exportRewardLog(`./audits/rewards-${timestamp}.json`)
  console.log(result)
}
```

### Example 5: Fallback Analysis

```typescript
import { getAllRewards, getFallbackRewards } from './tracker/RewardTracker'

function analyzeFallbackUsage() {
  const allRewards = getAllRewards()
  const fallbackRewards = getFallbackRewards()
  
  const fallbackRate = (fallbackRewards.length / allRewards.length) * 100
  
  console.log(`Fallback usage: ${fallbackRate.toFixed(2)}%`)
  
  if (fallbackRate > 20) {
    console.warn('⚠️ High fallback usage detected - investigate primary chain issues')
  }
}
```

---

## 🔍 Use Cases

### 1. Community Events

Grant special badges to event participants:

```typescript
const eventParticipants = ['user1', 'user2', 'user3']
eventParticipants.forEach(userId => {
  triggerManualBadge(userId, 'christmas-event-2024', 'event-admin')
})
```

### 2. Bug Bounty Rewards

Reward users who report bugs:

```typescript
function rewardBugReporter(userId: string, severity: 'low' | 'medium' | 'high') {
  const questId = `bug-bounty-${severity}`
  triggerManualBadge(userId, questId, 'security-team')
}
```

### 3. Monthly Reports

Generate monthly statistics:

```typescript
import { getAllRewards } from './tracker/RewardTracker'

function generateMonthlyReport() {
  const rewards = getAllRewards()
  const thisMonth = rewards.filter(r => {
    const date = new Date(r.timestamp)
    return date.getMonth() === new Date().getMonth()
  })
  
  console.log(`Badges minted this month: ${thisMonth.length}`)
}
```

### 4. System Health Monitoring

Monitor fallback usage:

```typescript
import { getAllRewards, getFallbackRewards } from './tracker/RewardTracker'

setInterval(() => {
  const total = getAllRewards().length
  const fallback = getFallbackRewards().length
  const rate = (fallback / total) * 100
  
  if (rate > 30) {
    alert('Critical: Fallback usage exceeds 30%')
  }
}, 3600000) // Check every hour
```

---

## 🎨 Customization

### Custom Leaderboard Styling

```tsx
import { Leaderboard } from './admin/Leaderboard'

function StyledLeaderboard() {
  return (
    <div className="custom-leaderboard">
      <Leaderboard />
    </div>
  )
}
```

### Custom Admin Actions

```typescript
import { trackReward } from './tracker/RewardTracker'
import { logEvent } from './src/utils/logger'

export function customBadgeGrant(userId: string, badgeType: string) {
  const badgeId = `custom-${badgeType}-${Date.now()}`
  
  trackReward({
    userId,
    questId: badgeType,
    badgeId,
    timestamp: Date.now(),
    fallbackUsed: false
  })
  
  logEvent('custom-badge-granted', { userId, badgeType, badgeId })
}
```

---

## 🚀 Future Enhancements

- [ ] Filter leaderboard by time period (daily, weekly, monthly)
- [ ] Quest-specific leaderboards
- [ ] Badge rarity and weighting system
- [ ] Analytics dashboard with charts
- [ ] Real-time notifications for admin actions
- [ ] Batch badge operations
- [ ] CSV export support
- [ ] Integration with deploy-registry.json for chain analytics
- [ ] NFT Football voting system integration

---

## 📝 License

MIT License - Part of the MeeChain ecosystem

---

## 🤝 Contributing

Contributions welcome! Please ensure all tests pass before submitting PRs.

```bash
npm run build
npm test
```
