# Admin Panel and Leaderboard System Documentation

Complete documentation for the MeeChain Admin Panel and Leaderboard system.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Components](#components)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Demo](#demo)
- [Integration Guide](#integration-guide)

---

## 🎯 Overview

The Admin Panel and Leaderboard system provides:

- **Leaderboard**: Real-time rankings of users based on badge count
- **Admin Dashboard**: Comprehensive statistics and management tools
- **Manual Badge Granting**: Admin override for special cases
- **Reward Tracking**: Automatic tracking of all badge rewards
- **Data Export**: Export logs to JSON and CSV formats
- **Audit Trail**: Complete history of admin actions
- **MeeBot Integration**: Admin mode with TTS feedback

---

## 🧩 Architecture

### Module Breakdown

| Module | File | Responsibility | Key Features |
|--------|------|----------------|--------------|
| **Reward Tracker** | `tracker/RewardTracker.ts` | Track all badge rewards | Analytics, filtering, leaderboard data |
| **Reward Exporter** | `tracker/RewardExporter.ts` | Export logs to files | JSON/CSV export, backup support |
| **Admin Actions** | `admin/AdminActions.ts` | Manual badge operations | Grant badges, audit trail |
| **Admin Types** | `admin/AdminTypes.ts` | Type definitions | TypeScript interfaces |
| **Leaderboard** | `admin/Leaderboard.tsx` | Display rankings | React component for UI |
| **Admin Panel** | `admin/AdminPanel.tsx` | Admin dashboard | Complete management interface |

### Data Flow

```
Quest Completion → Badge Minted → trackRewardFromTransaction()
                                              ↓
                                    RewardTracker (in-memory)
                                              ↓
                      ┌──────────────────────┼──────────────────────┐
                      ↓                      ↓                      ↓
                Leaderboard           Admin Panel            Export Logs
```

---

## 🔧 Components

### 1. RewardTracker

Tracks all badge rewards and provides analytics.

**Key Functions:**
- `trackReward(reward)` - Track a new reward
- `trackRewardFromTransaction(tx)` - Track from badge transaction
- `getAllRewards()` - Get all tracked rewards
- `getRewardsByUser(userId)` - Filter by user
- `getRewardsByQuest(questId)` - Filter by quest
- `getFallbackRewards()` - Get fallback-minted badges
- `getBadgeCountByUser()` - Count badges per user
- `getTopUsers(limit)` - Get top users for leaderboard
- `getRewardStats()` - Get comprehensive statistics

**Example:**
```typescript
import { trackRewardFromTransaction, getTopUsers } from './tracker/RewardTracker'

// Track a reward
const tx = await handleQuestCompletion(userId, questId)
if (tx.success && tx.tx) {
  trackRewardFromTransaction(tx.tx)
}

// Get leaderboard
const topUsers = getTopUsers(10)
console.log(topUsers) // [[userId, badgeCount], ...]
```

### 2. RewardExporter

Export reward logs for backup and analytics.

**Key Functions:**
- `exportRewardLogToJSON()` - Export as JSON string
- `exportRewardLog(filepath)` - Save JSON to file
- `exportRewardLogToCSV()` - Export as CSV string
- `exportRewardLogCSV(filepath)` - Save CSV to file

**Example:**
```typescript
import { exportRewardLog, exportRewardLogCSV } from './tracker/RewardExporter'

// Export to JSON
await exportRewardLog('./logs/rewards.json')

// Export to CSV
await exportRewardLogCSV('./logs/rewards.csv')
```

### 3. AdminActions

Manual badge operations and admin management.

**Key Functions:**
- `triggerManualBadge(userId, questId, triggeredBy)` - Grant manual badge
- `getAllAdminActions()` - Get all admin actions
- `getAdminActionsByUser(userId)` - Filter by user
- `getAdminActionsByAdmin(adminId)` - Filter by admin
- `getRecentAdminActions(limit)` - Get recent actions

**Example:**
```typescript
import { triggerManualBadge } from './admin/AdminActions'

// Grant special badge
const badgeId = triggerManualBadge(
  'user-123',
  'special-event',
  'admin-sarah'
)
console.log(`Badge granted: ${badgeId}`)
```

### 4. Leaderboard Component

React component for displaying user rankings.

**Features:**
- Automatic ranking calculation
- Badge count display
- Medal icons for top 3 users
- Empty state handling

**Example:**
```tsx
import { Leaderboard } from './admin/Leaderboard'

function MyApp() {
  return (
    <div>
      <h1>MeeChain Rankings</h1>
      <Leaderboard />
    </div>
  )
}
```

### 5. AdminPanel Component

Complete admin dashboard with statistics and actions.

**Features:**
- Real-time statistics (total badges, users, quests, fallback rate)
- Export buttons (JSON/CSV)
- Manual badge granting
- Recent admin actions display
- Integrated leaderboard
- MeeBot admin mode

**Example:**
```tsx
import { AdminPanel } from './admin/AdminPanel'

function AdminRoute() {
  return (
    <div>
      <AdminPanel />
    </div>
  )
}
```

---

## 📖 API Reference

### RewardTracker API

#### `trackReward(reward: RewardRecord): void`
Track a new reward.

**Parameters:**
- `reward.userId` - User ID receiving the badge
- `reward.questId` - Quest ID completed
- `reward.badgeId` - Badge ID minted
- `reward.timestamp` - Timestamp in milliseconds
- `reward.fallbackUsed` - Whether fallback was used

#### `getRewardStats(): object`
Get comprehensive statistics.

**Returns:**
```typescript
{
  totalRewards: number
  uniqueUsers: number
  uniqueQuests: number
  fallbackUsageRate: number // 0 to 1
}
```

### AdminActions API

#### `triggerManualBadge(userId: string, questId: string, triggeredBy?: string): string`
Grant a manual badge to a user.

**Parameters:**
- `userId` - User ID to receive the badge
- `questId` - Quest ID associated with the badge
- `triggeredBy` - Admin who triggered (default: 'admin')

**Returns:** Badge ID created

---

## 💡 Usage Examples

### Example 1: Track Quest Completion

```typescript
import { handleQuestCompletion } from './src/QuestManager'
import { trackRewardFromTransaction } from './tracker/RewardTracker'

async function completeQuest(userId: string, questId: string) {
  const result = await handleQuestCompletion(userId, questId)
  
  if (result.success && result.tx) {
    // Automatically track the reward
    trackRewardFromTransaction(result.tx)
    console.log(`Badge minted: ${result.tx.badgeId}`)
  }
}
```

### Example 2: Display Leaderboard

```typescript
import { getTopUsers } from './tracker/RewardTracker'

function displayLeaderboard() {
  const topUsers = getTopUsers(10)
  
  console.log('🏆 Leaderboard')
  topUsers.forEach(([userId, count], index) => {
    console.log(`#${index + 1} ${userId} - ${count} badges`)
  })
}
```

### Example 3: Grant Manual Badge

```typescript
import { triggerManualBadge } from './admin/AdminActions'
import { MeeBot } from './components/MeeBot'

function grantSpecialBadge() {
  MeeBot.setSprite('admin')
  MeeBot.speak('กำลังมอบ badge พิเศษ')
  
  const badgeId = triggerManualBadge(
    'user-123',
    'bug-bounty-001',
    'admin-john'
  )
  
  console.log(`✅ Badge granted: ${badgeId}`)
}
```

### Example 4: Export Logs

```typescript
import { exportRewardLog, exportRewardLogCSV } from './tracker/RewardExporter'

async function backupLogs() {
  const date = new Date().toISOString().split('T')[0]
  
  await exportRewardLog(`./logs/rewards-${date}.json`)
  await exportRewardLogCSV(`./logs/rewards-${date}.csv`)
  
  console.log('Logs exported successfully')
}
```

### Example 5: View Statistics

```typescript
import { getRewardStats, getFallbackRewards } from './tracker/RewardTracker'

function viewStats() {
  const stats = getRewardStats()
  const fallbackRewards = getFallbackRewards()
  
  console.log(`Total Badges: ${stats.totalRewards}`)
  console.log(`Unique Users: ${stats.uniqueUsers}`)
  console.log(`Fallback Usage: ${(stats.fallbackUsageRate * 100).toFixed(1)}%`)
  console.log(`Fallback Badges: ${fallbackRewards.length}`)
}
```

---

## 🧪 Testing

### Test Coverage

- **RewardTracker**: 13 tests passing
  - Reward tracking
  - Filtering (by user, quest, fallback)
  - Badge counting
  - Leaderboard generation
  - Statistics calculation

- **AdminActions**: 16 tests passing
  - Manual badge granting
  - Admin action recording
  - Filtering (by user, admin)
  - Audit trail
  - Integration with reward tracker

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test tests/rewardTracker.test.ts
npm test tests/adminActions.test.ts
```

