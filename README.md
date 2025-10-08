# MeeChain_MeeBot

MeeChain เป็นแพลตฟอร์ม Web3 ที่ออกแบบมาเพื่อสร้างประสบการณ์ที่สนุกและปลอดภัยผ่านระบบ NFT, Quest, และ MeeBot ที่มีอารมณ์ตอบสนองแบบเรียลไทม์

## 🔧 Features

- ✅ **Automated Deploy-Registry System** - Multi-chain contract deployment automation
- ✅ Fallback-aware multi-chain minting
- 🌐 Multi-chain contract registry (Ethereum, Polygon, Arbitrum)
- 🤖 MeeBot sprite + TTS feedback
- 🏆 Quest tracker & badge system
- 🎨 NFT Football & Productivity collections
- 📊 **Dashboard** - View badges, networks, and fallback logs
- ⚙️ **Admin Panel** - Contract management and log export
- 🛡️ Settings page with modular toggles
- 🆘 Support page with FAQ system
- 📤 **Log Export** - JSON/CSV export with provenance

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

# Run demos
npm run demo:settings              # Settings/Support demo
npm run demo:deploy-registry       # Deploy Registry demo
npm run demo:deploy-automation     # Automated deployment demo

# Deploy contracts (automated)
npm run deploy <network>           # Deploy to specific network
npm run validate-registry          # Validate registry integrity

# Run tests (47 comprehensive tests)
npm test
```

### 🚀 Automated Deploy-Registry System

The new automated system manages contract deployments across multiple chains:

```bash
# Deploy contracts to a network
npm run deploy arbitrum

# Validate the registry
npm run validate-registry

# Export logs with provenance
npm run export-logs

# Run the automation demo
npm run demo:deploy-automation
```

**Features:**
- 🔄 Automatic registry updates after deployment
- ✅ Built-in validation system
- 💾 Automatic backups before changes
- 📤 Export logs to JSON/CSV
- 📊 Dashboard integration
- ⚙️ Admin panel for management

See [DEPLOY_AUTOMATION.md](DEPLOY_AUTOMATION.md) for complete documentation.

### Documentation

- 📖 [Quest System Overview](QUEST_SYSTEM.md) - Complete API reference and usage guide
- 🌐 [Deploy Registry](DEPLOY_REGISTRY.md) - Multi-chain contract deployment registry
- 🤖 [Deploy Automation](DEPLOY_AUTOMATION.md) - Automated deployment system guide
- 🔌 [Integration Guide](INTEGRATION.md) - React, Web3, Firebase integration examples
- 🏗️ [Architecture](ARCHITECTURE.md) - System design and data flow diagrams
- ⚙️ [Settings & Support Pages](SETTINGS_SUPPORT.md) - Settings and Support page documentation
- ✅ [Implementation Summary](IMPLEMENTATION_COMPLETE.md) - Complete implementation metrics

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

All 10 tests passing with 100% success rate:
- ✅ Quest verification
- ✅ Primary chain minting
- ✅ Automatic fallback
- ✅ Error handling
- ✅ Progress tracking
- ✅ Event logging

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
│   └── deploy-registry-demo.ts  # Deploy registry demo
├── QUEST_SYSTEM.md              # Quest system documentation
├── DEPLOY_REGISTRY.md           # Deploy registry documentation
├── INTEGRATION.md               # Integration guide
├── ARCHITECTURE.md              # Architecture diagrams
├── SETTINGS_SUPPORT.md          # Settings/Support documentation
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT

