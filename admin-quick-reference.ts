/**
 * Admin Panel Quick Reference
 * This file demonstrates the key features of the Admin Panel & Leaderboard system
 */

// ============================================================
// 1. REWARD TRACKING
// ============================================================

import { 
  trackReward, 
  getAllRewards, 
  getRewardsByUser,
  getBadgeCount 
} from './tracker/RewardTracker'

// Track a reward (automatically called by QuestManager)
trackReward({
  userId: 'user123',
  questId: 'quest-001',
  badgeId: 'badge-001',
  timestamp: Date.now(),
  fallbackUsed: false
})

// Get statistics
const totalRewards = getAllRewards().length
const userBadges = getBadgeCount('user123')

// ============================================================
// 2. LEADERBOARD
// ============================================================

import { Leaderboard } from './admin/Leaderboard'

// Display in React component
function App() {
  return (
    <div>
      <h1>🏆 Top Badge Earners</h1>
      <Leaderboard />
    </div>
  )
}

// ============================================================
// 3. ADMIN PANEL
// ============================================================

import { AdminPanel } from './admin/AdminPanel'

// Full admin dashboard
function AdminDashboard() {
  return (
    <div>
      <h1>🛡️ Admin Control Center</h1>
      <AdminPanel />
    </div>
  )
}

// ============================================================
// 4. ADMIN ACTIONS
// ============================================================

import { triggerManualBadge } from './admin/AdminActions'

// Grant special badge
triggerManualBadge('user123', 'special-event-quest', 'admin-john')

// ============================================================
// 5. EXPORT REWARDS
// ============================================================

import { exportRewardLog } from './tracker/RewardExporter'

// Export all rewards
exportRewardLog('./logs/reward-log.json')

// ============================================================
// 6. INTEGRATION WITH QUEST MANAGER
// ============================================================

import { handleQuestCompletion } from './src/QuestManager'
import { updateUserProgress } from './src/verifiers/questVerifier'

// Complete a quest (reward automatically tracked)
async function completeQuest() {
  updateUserProgress('user123', 'quest-001', 'login', 1)
  updateUserProgress('user123', 'quest-001', 'profile-setup', 1)
  
  const result = await handleQuestCompletion('user123', 'quest-001')
  
  // Reward is automatically tracked in the background!
  console.log(`Badge count: ${getBadgeCount('user123')}`)
}

// ============================================================
// 7. STATISTICS
// ============================================================

import { getFallbackRewards } from './tracker/RewardTracker'

// Calculate fallback usage rate
const allRewards = getAllRewards()
const fallbackRewards = getFallbackRewards()
const fallbackRate = (fallbackRewards.length / allRewards.length) * 100

console.log(`Fallback usage: ${fallbackRate.toFixed(1)}%`)

// ============================================================
// 8. MEEBOT INTEGRATION
// ============================================================

import { MeeBot } from './components/MeeBot'

// Admin mode
MeeBot.setSprite('admin')
MeeBot.speak('เข้าสู่โหมดผู้ดูแลระบบแล้วครับ')

// ============================================================
// QUICK START COMMANDS
// ============================================================

/*
# Build the project
npm run build

# Run admin panel demo
npm run demo:admin-panel

# Run all tests
npm test

# Run specific test
npm test tests/rewardTracker.test.ts
*/

// ============================================================
// KEY FEATURES
// ============================================================

/*
✅ Automatic reward tracking on quest completion
✅ Leaderboard rankings by badge count
✅ Admin dashboard with statistics
✅ Manual badge granting for special events
✅ Export reward logs for audit/analysis
✅ Fallback usage monitoring
✅ MeeBot integration with admin sprite
✅ Comprehensive test coverage (38 tests)
*/
