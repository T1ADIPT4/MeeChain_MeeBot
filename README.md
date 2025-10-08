# MeeChain_MeeBot

MeeChain เป็นแพลตฟอร์ม Web3 ที่ออกแบบมาเพื่อสร้างประสบการณ์ที่สนุกและปลอดภัยผ่านระบบ NFT, Quest, และ MeeBot ที่มีอารมณ์ตอบสนองแบบเรียลไทม์

## 🔧 Features

- ✅ Fallback-aware multi-chain minting
- 🤖 MeeBot sprite + TTS feedback
- 🏆 Quest tracker & badge system
- 💬 Emotional journey microcopy system
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

# Run Emotional Microcopy demo
npm run demo:emotional-microcopy

# Run tests (45 comprehensive tests)
npm test
```

### Documentation

- 📖 [Quest System Overview](QUEST_SYSTEM.md) - Complete API reference and usage guide
- 🔌 [Integration Guide](INTEGRATION.md) - React, Web3, Firebase integration examples
- 🏗️ [Architecture](ARCHITECTURE.md) - System design and data flow diagrams
- ⚙️ [Settings & Support Pages](SETTINGS_SUPPORT.md) - Settings and Support page documentation
- 💬 [Emotional Microcopy System](EMOTIONAL_MICROCOPY.md) - Developer emotional journey and contextual messaging
- 📋 [Emotional Microcopy Quick Reference](EMOTIONAL_MICROCOPY_QUICKREF.md) - Quick usage guide

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

All 45 tests passing with 100% success rate:
- ✅ Quest verification
- ✅ Primary chain minting
- ✅ Automatic fallback
- ✅ Error handling
- ✅ Progress tracking
- ✅ Event logging
- ✅ TTS Quest badge system (14 tests)
- ✅ Emotional microcopy system (31 tests)

## 📁 Project Structure

```
MeeChain_MeeBot/
├── src/
│   ├── QuestManager.ts          # Main orchestrator
│   ├── verifiers/
│   │   ├── questVerifier.ts     # Quest condition verification
│   │   └── TTSQuestVerifier.ts  # TTS quest verification
│   ├── minting/
│   │   └── badgeMinter.ts       # Badge minting with fallback
│   ├── utils/
│   │   ├── logger.ts            # Event logging system
│   │   └── emotionalMicrocopy.ts # Emotional journey microcopy
│   ├── example.ts               # Usage examples
│   └── test.ts                  # Test suite
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
│   ├── tts-quest-demo.ts        # TTS Quest demo
│   └── emotional-microcopy-demo.ts # Emotional microcopy demo
├── tests/
│   ├── ttsQuest.test.ts         # TTS Quest tests (14 tests)
│   └── emotionalMicrocopy.test.ts # Emotional microcopy tests (31 tests)
├── QUEST_SYSTEM.md              # Quest system documentation
├── INTEGRATION.md               # Integration guide
├── ARCHITECTURE.md              # Architecture diagrams
├── SETTINGS_SUPPORT.md          # Settings/Support documentation
├── EMOTIONAL_MICROCOPY.md       # Emotional microcopy documentation
├── EMOTIONAL_MICROCOPY_QUICKREF.md # Quick reference guide
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT

