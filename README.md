# MeeChain_MeeBot

MeeChain เป็นแพลตฟอร์ม Web3 ที่ออกแบบมาเพื่อสร้างประสบการณ์ที่สนุกและปลอดภัยผ่านระบบ NFT, Quest, และ MeeBot ที่มีอารมณ์ตอบสนองแบบเรียลไทม์

## 🔧 Features

- ✅ Fallback-aware multi-chain minting
- 🤖 MeeBot sprite + TTS feedback
- 🏆 Quest tracker & badge system
- 📊 Leaderboard & reward tracking
- 🛡️ Admin panel for badge management
- ⚙️ Settings page with modular toggles
- 🆘 Support page with FAQ system
- 🎨 NFT Football & Productivity collections

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

# Run Admin System demo
npm run demo:admin

# Run tests (26 comprehensive tests)
npm test
```

### Documentation

- 📖 [Quest System Overview](QUEST_SYSTEM.md) - Complete API reference and usage guide
- 🔌 [Integration Guide](INTEGRATION.md) - React, Web3, Firebase integration examples
- 🏗️ [Architecture](ARCHITECTURE.md) - System design and data flow diagrams
- ⚙️ [Settings & Support Pages](SETTINGS_SUPPORT.md) - Settings and Support page documentation
- 🛡️ [Admin System & Leaderboard](ADMIN_SYSTEM.md) - Admin panel, leaderboard, and reward tracking

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

All 26 tests passing with 100% success rate:
- ✅ Quest verification (3 tests)
- ✅ Badge minting (4 tests)
- ✅ Quest status (2 tests)
- ✅ TTS quest system (5 tests)
- ✅ Reward tracking (4 tests)
- ✅ Admin actions (2 tests)
- ✅ Integration tests (3 tests)
- ✅ Leaderboard data (1 test)
- ✅ Event logging (2 tests)

## 📁 Project Structure

```
MeeChain_MeeBot/
├── src/
│   ├── QuestManager.ts          # Main orchestrator
│   ├── verifiers/
│   │   ├── questVerifier.ts     # Quest condition verification
│   │   └── TTSQuestVerifier.ts  # TTS-specific quest verification
│   ├── minting/
│   │   └── badgeMinter.ts       # Badge minting with fallback
│   ├── utils/
│   │   └── logger.ts            # Event logging system
│   ├── example.ts               # Usage examples
│   └── test.ts                  # Test suite
├── tracker/
│   ├── RewardTracker.ts         # Reward tracking system
│   └── RewardExporter.ts        # Reward log export
├── admin/
│   ├── AdminPanel.tsx           # Admin interface
│   ├── Leaderboard.tsx          # Leaderboard component
│   └── AdminActions.ts          # Manual badge granting
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
│   └── admin-demo.ts            # Admin system demo
├── tests/
│   ├── ttsQuest.test.ts         # TTS quest test suite
│   └── rewardTracking.test.ts   # Reward tracking test suite
├── QUEST_SYSTEM.md              # Quest system documentation
├── INTEGRATION.md               # Integration guide
├── ARCHITECTURE.md              # Architecture diagrams
├── SETTINGS_SUPPORT.md          # Settings/Support documentation
├── ADMIN_SYSTEM.md              # Admin & Leaderboard documentation
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT

