# MeeChain_MeeBot

MeeChain เป็นแพลตฟอร์ม Web3 ที่ออกแบบมาเพื่อสร้างประสบการณ์ที่สนุกและปลอดภัยผ่านระบบ NFT, Quest, และ MeeBot ที่มีอารมณ์ตอบสนองแบบเรียลไทม์

## 🔧 Features

- ✅ Fallback-aware multi-chain minting
- 🤖 MeeBot sprite + TTS feedback
- 🏆 Quest tracker & badge system
- 🎨 NFT Football & Productivity collections
- 🛡️ Admin panel for contract authorization

## 📦 Tech Stack

- React + TypeScript + Vite
- Smart Contracts (Solidity)
- React Router for navigation
- Replit + GitHub
- Firebase (optional)
- Gemini TTS API (optional)

## 🚀 Getting Started

### Frontend Development (React App)

```bash
git clone https://github.com/TLADPT14/MeeChain_MeeBot.git
cd MeeChain_MeeBot
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development (Quest System)

```bash
# Build backend TypeScript
npm run build:backend

# Run examples
npm run example

# Run tests
npm test
```

## ⚙️ Build & Deploy Workflow

### 🔹 Development Workflow

| Step | Command | Description |
|------|---------|-------------|
| Install dependencies | `npm install` | First time setup |
| Start dev server | `npm run dev` | Run Vite dev server (hot reload) |
| View pages | Navigate to routes | `/`, `/mint`, `/nft-football`, `/settings`, `/support` |
| Build backend | `npm run build:backend` | Compile TypeScript backend |
| Build frontend | `npm run build:frontend` | Build React app for production |
| Build all | `npm run build` | Build both backend and frontend |
| Preview build | `npm run preview` | Preview production build locally |

### 🔹 Deployment Options

#### Deploy to GitHub Pages

```bash
# Build the project
npm run build

# Deploy dist-frontend to GitHub Pages
npx gh-pages -d dist-frontend
```

**Note:** The `vite.config.ts` already has `base: '/MeeChain_MeeBot/'` configured for GitHub Pages.

#### Deploy to Vercel / Netlify

1. Connect your GitHub repository
2. Configure build settings:
   - **Build command:** `npm run build:frontend`
   - **Output directory:** `dist-frontend`
   - **Install command:** `npm install`

### 🔹 Routing Structure

The app uses React Router for modular page routing:

```tsx
<Route path="/" element={<HomePage />} />
<Route path="/mint" element={<MintBadgePage />} />
<Route path="/nft-football" element={<NFTFootballPage />} />
<Route path="/settings" element={<SettingsPage />} />
<Route path="/support" element={<SupportPage />} />
```

Each page is self-contained and can be developed/tested independently.

### 🔹 Available Scripts

```json
{
  "dev": "vite",                              // Start dev server
  "build": "tsc && vite build",               // Build everything
  "build:backend": "tsc",                      // Build backend only
  "build:frontend": "vite build",              // Build frontend only
  "preview": "vite preview",                   // Preview production build
  "test": "npm run build:backend && node dist/test.js",  // Run tests
  "example": "npm run build:backend && node dist/example.js",  // Run examples
  "lint": "eslint . --ext .ts,.tsx"           // Lint code
}
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

# Run tests (10 comprehensive tests)
npm test
```

### Documentation

- 📖 [Quest System Overview](QUEST_SYSTEM.md) - Complete API reference and usage guide
- 🔌 [Integration Guide](INTEGRATION.md) - React, Web3, Firebase integration examples
- 🏗️ [Architecture](ARCHITECTURE.md) - System design and data flow diagrams

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
├── src/                          # Backend Quest System
│   ├── QuestManager.ts          # Main orchestrator
│   ├── verifiers/
│   │   └── questVerifier.ts     # Quest condition verification
│   ├── minting/
│   │   └── badgeMinter.ts       # Badge minting with fallback
│   ├── utils/
│   │   └── logger.ts            # Event logging system
│   ├── example.ts               # Usage examples
│   └── test.ts                  # Test suite
├── src-frontend/                # React Frontend App
│   ├── components/              # UI components (MeeBot, StatusMessage, Navigation)
│   ├── pages/                   # Page components (Home, MintBadge, NFTFootball, Settings, Support)
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Frontend utilities
│   ├── assets/                  # Static assets
│   ├── App.tsx                  # Main App component
│   ├── routes.tsx               # Route definitions
│   └── index.html               # HTML entry point
├── public/                      # Static files
├── dist/                        # Backend build output
├── dist-frontend/               # Frontend build output
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript root config
├── tsconfig.backend.json        # Backend TypeScript config
├── tsconfig.app.json            # Frontend TypeScript config
├── QUEST_SYSTEM.md              # Quest system documentation
├── INTEGRATION.md               # Integration guide
├── ARCHITECTURE.md              # Architecture diagrams
└── package.json                 # Dependencies & scripts
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT

