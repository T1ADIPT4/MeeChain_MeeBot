
# 🚀 MeeChain Project

ระบบที่ออกแบบเพื่อให้การจัดการ DNS, onboarding และ branding เป็นเรื่องง่ายและอบอุ่น พร้อมระบบ tokenomics และ NFT membership ที่สมบูรณ์

---

## 📦 Token Contract Features

### 🪙 MeeToken (ERC-20 Extended)
- ✅ Standard ERC-20 functions (`transfer`, `approve`, `allowance`, `balanceOf`, `totalSupply`)
- 🏗️ Reward minting with tier management (`mintReward`)
- 🏆 Automatic tier upgrades based on earnings
- 🔗 Integrated NFT membership system
- ⏸️ Pausable contract for emergency situations
- 📊 Tier tracking and eligibility checking

### 🎖️ MembershipNFT (ERC-721 Soulbound)
- 🏅 Tier-based NFT rewards (Bronze, Silver, Gold, Platinum)
- 🔒 Non-transferable (soulbound) membership tokens
- 🎨 Dynamic metadata based on tier
- 👥 User tier tracking and validation
- 🔐 Authorized minter system

---

## 🎯 Tier System

| Tier | Token Requirement | NFT Reward |
|------|------------------|------------|
| 🥉 Bronze | 100 MEE | Bronze Member NFT |
| 🥈 Silver | 500 MEE | Silver Member NFT |
| 🥇 Gold | 1,000 MEE | Gold Member NFT |
| 💎 Platinum | 5,000 MEE | Platinum Member NFT |

---

## 📁 Project Structure

```
MeeChain/
├── contracts/              # Smart contracts
│   ├── Token.sol           # MeeToken (ERC-20 + tier system)
│   ├── MembershipNFT.sol   # Soulbound membership NFTs
│   └── interfaces/         # Contract interfaces
├── client/src/             # Frontend React application
│   ├── components/         # UI components
│   ├── pages/             # Application pages
│   └── lib/               # Web3 utilities
├── server/                # Backend API
├── docs/                  # Documentation
└── shared/                # Shared types and schemas
```

---

## 🛠️ Installation & Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
```

---

## 🔧 Key Features

### 🤖 MeeBot Integration
- Daily quests and earning opportunities
- Wallet connection helpers
- Network validation (Fuse Network support)
- User onboarding and guidance

### 💰 Token Actions
- Token transfers and approvals
- Swap and bridge functionality
- Faucet integration for testnet tokens
- Transaction history tracking

### 🎮 Gamification
- Mission completion system
- Tier-based rewards
- Team badges and achievements
- Level-up notifications

---

## 📡 Smart Contract Functions

### MeeToken Core Functions
```solidity
// Reward and tier management
mintReward(address to, uint256 amount)
getUserTier(address user) → uint8
checkTierEligibility(address user) → uint8
setMembershipNFT(address nftContract)

// Standard ERC-20
transfer(address to, uint256 amount) → bool
approve(address spender, uint256 amount) → bool
balanceOf(address account) → uint256
```

### MembershipNFT Functions
```solidity
// NFT rewards
mintReward(address to, uint256 tokenId, uint8 tier)
hasTierNFT(address user, uint8 tier) → bool
getUserHighestTier(address user) → uint8
updateTierMetadata(uint8 tier, string name, string uri)
```

---

## 🌐 Network Support

- **Primary**: Fuse Network (Chain ID: 122)
- **Testnet**: Fuse Spark Testnet
- **Features**: Ultra-low fees (~$0.001), 5-second confirmations

---

## 📚 Documentation

- [Smart Contract ABI Summary](./docs/SMART_CONTRACT_ABI_SUMMARY.md)
- [API Specifications](./docs/)
- [Frontend Components Guide](./client/src/components/)

---

## 🔗 Key Integrations

- **Web3**: ethers.js for blockchain interactions
- **UI**: React + TypeScript + Tailwind CSS
- **Wallet**: WalletConnect, MetaMask support
- **Backend**: Express.js API server
- **Database**: Prisma ORM with SQLite

---

## 🚀 Deployment

This project is optimized for deployment on **Replit**:

1. Fork this repository
2. Set up environment variables in Replit Secrets
3. Use the Deploy button for production deployment
4. Access via your custom Replit URL

---

## 📄 License

MIT License - สามารถใช้งานและแก้ไขได้อย่างอิสระ

---

**Built with ❤️ for the MeeChain community**
# MeeChain_MeeBot
