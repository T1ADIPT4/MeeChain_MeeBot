# MeeChain_MeeBot

MeeChain เป็นแพลตฟอร์ม Web3 ที่ออกแบบมาเพื่อสร้างประสบการณ์ที่สนุกและปลอดภัยผ่านระบบ NFT, Quest, และ MeeBot ที่มีอารมณ์ตอบสนองแบบเรียลไทม์

## 🔧 Features

- ✅ **Automated Deploy-Registry System** - Multi-chain contract deployment automation
- ✅ **Web3.js Integration** - Complete smart contract integration with BSC
- ✅ Fallback-aware multi-chain minting
- 🌐 Multi-chain contract registry (Ethereum, Polygon, Arbitrum)
- 🤖 MeeBot sprite + TTS feedback
- 🏆 Quest tracker & badge system
- 🎨 NFT Football & Productivity collections
- 🛡️ Admin panel for contract authorization
- 📊 Dashboard with badge provenance & fallback logs
- ⚙️ Settings page with modular toggles
- 📤 **Log Export** - JSON/CSV export with provenance
- 🆘 Support page with FAQ system
- 🚀 **NEW**: Automated deployment workflow with MSIX packaging

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
copilot/automate-deploy-registry-json
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
- 🔗 [Web3.js Integration Guide](WEB3_INTEGRATION_GUIDE.md) - Complete Web3.js integration with MeeChainSupply
- ⚡ [Web3.js Quick Reference](WEB3_QUICK_REFERENCE.md) - Quick reference for Web3.js usage
- 🤖 [Deploy Automation](DEPLOY_AUTOMATION.md) - Automated deployment system guide
- 🔌 [Integration Guide](INTEGRATION.md) - React, Web3, Firebase integration examples
- 🏗️ [Architecture](ARCHITECTURE.md) - System design and data flow diagrams
- ⚙️ [Settings & Support Pages](SETTINGS_SUPPORT.md) - Settings and Support page documentation
- 🚀 [Automated Deployment Workflow](WORKFLOW_GUIDE.md) - GitHub Actions workflow for automated releases

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

## 🔗 Web3.js Integration

Complete integration with MeeChainSupply smart contract on BSC:

```typescript
import { initWeb3, toWei } from './utils/web3Config';
import { 
  initMeeChainSupplyContract,
  confirmReplay,
  triggerSupply
} from './utils/meeChainSupplyContract';

// Setup
const web3 = initWeb3(false); // BSC Mainnet
const contract = initMeeChainSupplyContract(web3);

// Confirm replay after verification
await confirmReplay(contract, userAddress, toWei('1.5'), meeBotAddress);

// Trigger supply
await triggerSupply(contract, userAddress, meeBotAddress);
```

**Features:**
- 🌐 BSC Mainnet/Testnet support
- 🔄 Complete contract function wrappers
- 💱 Wei/BNB conversion utilities
- 📡 Event listeners for real-time updates
- 🔒 Secure transaction handling
- 📝 Comprehensive documentation

See [WEB3_INTEGRATION_GUIDE.md](WEB3_INTEGRATION_GUIDE.md) for complete documentation.

## 🧪 Testing

All tests passing with 100% success rate:
- ✅ Quest verification
- ✅ Primary chain minting
- ✅ Automatic fallback
- ✅ Error handling
- ✅ Progress tracking
- ✅ Event logging
- ✅ TTS quest system (14 tests)
- ✅ Deploy registry (9 tests)
- ✅ Dashboard utilities (13 tests)
- ✅ Web3.js integration (16 tests)

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
├── utils/
│   ├── web3Config.ts            # Web3 setup and utilities
│   └── meeChainSupplyContract.ts # Contract integration
├── examples/
│   └── web3-integration-demo.ts # Web3.js demo
├── tests/
│   ├── ttsQuest.test.ts         # TTS quest tests
│   ├── deployRegistry.test.ts   # Deploy registry tests
│   └── web3Integration.test.ts  # Web3.js integration tests
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
│   └── mockData.ts              # Mock data utilities
├── examples/
│   ├── settings-support-demo.ts # Settings/Support demo
│   ├── deploy-registry-demo.ts  # Deploy registry demo
│   ├── dashboard-integration-demo.ts  # Dashboard demo
│   ├── sample-patch.patch       # Example patch file
│   └── README-patches.md        # Patch creation guide
├── docs/                        # Deployment viewer files
│   ├── index.html               # Status viewer page
│   ├── status/
│   │   └── patch-status.json    # Deployment status
│   └── assets/                  # Logo and splash assets
├── msix-template/               # MSIX package template
│   ├── AppxManifest.xml         # Package manifest
│   └── README.md                # MSIX documentation
├── .github/
│   └── workflows/
│       ├── codeql.yml           # Code scanning
│       └── automate-deploy.yml  # Automated deployment
├── QUEST_SYSTEM.md              # Quest system documentation
├── DEPLOY_REGISTRY.md           # Deploy registry documentation
├── DASHBOARD_INTEGRATION.md     # Dashboard integration documentation
├── INTEGRATION.md               # Integration guide
├── ARCHITECTURE.md              # Architecture diagrams
├── SETTINGS_SUPPORT.md          # Settings/Support documentation
├── WORKFLOW_GUIDE.md            # Deployment workflow guide
└── package.json
```

## 🚀 Automated Deployment

MeeChain MeeBot includes a comprehensive automated deployment workflow that handles:

- ✅ Patch application and validation
- ✅ Automated testing and building
- ✅ Status tracking and viewer deployment
- ✅ MSIX package creation with dependencies
- ✅ Code signing with certificates
- ✅ GitHub Release creation

### Quick Deploy

1. **Configure Secrets** (one-time setup):
   - Add `SIGNING_CERT_PFX` (Base64-encoded PFX certificate)
   - Add `SIGNING_CERT_PASSWORD` (Certificate password)

2. **Run Workflow**:
   - Go to **Actions** → **Automated Deploy and Release**
   - Click **Run workflow**
   - Enter patch file name (e.g., `examples/sample-patch.patch`)
   - Enter version (e.g., `1.0.0`)
   - Click **Run workflow**

3. **View Results**:
   - Deployment viewer: `https://<owner>.github.io/<repo>/`
   - GitHub Release: Automatically created with MSIX package

### Documentation

See [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md) for complete setup instructions, certificate generation, troubleshooting, and best practices.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT

