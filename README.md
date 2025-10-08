# MeeChain_MeeBot

MeeChain เป็นแพลตฟอร์ม Web3 ที่ออกแบบมาเพื่อสร้างประสบการณ์ที่สนุกและปลอดภัยผ่านระบบ NFT, Quest, และ MeeBot ที่มีอารมณ์ตอบสนองแบบเรียลไทม์

## 🔧 Features

- ✅ Fallback-aware multi-chain minting
- 🤖 MeeBot sprite + TTS feedback
- 🏆 Quest tracker & badge system
- 🎖️ **Reward Tracker** - Track and display badge rewards with analytics
- 🎨 NFT Football & Productivity collections
- 🛡️ Admin panel for contract authorization
- ⚙️ Settings page with modular toggles
- 🆘 Support page with FAQ system
- 📊 System telemetry and health monitoring

## 📦 Tech Stack

- React + TypeScript
- Smart Contracts (Solidity)
- Replit + GitHub
- TailwindCSS
- Firebase (optional)
- Gemini TTS API

## 🚀 Getting Started

```bash
git clone https://github.com/TLADPT14/MeeChain_MeeBot.git
cd MeeChain_MeeBot
npm install
npm run dev
```

## 🎯 Quest System

The MeeChain Quest System is a production-ready, fallback-aware quest verification and badge minting system featuring:

- **Modular Architecture**: Separated verification, minting, and logging
- **Automatic Fallback**: Switches to backup chain if primary minting fails
- **Full Auditability**: Comprehensive event logging for all operations
- **Type-Safe**: Complete TypeScript implementation

### Quick Start

```bash
# Build the project
npm run build

# Run examples
npm run example

# Run Settings/Support demo
npm run demo:settings

# Run TTS Quest demo
npm run demo:tts-quest

# Run Reward Tracker demo
npm run demo:reward-tracker

# Run tests (36 comprehensive tests)
npm test

# Run specific test suites
npm run copilot-test-tts-badge
npm run copilot-test-reward-tracker
```

### Documentation

- 📖 [Quest System Overview](QUEST_SYSTEM.md) - Complete API reference and usage guide
- 🔌 [Integration Guide](INTEGRATION.md) - React, Web3, Firebase integration examples
- 🏗️ [Architecture](ARCHITECTURE.md) - System design and data flow diagrams
- ⚙️ [Settings & Support Pages](SETTINGS_SUPPORT.md) - Settings and Support page documentation
- 🎖️ [Reward Tracker System](REWARD_TRACKER.md) - Badge tracking, analytics, and telemetry

### Example Usage

```typescript
import { handleQuestCompletion } from './src/QuestManager'
import { updateUserProgress } from './src/verifiers/questVerifier'

// Update user progress
updateUserProgress('user-001', 'quest-001', 'login', 1)
updateUserProgress('user-001', 'quest-001', 'profile-setup', 1)

// Complete quest with automatic fallback
const result = await handleQuestCompletion('user-001', 'quest-001')

if (result.success) {
  if (result.fallback) {
    console.log('✅ Badge minted via fallback chain')
  } else {
    console.log('✅ Badge minted successfully')
  }
  console.log(`Transaction: ${result.tx?.txHash}`)
}
```

## 🧪 Testing

All 36 tests passing with 100% success rate:
- ✅ Quest verification
- ✅ Primary chain minting
- ✅ Automatic fallback
- ✅ Error handling
- ✅ Progress tracking
- ✅ Event logging
- ✅ Reward tracking
- ✅ Reward analytics
- ✅ System telemetry
- ✅ Export functionality

## 🎖️ Reward Tracker System

The Reward Tracker provides comprehensive badge tracking with analytics and MeeBot integration:

```typescript
import { trackReward, getUserRewards } from './tracker/RewardTracker'
import { getRewardStatistics, generateTelemetryReport } from './tracker/RewardLog'

// Automatically tracked when quest completes
const result = await handleQuestCompletion('user-123', 'quest-tts-001')

// View user's badges
const rewards = getUserRewards('user-123')
console.log(`User has ${rewards.length} badges`)

// Get system statistics
const stats = getRewardStatistics()
console.log(`Fallback rate: ${stats.fallbackPercentage}%`)

// Monitor system health
const report = generateTelemetryReport()
console.log(`Status: ${report.systemHealth.healthStatus}`)
```

**Key Features:**
- 🎯 Automatic tracking on quest completion
- 📊 Analytics and statistics
- 📈 System health monitoring (healthy/warning/critical)
- 💾 Export as JSON or CSV
- 🤖 MeeBot feedback integration
- ⚡ Real-time telemetry

See [REWARD_TRACKER.md](REWARD_TRACKER.md) for complete documentation.

## 📁 Project Structure

```
MeeChain_MeeBot/
├── src/
│   ├── QuestManager.ts          # Main orchestrator with reward tracking
│   ├── verifiers/
│   │   ├── questVerifier.ts     # Quest condition verification
│   │   └── TTSQuestVerifier.ts  # TTS quest verification
│   ├── minting/
│   │   └── badgeMinter.ts       # Badge minting with fallback
│   ├── utils/
│   │   └── logger.ts            # Event logging system
│   ├── example.ts               # Usage examples
│   └── test.ts                  # Test suite
├── tracker/                      # NEW: Reward tracking system
│   ├── RewardTracker.ts         # Core tracking functionality
│   ├── RewardDashboard.tsx      # UI component for rewards
│   └── RewardLog.ts             # Analytics and export
├── pages/
│   ├── Settings.tsx             # Settings page
│   └── Support.tsx              # Support/FAQ page
├── components/
│   ├── MeeBot.tsx               # MeeBot sprite/TTS stub
│   └── SettingToggle.tsx        # Toggle component
├── hooks/
│   ├── useSettings.ts           # Settings hook
│   └── useFAQ.ts               # FAQ hook
├── utils/
│   ├── settingsLoader.ts        # Fallback-aware settings loader
│   └── fallbackFAQ.ts           # Fallback-aware FAQ loader
├── examples/
│   ├── settings-support-demo.ts # Settings/Support demo
│   ├── tts-quest-demo.ts        # TTS quest demo
│   ├── reward-tracker-demo.ts   # Reward tracker demo
│   └── settings-with-rewards.tsx # Settings page with rewards
├── tests/
│   ├── ttsQuest.test.ts         # TTS quest tests
│   └── rewardTracker.test.ts    # Reward tracker tests
├── QUEST_SYSTEM.md              # Quest system documentation
├── INTEGRATION.md               # Integration guide
├── ARCHITECTURE.md              # Architecture diagrams
├── SETTINGS_SUPPORT.md          # Settings/Support documentation
├── REWARD_TRACKER.md            # Reward tracker documentation
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT

