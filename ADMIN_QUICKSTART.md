# Admin Panel & Leaderboard - Quick Start Guide

This guide provides a quick overview of the Admin Panel and Leaderboard system added to MeeChain.

## 🚀 Quick Start

### Run the Demo

```bash
npm run demo:admin
```

This will:
1. Simulate quest completions
2. Display the leaderboard
3. Show statistics
4. Grant manual badges
5. Export logs to JSON and CSV

### Run Tests

```bash
# All tests (43 total)
npm test

# Specific test suites
npm test tests/rewardTracker.test.ts  # 13 tests
npm test tests/adminActions.test.ts   # 16 tests
```

## 📦 What's Included

### Tracker Module (`tracker/`)
- **RewardTracker.ts** - Track all badge rewards and provide analytics
- **RewardExporter.ts** - Export reward logs to JSON/CSV

### Admin Module (`admin/`)
- **AdminPanel.tsx** - Complete admin dashboard
- **Leaderboard.tsx** - User rankings display
- **AdminActions.ts** - Manual badge granting
- **AdminTypes.ts** - Type definitions

### Tests (`tests/`)
- **rewardTracker.test.ts** - 13 tests for reward tracking
- **adminActions.test.ts** - 16 tests for admin actions

### Examples (`examples/`)
- **admin-demo.ts** - Comprehensive demo of all features

### Documentation
- **ADMIN_PANEL.md** - Complete documentation with API reference

## 🎯 Key Features

### 🏆 Leaderboard
- Real-time user rankings by badge count
- Medals for top 3 users
- Automatic updates

### 🛡️ Admin Panel
- Statistics dashboard (badges, users, quests, fallback rate)
- Manual badge granting
- Admin action history
- Export functionality

### 📊 Analytics
- Total badges minted
- Unique users and quests
- Fallback usage tracking
- Badge distribution

### 📤 Export
- JSON format for detailed logs
- CSV format for spreadsheets
- Includes all rewards and system logs

## 💡 Usage Example

### Track Quest Completions

```typescript
import { handleQuestCompletion } from './src/QuestManager'
import { trackRewardFromTransaction } from './tracker/RewardTracker'

const result = await handleQuestCompletion(userId, questId)
if (result.success && result.tx) {
  trackRewardFromTransaction(result.tx)
}
```

### Display Leaderboard

```tsx
import { Leaderboard } from './admin/Leaderboard'

function App() {
  return <Leaderboard />
}
```

### Grant Manual Badge

```typescript
import { triggerManualBadge } from './admin/AdminActions'

const badgeId = triggerManualBadge(
  'user-123',
  'special-event',
  'admin-sarah'
)
```

### Export Logs

```typescript
import { exportRewardLog } from './tracker/RewardExporter'

await exportRewardLog('./logs/rewards.json')
```

## 📖 Full Documentation

See [ADMIN_PANEL.md](./ADMIN_PANEL.md) for complete documentation including:
- Architecture overview
- API reference
- Integration guide
- Customization examples
- Security considerations
- Troubleshooting

## 🧪 Test Coverage

- ✅ 13 tests for RewardTracker
- ✅ 16 tests for AdminActions  
- ✅ 14 tests for TTS Quest (existing)
- ✅ 43 total tests passing

## 🎮 Demo Output

The demo shows:
1. Quest completions with automatic tracking
2. Leaderboard with rankings (🥇🥈🥉)
3. Statistics (total badges, users, quests, fallback rate)
4. Manual badge grants by admins
5. Admin action history
6. Updated leaderboard after manual badges
7. Export to JSON and CSV files
8. MeeBot admin mode integration

## 🔗 Related Documentation

- [Quest System](./QUEST_SYSTEM.md)
- [Settings & Support](./SETTINGS_SUPPORT.md)
- [Admin Panel](./ADMIN_PANEL.md)
