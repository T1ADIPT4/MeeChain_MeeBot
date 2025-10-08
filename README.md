# MeeChain_MeeBot

MeeChain เป็นแพลตฟอร์ม Web3 ที่ออกแบบมาเพื่อสร้างประสบการณ์ที่สนุกและปลอดภัยผ่านระบบ NFT, Quest, และ MeeBot ที่มีอารมณ์ตอบสนองแบบเรียลไทม์

## 🔧 Features

- ✅ Fallback-aware multi-chain minting
- 🤖 MeeBot sprite + TTS feedback
- 🏆 Quest tracker & badge system
- 🎨 NFT Football & Productivity collections
- 🛡️ Admin panel for contract authorization
- ⚙️ Settings page with modular toggles
- 🆘 Support page with FAQ system

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

# Run all tests (40+ comprehensive tests with Jest)
npm test

# Run TTS Badge quest tests only
npm run copilot-test-tts-badge

# Run legacy test suite
npm run test:legacy
```

### Documentation

- 📖 [Quest System Overview](QUEST_SYSTEM.md) - Complete API reference and usage guide
- 🔌 [Integration Guide](INTEGRATION.md) - React, Web3, Firebase integration examples
- 🏗️ [Architecture](ARCHITECTURE.md) - System design and data flow diagrams
- ⚙️ [Settings & Support Pages](SETTINGS_SUPPORT.md) - Settings and Support page documentation

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

**Jest-powered test suite with 40+ tests passing at 100% success rate:**

### Test Categories
- ✅ **Quest System** (10 tests): Quest verification, completion, and status tracking
- ✅ **TTS Badge Quest** (8 tests): TTS-specific quest with fallback support
- ✅ **NFT Football Quest** (13 tests): Voting system with verifier and fallback
- ✅ **Fallback Telemetry** (9 tests): Comprehensive fallback tracking and analytics

### Test Commands
```bash
# Run all tests
npm test

# Run TTS Badge quest tests only
npm run copilot-test-tts-badge

# Run legacy test suite (original 10 tests)
npm run test:legacy
```

### Quest Types
1. **quest-001**: First Steps (login + profile-setup)
2. **quest-002**: NFT Collector (mint 3 NFTs + trade 1)
3. **quest-003**: TTS Badge (enable TTS + use 5 times)
4. **quest-004**: NFT Football (mint football NFT + cast 3 votes)

### Fallback Telemetry Features
- Track fallback usage statistics
- Monitor primary chain failures
- Calculate fallback success rates
- Identify quests using fallback
- Detailed timestamp logging

## 📁 Project Structure

```
MeeChain_MeeBot/
├── src/
│   ├── QuestManager.ts              # Main orchestrator
│   ├── verifiers/
│   │   └── questVerifier.ts         # Quest condition verification (4 quests)
│   ├── minting/
│   │   └── badgeMinter.ts           # Badge minting with fallback
│   ├── utils/
│   │   └── logger.ts                # Event logging & fallback telemetry
│   ├── example.ts                   # Usage examples
│   ├── test.ts                      # Legacy test suite (10 tests)
│   ├── quest-system.spec.ts         # Jest tests for quest system
│   ├── tts-badge.spec.ts            # Jest tests for TTS Badge quest
│   ├── nft-football.spec.ts         # Jest tests for NFT Football quest
│   └── fallback-telemetry.spec.ts   # Jest tests for telemetry
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
│   └── settings-support-demo.ts # Settings/Support demo
├── QUEST_SYSTEM.md              # Quest system documentation
├── INTEGRATION.md               # Integration guide
├── ARCHITECTURE.md              # Architecture diagrams
├── SETTINGS_SUPPORT.md          # Settings/Support documentation
├── jest.config.js               # Jest configuration
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT

