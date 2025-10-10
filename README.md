# MeeChain_MeeBot

MeeChain เป็นแพลตฟอร์ม Web3 ที่ออกแบบมาเพื่อสร้างประสบการณ์ที่สนุกและปลอดภัยผ่านระบบ NFT, Quest, และ MeeBot ที่มีอารมณ์ตอบสนองแบบเรียลไทม์

## 🔧 Features

- ✅ Fallback-aware multi-chain minting
- 🌐 Multi-chain contract registry (Ethereum, Polygon, Arbitrum)
- 🤖 MeeBot sprite + TTS feedback
- 🏆 Quest tracker & badge system
- 🎨 NFT Football & Productivity collections
- 🛡️ Admin panel for contract authorization
- 📊 Dashboard with badge provenance & fallback logs
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

# Run Deploy Registry demo
npm run demo:deploy-registry

# Run Dashboard Integration demo
npm run demo:dashboard

# Run Milestone Integration demo
npm run demo:milestone

# Run tests (46 comprehensive tests)
npm test
```

### Documentation

- 📖 [Quest System Overview](QUEST_SYSTEM.md) - Complete API reference and usage guide
- 🌿 [Branch Structure Guide](BRANCH_GUIDE.md) - Branch naming conventions and workflow
- 🎯 [Milestone Guide](MILESTONE_GUIDE.md) - Milestone tracking with sprite feedback
- 🌐 [Deploy Registry](DEPLOY_REGISTRY.md) - Multi-chain contract deployment registry
- 📊 [Dashboard Integration](DASHBOARD_INTEGRATION.md) - Dashboard and Admin page integration
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

All 46 tests passing with 100% success rate:
- ✅ Quest verification
- ✅ Primary chain minting
- ✅ Automatic fallback
- ✅ Error handling
- ✅ Progress tracking
- ✅ Event logging
- ✅ TTS quest system (14 tests)
- ✅ Deploy registry (9 tests)
- ✅ Dashboard utilities (13 tests)

## 📁 Project Structure

```
MeeChain_MeeBot/
├── config/
│   └── deploy-registry.json     # Multi-chain contract addresses
├── src/
│   ├── QuestManager.ts          # Main orchestrator
│   ├── config/
│   │   ├── registryTypes.ts     # Deploy registry types
│   │   └── registryLoader.ts    # Registry loader utilities
│   ├── verifiers/
│   │   └── questVerifier.ts     # Quest condition verification
│   ├── minting/
│   │   └── badgeMinter.ts       # Badge minting with fallback
│   ├── utils/
│   │   └── logger.ts            # Event logging system
│   ├── example.ts               # Usage examples
│   └── test.ts                  # Test suite
├── tests/
│   ├── ttsQuest.test.ts         # TTS quest tests
│   └── deployRegistry.test.ts   # Deploy registry tests
├── pages/
│   ├── Settings.tsx             # Settings page
│   ├── Support.tsx              # Support/FAQ page
│   ├── dashboard.tsx            # Dashboard page (badges & logs)
│   └── admin.tsx                # Admin override page
├── components/
│   ├── MeeBot.tsx               # MeeBot sprite/TTS stub
│   ├── SettingToggle.tsx        # Toggle component
│   ├── BadgeList.tsx            # Badge list with provenance
│   └── FallbackLog.tsx          # Fallback log display
├── hooks/
│   ├── useSettings.ts           # Settings hook
│   └── useFAQ.ts               # FAQ hook
├── utils/
│   ├── settingsLoader.ts        # Fallback-aware settings loader
│   ├── fallbackFAQ.ts           # Fallback-aware FAQ loader
│   ├── registry.ts              # Registry utility for UI
│   ├── mockData.ts              # Mock data utilities
│   └── milestoneReader.ts       # Milestone log reader
├── examples/
│   ├── settings-support-demo.ts # Settings/Support demo
│   ├── deploy-registry-demo.ts  # Deploy registry demo
│   ├── dashboard-integration-demo.ts  # Dashboard demo
│   └── milestone-integration-demo.ts  # Milestone tracking demo
├── BRANCH_GUIDE.md              # Branch structure guide
├── MILESTONE_GUIDE.md           # Milestone tracking guide
├── QUEST_SYSTEM.md              # Quest system documentation
├── DEPLOY_REGISTRY.md           # Deploy registry documentation
├── DASHBOARD_INTEGRATION.md     # Dashboard integration documentation
├── INTEGRATION.md               # Integration guide
├── ARCHITECTURE.md              # Architecture diagrams
├── SETTINGS_SUPPORT.md          # Settings/Support documentation
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT

