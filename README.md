# MeeChain_MeeBot

MeeChain เป็นแพลตฟอร์ม Web3 ที่ออกแบบมาเพื่อสร้างประสบการณ์ที่สนุกและปลอดภัยผ่านระบบ NFT, Quest, และ MeeBot ที่มีอารมณ์ตอบสนองแบบเรียลไทม์

## 🔧 Features

- ✅ **Automated Deploy-Registry System** - Multi-chain contract deployment automation
- ✅ **Badge SBT System** - Soulbound achievement tokens with unlock animations
- ✅ **Badge Ownership Verification** - Soulbound token (SBT) system for contributor badges
- ✅ **Contributor Explorer** - Search and explore all contributors with badges and reputation
- ✅ **MeeBot Web3 Backend API** - REST API for Web3 interactions (NEW!)
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
- 🚀 **MSIX Packaging** - Automated deployment workflow
- 🚀 **NEW**: Automated deployment workflow with MSIX packaging
- 🔍 **NEW**: Auditor Dashboard with refund monitoring and flag system
- 🔍 **NEW**: Auditor Dashboard for DAO Governance
- 📥 **NEW**: CSV Export & Dispute Flagging System
- 🏛️ **NEW**: DAO Proposal Generation
- 🔐 **NEW**: Refund Audit Trail System - Complete logging and audit for refund operations
- 🚀 Automated deployment workflow with MSIX packaging

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

# Start the frontend
npm run dev

# Start the backend API server (in a separate terminal)
npm run server
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
npm run demo:dao-governance        # DAO Governance demo (NEW!)

# Start API server for DAO Governance
npm run api:start                  # Start REST API server
npm run api:dev                    # Start with auto-reload
npm run demo:refund-audit          # Refund audit trail demo
npm run demo:refund-contract       # Refund contract integration demo

# Deploy contracts (automated)
npm run deploy <network>           # Deploy to specific network
npm run validate-registry          # Validate registry integrity

# Run tests
npm test                           # All tests
npm test tests/api.test.ts         # API tests only
```

### 🏛️ DAO Governance & Export Log System

**NEW!** Complete system for transparent refund management with DAO oversight:

```bash
# Start the API server
npm run api:start

# Run the complete demo workflow
npm run demo:dao-governance
```

### 🏅 Badge System (Soulbound Tokens)

Deploy and manage achievement badges as non-transferable NFTs:

```bash
# Compile and deploy badge contract
npx hardhat compile
npm run deploy:badge -- --network bscTestnet

# Register badge types
npm run register:badges -- --network bscTestnet

# Run badge system tests
npm test tests/badgeSystem.test.ts
```

**Features:**
- 🔒 Soulbound (non-transferable) achievement tokens
- 🎨 Badge gallery with locked/unlocked states
- ✨ Unlock animations with confetti effects
- 📊 Rarity system (Common, Rare, Epic, Legendary)
- 🏆 Category system (Achievement, Milestone, Quest, Special)
- 🎯 Quest integration ready

**Quick Start:** See [BADGE_QUICKSTART.md](BADGE_QUICKSTART.md)  
**Full Documentation:** See [BADGE_SYSTEM_GUIDE.md](BADGE_SYSTEM_GUIDE.md)
**Key Features:**
- 📥 **CSV Export** - Export all refund logs for auditing
- 🚩 **Dispute Flagging** - Community can flag suspicious refunds
- 📝 **DAO Proposals** - Auto-generate Snapshot-compatible proposals
- 🎨 **Auditor Dashboard** - Beautiful React UI for log management
- 📊 **Real-time Statistics** - Track pending, verified, and flagged refunds
- 🔗 **BscScan Integration** - Direct links to blockchain transactions

**API Endpoints:**
```bash
GET  /api/logs/export-csv          # Download CSV
POST /api/logs/flag                # Flag a refund
GET  /api/logs                     # Get all logs
```

See [EXPORT_LOG_SYSTEM.md](EXPORT_LOG_SYSTEM.md) for complete documentation.

---

### 🚀 Automated Deploy-Registry System

The automated system manages contract deployments across multiple chains:

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

### 🔍 Auditor Dashboard

The Auditor Dashboard provides transparent monitoring of refund transactions:

```bash
# Start the API server
npm run server

# In another terminal, start the frontend
npm run dev

# Access the dashboard at http://localhost:5173/auditor-dashboard
```

**Features:**
- 📊 Real-time refund log monitoring
- 🔍 Search by address, transaction hash, or refund ID
- 📅 Date range filtering
- 🚨 Flag suspicious transactions
- 📄 Export logs to CSV
- 🔔 Discord webhook notifications

See [AUDITOR_DASHBOARD.md](AUDITOR_DASHBOARD.md) for complete documentation.
### 🌐 MeeBot Web3 Backend API (NEW!)

A complete REST API for secure Web3 interactions with the MeeChain Supply smart contract:

```bash
# Quick start
npm run api:dev

