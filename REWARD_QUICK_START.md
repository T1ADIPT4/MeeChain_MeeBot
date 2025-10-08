# Reward Tracking System - Quick Start Guide

## 🎯 What is it?

The Reward Tracking System automatically tracks when users earn badges in the MeeChain quest system. It records:
- ✅ Which user earned the badge
- 🎖️ What badge was earned
- 📅 When it was earned
- 🔄 Whether it used fallback minting

## 🚀 Zero-Configuration Usage

**Good news**: Tracking happens automatically! Just use the quest system normally:

```typescript
import { handleQuestCompletion } from './src/QuestManager'

// Complete a quest - tracking happens automatically!
const result = await handleQuestCompletion('user123', 'quest-tts-001')
```

That's it! The reward is now tracked.

## 📊 View User Badges

```typescript
import { getUserRewards } from './tracker/RewardTracker'

const badges = getUserRewards('user123')
console.log(`User has ${badges.length} badges`)

// Show each badge
badges.forEach(badge => {
  console.log(`${badge.badgeId} - ${new Date(badge.timestamp).toLocaleDateString()}`)
})
```

## 🎨 Display in React

```tsx
import { RewardDashboard } from './tracker/RewardDashboard'

function MyApp() {
  return <RewardDashboard userId="user123" />
}
```

## 📦 Export for Backup

```typescript
import { exportRewardLog } from './tracker/RewardExporter'

// Export all rewards to JSON
exportRewardLog('./my-backup.json')
```

## 📈 Analytics

```typescript
import { getAllRewards } from './tracker/RewardTracker'

const all = getAllRewards()
const stats = {
  total: all.length,
  fallbackUsed: all.filter(r => r.fallbackUsed).length,
  uniqueUsers: new Set(all.map(r => r.userId)).size
}

console.log(`Total badges: ${stats.total}`)
console.log(`Unique users: ${stats.uniqueUsers}`)
console.log(`Fallback rate: ${(stats.fallbackUsed/stats.total*100).toFixed(1)}%`)
```

## 🎬 Try the Demos

```bash
# Simple usage examples (recommended for beginners)
npm run demo:reward-simple

# Full feature demo with analytics
npm run demo:reward-tracking
```

## 📚 Learn More

- **Full Documentation**: [REWARD_TRACKING.md](REWARD_TRACKING.md)
- **Quest System**: [QUEST_SYSTEM.md](QUEST_SYSTEM.md)
- **Integration**: [INTEGRATION.md](INTEGRATION.md)

## 🔑 Key Points

1. **Automatic**: Tracking happens automatically when quests complete
2. **Zero Setup**: No configuration needed
3. **Type-Safe**: Full TypeScript support
4. **Tested**: 11 comprehensive tests
5. **Production-Ready**: Used in MeeChain production

## 💡 Common Use Cases

### Use Case 1: Show user profile badges
```typescript
const userBadges = getUserRewards(userId)
// Display in profile page
```

### Use Case 2: Leaderboard
```typescript
const all = getAllRewards()
// Group by user, sort by count
```

### Use Case 3: Daily backup
```typescript
const date = new Date().toISOString().split('T')[0]
exportRewardLog(`./backups/rewards-${date}.json`)
```

### Use Case 4: Check if user has specific badge
```typescript
const userBadges = getUserRewards(userId)
const hasTTSBadge = userBadges.some(b => b.questId === 'quest-tts-001')
```

### Use Case 5: Recent activity
```typescript
const all = getAllRewards()
const yesterday = Date.now() - (24 * 60 * 60 * 1000)
const recent = all.filter(r => r.timestamp > yesterday)
```

## ⚡ Performance Tips

- The system uses in-memory storage (fast!)
- For production, consider adding database persistence
- Export logs regularly for backup
- Filter results when displaying large lists

## 🤝 Need Help?

1. Check the demos: `npm run demo:reward-simple`
2. Read the docs: [REWARD_TRACKING.md](REWARD_TRACKING.md)
3. Run the tests: `npm test tests/rewardTracking.test.ts`
4. Look at examples: `examples/reward-usage-simple.ts`

---

**Ready to use!** The system is already integrated and working. Just complete quests and check the rewards! 🎉