---

## 🎮 Demo

### Running the Demo

```bash
npm run demo:admin
```

The demo demonstrates:
1. ✅ Quest completions with automatic reward tracking
2. ✅ Leaderboard display
3. ✅ Statistics viewing
4. ✅ Manual badge granting by admins
5. ✅ Admin action history
6. ✅ Updated leaderboard
7. ✅ Data export to JSON/CSV
8. ✅ MeeBot integration

---

## 🚀 Integration Guide

### Step 1: Track Quest Completions

Modify your quest completion handler to track rewards:

```typescript
import { trackRewardFromTransaction } from './tracker/RewardTracker'

// In your quest completion handler
const result = await handleQuestCompletion(userId, questId)
if (result.success && result.tx) {
  trackRewardFromTransaction(result.tx)
}
```

### Step 2: Add Leaderboard to UI

```tsx
import { Leaderboard } from './admin/Leaderboard'

// In your React app
<Leaderboard />
```

### Step 3: Create Admin Route

```tsx
import { AdminPanel } from './admin/AdminPanel'

// Protected admin route
function AdminRoute() {
  // Add your authentication check here
  if (!isAdmin) return <Redirect to="/" />
  
  return <AdminPanel />
}
```

### Step 4: Set Up Scheduled Exports

```typescript
import { exportRewardLog } from './tracker/RewardExporter'

// Daily backup
setInterval(async () => {
  const date = new Date().toISOString().split('T')[0]
  await exportRewardLog(`./backups/rewards-${date}.json`)
}, 24 * 60 * 60 * 1000) // Every 24 hours
```

---

## 🎨 Customization

### Custom Leaderboard Display

You can create your own leaderboard component:

```tsx
import { getTopUsers } from './tracker/RewardTracker'

function CustomLeaderboard() {
  const topUsers = getTopUsers(5)
  
  return (
    <div>
      {topUsers.map(([userId, count], i) => (
        <div key={i}>
          {userId}: {count} badges
        </div>
      ))}
    </div>
  )
}
```

### Custom Statistics Dashboard

```tsx
import { getRewardStats } from './tracker/RewardTracker'

function StatsDashboard() {
  const stats = getRewardStats()
  
  return (
    <div>
      <h2>Statistics</h2>
      <p>Total: {stats.totalRewards}</p>
      <p>Users: {stats.uniqueUsers}</p>
      <p>Fallback: {(stats.fallbackUsageRate * 100).toFixed(1)}%</p>
    </div>
  )
}
```

---

## 🔒 Security Considerations

1. **Authentication**: Always protect admin routes with proper authentication
2. **Authorization**: Verify admin privileges before allowing manual badge grants
3. **Audit Trail**: All admin actions are logged for accountability
4. **Data Validation**: Validate all inputs before processing
5. **Rate Limiting**: Consider rate limiting for manual badge grants

---

## 📝 Best Practices

1. **Regular Exports**: Schedule regular log exports for backup
2. **Monitor Fallback Rate**: High fallback rates may indicate primary chain issues
3. **Review Admin Actions**: Regularly review admin action history
4. **Clean Data**: Clear test rewards before production deployment
5. **Documentation**: Keep admin procedures documented

---

## 🛠️ Troubleshooting

### Leaderboard Not Updating

Make sure to call `trackRewardFromTransaction()` after quest completion:

```typescript
const result = await handleQuestCompletion(userId, questId)
if (result.success && result.tx) {
  trackRewardFromTransaction(result.tx)  // Don't forget this!
}
```

### Export Errors

Ensure the logs directory exists:

```typescript
import fs from 'fs/promises'
await fs.mkdir('./logs', { recursive: true })
```

### Statistics Incorrect

Clear rewards during testing:

```typescript
import { clearRewards } from './tracker/RewardTracker'
clearRewards() // Use only in testing!
```

---

## 📚 Additional Resources

- [Quest System Documentation](./QUEST_SYSTEM.md)
- [Settings & Support Documentation](./SETTINGS_SUPPORT.md)
- [API Tests](./tests/rewardTracker.test.ts)
- [Admin Demo](./examples/admin-demo.ts)

---

## 📄 License

MIT