# Test the API
curl http://localhost:3000/health

# Confirm replay
curl -X POST http://localhost:3000/api/meechain/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x...",
    "action": "replay",
    "amountBNB": "0.01"
  }'
```

**Features:**
- ✅ Replay confirmation endpoint
- ✅ Token supply trigger
- ✅ Refund processing
- ✅ Transaction monitoring
- ✅ Database logging (Firebase + in-memory)
- ✅ 32 tests with 100% pass rate
- ✅ Production ready with Docker/PM2 support

**Documentation:**
- Quick Start: [QUICKSTART_API.md](QUICKSTART_API.md)
- Implementation Guide: [MEEBOT_WEB3_BACKEND_GUIDE.md](MEEBOT_WEB3_BACKEND_GUIDE.md)
- API Reference: [api/README.md](api/README.md)
- Integration Examples: [examples/api-integration-demo.ts](examples/api-integration-demo.ts)
- Summary: [IMPLEMENTATION_MEEBOT_API.md](IMPLEMENTATION_MEEBOT_API.md)

### Documentation

- 📖 [Quest System Overview](QUEST_SYSTEM.md) - Complete API reference and usage guide
- 🌐 [Deploy Registry](DEPLOY_REGISTRY.md) - Multi-chain contract deployment registry
- 🏅 [Badge Ownership Guide](BADGE_OWNERSHIP_GUIDE.md) - Badge verification and Contributor Explorer
- 🔍 [Auditor Dashboard](AUDITOR_DASHBOARD.md) - Refund monitoring and flag notification system
- 🤖 [Deploy Automation](DEPLOY_AUTOMATION.md) - Automated deployment system guide
- 🤖 [Deploy Automation](DEPLOY_AUTOMATION.md) - Automated deployment system guide
- 🔐 [Refund Audit System](REFUND_AUDIT_SYSTEM.md) - Complete refund logging and audit trail
- 🚀 [Refund Quick Start](REFUND_QUICK_START.md) - Get started with refund system in minutes
- 🔗 [Web3.js Integration Guide](WEB3_INTEGRATION_GUIDE.md) - Complete Web3.js integration with MeeChainSupply
- ⚡ [Web3.js Quick Reference](WEB3_QUICK_REFERENCE.md) - Quick reference for Web3.js usage
- 🤖 [Deploy Automation](DEPLOY_AUTOMATION.md) - Automated deployment system guide
- 🔌 [Integration Guide](INTEGRATION.md) - React, Web3, Firebase integration examples
- 🏗️ [Architecture](ARCHITECTURE.md) - System design and data flow diagrams
- ⚙️ [Settings & Support Pages](SETTINGS_SUPPORT.md) - Settings and Support page documentation
- 🚀 [Automated Deployment Workflow](WORKFLOW_GUIDE.md) - GitHub Actions workflow for automated releases
- 🔍 **[Export Log System](EXPORT_LOG_SYSTEM.md)** - Complete system overview and implementation guide
- 📡 **[API Documentation](API_DOCUMENTATION.md)** - RESTful API reference for refund log management
- 🎨 **[Auditor Dashboard Integration](AUDITOR_DASHBOARD_INTEGRATION.md)** - Dashboard setup and customization

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

## 🏅 Badge Ownership System

MeeChain now features a complete badge ownership verification system:

**Smart Contract (MeeChainBadge.sol):**
- Soulbound Token (SBT) implementation - non-transferable badges
- `hasBadge(user, badgeId)` - Check single badge ownership
- `getBadges(user)` - Get all badges for an address
- `getBadgeType(tokenId)` - Get badge type name
- Owner-controlled minting and revocation

**Contributor Explorer UI:**
- Search contributors by name or address
- Filter by reputation score and badge type
- Display badges with on-chain verification links
- Top contributors leaderboard
- Direct BscScan integration for transparency

```typescript
// Check if user has a badge
const hasWatchdog = await badgeContract.methods
  .hasBadge(userAddress, WATCHDOG_ID)
  .call();

// Get all user badges
const badges = await badgeContract.methods
  .getBadges(userAddress)
  .call();
```

See [Badge Ownership Guide](BADGE_OWNERSHIP_GUIDE.md) for complete documentation and examples.

## 🧪 Testing

All 178+ tests passing with high success rate:
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
- ✅ Badge ownership verification (29 tests)
- ✅ Contributor service (29 tests)
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

