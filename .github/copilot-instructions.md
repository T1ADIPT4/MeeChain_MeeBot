# 🧠 MeeChain MeeBot Copilot Instructions

## 🔰 Overview / ภาพรวม

MeeChain MeeBot is a Web3 platform featuring NFT badges, quest verification, and an interactive MeeBot with real-time emotional feedback. This repository includes fallback-aware IPFS uploading, multi-chain contract deployment, and comprehensive i18n support (Thai/English).

**เอกสารนี้ใช้สำหรับแนะนำการติดตั้งและใช้งานระบบ MeeBot ซึ่งประกอบด้วยการตรวจสอบ milestone, การสร้าง badge, การอัปโหลด metadata และการแสดงผลผ่าน fallback viewer**

## 📦 Tech Stack

- **Frontend**: React + TypeScript, TailwindCSS
- **Smart Contracts**: Solidity (Multi-chain: Ethereum, Polygon, Arbitrum)
- **Backend**: Node.js, Firebase (optional)
- **IPFS**: Fallback-aware uploader with retry logic
- **Testing**: Jest (57/57 MeeBot checks passing)
- **Build Tools**: TypeScript compiler, ts-node
- **APIs**: Gemini TTS API for MeeBot voice feedback

## 🚀 Installation & Setup

Install dependencies:

```bash
npm install
```

Build the TypeScript project:

```bash
npm run build
```

## 🛠️ Available Commands

### Core Development

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm test` - Run all tests (47+ comprehensive tests)
- `npm run example` - Run usage examples

### MeeBot & IPFS System

- `npm run verify:meebot` - Verify complete MeeBot system (57 checks)
- `npm run ipfs:generate-metadata` - Generate ERC-721 metadata with milestone tracking
- `npm run ipfs:meebot-demo` - Demo MeeBot integration with upload system
- `npm run ipfs:upload-demo` - Test IPFS upload functionality
- `npm run ipfs:test-metadata` - Test metadata generation

### Demos & Examples

- `npm run demo:settings` - Settings/Support page demo
- `npm run demo:tts-quest` - TTS quest verification demo
- `npm run demo:deploy-registry` - Multi-chain deploy registry demo
- `npm run demo:dashboard` - Dashboard integration demo
- `npm run demo:auto-deploy` - Automated deployment workflow demo

### Contract Deployment

- `npm run deploy:badge` - Deploy badge contract
- `npm run deploy:quest` - Deploy quest contract
- `npm run deploy:fallback` - Deploy fallback contract
- `npm run registry:update` - Update deployment registry
- `npm run registry:validate` - Validate registry integrity

### Internationalization (i18n)

- `npm run i18n:demo` - Demo Thai/English language switching
- `npm run i18n:integration` - i18n integration examples

## 📂 Project Structure

```
MeeChain_MeeBot/
├── .github/
│   ├── copilot-instructions.md    # This file
│   └── workflows/                 # CI/CD workflows
├── copilot/                       # MeeBot & IPFS system
│   ├── ipfs-uploader/            # Main uploader with fallback
│   │   ├── index.js              # Upload logic with retry
│   │   ├── config.js             # Fallback-aware config
│   │   ├── metadata-generator.js # ERC-721 metadata
│   │   └── fallback-viewer.js    # Local asset viewer
│   ├── assets/
│   │   ├── badges/               # Badge SVG files (milestone-1.svg, etc.)
│   │   └── fallback/             # Fallback assets (badge-placeholder.svg)
│   ├── meebot-feedback/          # i18n dictionaries (th.js, en.js)
│   ├── milestone.log             # MeeBot sprite feedback tracker
│   └── verifyMeeBotFlow.js       # Automated verification script
├── src/                          # TypeScript source
│   ├── QuestManager.ts           # Main orchestrator
│   ├── verifiers/                # Quest condition verification
│   ├── minting/                  # Badge minting with fallback
│   └── config/                   # Registry types & loader
├── config/
│   └── deploy-registry.json      # Multi-chain contract addresses
├── tests/                        # Jest test suites
├── components/                   # React components (MeeBot.tsx)
└── README.md                     # Main documentation
```

## 📊 Milestone Flow

The system tracks 9 milestones (M1-M9) with MeeBot sprite feedback:

| Milestone | Description | Status Check |
|-----------|-------------|--------------|
| M1 | Setup & badge placeholder | `copilot/assets/fallback/badge-placeholder.svg` |
| M2 | IPFS upload integration | IPFS endpoint configured in `config.js` |
| M3 | Metadata generation & fallback | `metadata-generator.js` with ERC-721 compliance |
| M4 | Viewer & asset validation | `fallback-viewer.js` serves local assets |
| M5 | MeeBot sprite feedback | MeeBot component displays milestone sprites |
| M6 | Answer accuracy verification | 98%+ accuracy on MeeChain dataset (40/41) |
| M7 | Automatic milestone logging | `milestone.log` auto-updates on events |
| M8 | NFT badge minting | Multi-chain minting via `badgeMinter.ts` |
| M9 | Deploy & dashboard integration | Contract deployment + dashboard UI |

Run `npm run verify:meebot` to check all milestone requirements (57 automated checks).

## 🧩 Key Features

### Fallback-Aware Architecture

- **IPFS Upload**: Primary endpoint with automatic failover to alternatives (Pinata, ipfs.io, dweb.link)
- **Local Fallback**: Serves assets from `copilot/assets/fallback/` when IPFS unavailable
- **Retry Logic**: Configurable retry attempts with exponential backoff
- **Simulation Mode**: Toggle via environment variables for testing without IPFS

### MeeBot Integration

- **Sprite System**: Displays colored sprite feedback per milestone (🟢🟣🟡🔵🟠)
- **Thai Language Support**: Full i18n with Thai (th.js) and English (en.js) dictionaries
- **TTS Feedback**: Gemini API integration for voice responses
- **Milestone Tracking**: Automatic logging in `copilot/milestone.log`

### Multi-Chain Support

- **Deploy Registry**: Centralized registry in `config/deploy-registry.json`
- **Supported Chains**: Ethereum Mainnet, Polygon, Arbitrum, Sepolia, Mumbai testnet
- **Automatic Failover**: Switches to backup chain if primary minting fails
- **Contract Types**: Badge, Quest, Fallback contracts with versioning

## 🧪 Testing & Verification

### Run All Tests

```bash
npm test
```

### Verify MeeBot System

```bash
npm run verify:meebot
```

Expected output: `57/57 checks passed (100%)`

### Test Individual Components

- `npm run copilot-test-tts-badge` - TTS badge minting tests
- `npm run ipfs:test-metadata` - Metadata generation tests
- `npm run registry:validate` - Registry integrity validation

## 📖 Documentation

### Core Documentation

- `README.md` - Project overview and getting started
- `QUEST_SYSTEM.md` - Quest verification API reference
- `DEPLOY_REGISTRY.md` - Multi-chain deployment guide
- `INTEGRATION.md` - React, Web3, Firebase integration
- `ARCHITECTURE.md` - System design and data flow

### Copilot-Specific Docs

- `copilot/README.md` - IPFS uploader documentation
- `copilot/VERIFICATION_GUIDE.md` - Detailed verification guide
- `copilot/CHECKLIST_IMPLEMENTATION_SUMMARY.md` - Implementation checklist
- `copilot/meebot-feedback/README.md` - i18n dictionary guide

### Component READMEs

- `copilot/assets/badges/README.md` - Badge asset guidelines
- `copilot/assets/fallback/README.md` - Fallback asset strategy
- `copilot/ipfs-uploader/README.md` - Uploader API reference

## 🔧 Configuration

### Environment Variables

```bash
# IPFS Configuration
IPFS_ENDPOINT="https://ipfs.infura.io:5001"
IPFS_TIMEOUT=5000
IPFS_MAX_RETRIES=3
IPFS_RETRY_DELAY=1000

# Pinata (optional)
PINATA_JWT="your-jwt-token"

# Simulation Mode
NODE_ENV="development"  # or "production"
```

### Config Files

- `copilot/ipfs-uploader/config.js` - IPFS and fallback settings
- `config/deploy-registry.json` - Contract addresses per chain
- `tsconfig.json` - TypeScript compiler options

## ✅ Best Practices

### When Making Changes

1. **Run verification first**: `npm run verify:meebot` to establish baseline
2. **Build before testing**: `npm run build` before running demos
3. **Test incrementally**: Use specific test commands, not just `npm test`
4. **Check i18n**: Verify both Thai and English when updating messages
5. **Update milestone.log**: Log significant changes with MeeBot feedback format

### Code Style

- **TypeScript**: Use strict type checking, avoid `any`
- **Comments**: Match existing style (minimal inline, JSDoc for public APIs)
- **Error Handling**: Always include fallback logic for external services
- **Logging**: Use structured logging with milestone markers

### IPFS & Metadata

- **Metadata Format**: Must comply with ERC-721 standard
- **File Validation**: Check size (max 10MB), format (PNG/SVG/JPEG)
- **CID Verification**: Validate IPFS CIDs before storing
- **Fallback Assets**: Always provide placeholder in `copilot/assets/fallback/`

## 🐛 Troubleshooting

### Common Issues

**"milestone.log not found"**: Check `copilot/milestone.log` exists and is readable

**"config.js missing"**: Ensure `copilot/ipfs-uploader/config.js` has all required fields (ipfsEndpoint, fallbackEndpoints, fallbackAssetPath)

**"Badge placeholder missing"**: Add `badge-placeholder.svg` to `copilot/assets/fallback/`

**Build failures**: Run `npm install` to ensure dependencies are installed

**Test failures**: Verify Node.js version >= 16, TypeScript >= 5.0

### Debug Commands

```bash
# Check system status
npm run verify:meebot

# Test IPFS connectivity
npm run ipfs:upload-demo

# Validate contracts
npm run registry:validate

# Check i18n
npm run i18n:demo
```

## 📝 Notes

- Verification script checks 57 items across 6 categories (Milestone Log, Badge Assets, Config, Uploader/Metadata, Viewer/MeeBot, i18n)
- MeeBot achieves 98% accuracy (40/41) on MeeChain dataset
- All npm commands are production-ready and tested
- System supports offline development via simulation mode

---

**MeeBot**: "เอกสารพร้อมแล้วครับ ครู!" 📘🟢
