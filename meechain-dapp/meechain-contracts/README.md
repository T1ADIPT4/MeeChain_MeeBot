
# 🎮 MeeChain Smart Contracts

โครงการ Smart Contracts สำหรับ MeeChain ecosystem บน Fuse Network

## 📋 Overview

MeeChain Contracts ประกอบด้วย:

- **MeeToken** - ERC-20 token หลักของระบบ
- **MeeBadgeNFT** - Badge NFTs ที่สามารถอัปเกรดได้
- **MembershipNFT** - Soulbound membership NFTs
- **QuestManager** - จัดการ quests และรางวัล
- **BadgeNFTUpgrade** - ระบบอัปเกรด Badge NFTs

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy to Fuse Network

```bash
# Deploy to Fuse Spark Testnet
npx hardhat run scripts/deploy.js --network spark

# Deploy to Fuse Mainnet
npx hardhat run scripts/deploy.js --network fuse
```

## 📁 Contract Structure

```
contracts/
├── MeeToken.sol           # ERC-20 token with minting controls
├── MeeBadgeNFT.sol       # Badge NFTs with upgrade system
├── MembershipNFT.sol     # Soulbound membership NFTs
├── QuestManager.sol      # Quest system with rewards
└── BadgeNFTUpgrade.sol   # Badge upgrade mechanics
```

## 🔗 Contract Interactions

### 1. MeeToken Features
- ✅ ERC-20 standard compliance
- ✅ Controlled minting system
- ✅ Authorization management
- ✅ Burn functionality for upgrades

### 2. Badge System
- ✅ 5 rarity levels: COMMON → RARE → EPIC → LEGENDARY → MYTHIC
- ✅ MEE token burning for upgrades
- ✅ Quest reward integration
- ✅ Power score progression

### 3. Quest System
- ✅ Create and manage quests
- ✅ Automatic reward distribution
- ✅ Badge minting on completion
- ✅ Authorization checking

## 🧪 Testing

การทดสอบครอบคลุม:

- ✅ Token minting และ authorization
- ✅ Badge NFT creation และ upgrades
- ✅ Quest completion flow
- ✅ Integration testing
- ✅ Edge cases และ security

```bash
# Run specific test file
npx hardhat test test/badge.test.js

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run with coverage
npx hardhat coverage
```

## 🌐 Network Configuration

### Fuse Network (Mainnet)
- **Chain ID**: 122
- **RPC URL**: https://rpc.fuse.io/
- **Explorer**: https://explorer.fuse.io/
- **Gas Price**: ~10 gwei

### Fuse Spark (Testnet)
- **Chain ID**: 123
- **RPC URL**: https://rpc.fusespark.io/
- **Explorer**: https://explorer.fusespark.io/
- **Faucet**: https://chaindrop.org/?chainid=123

## 🔑 Environment Setup

สร้างไฟล์ `.env`:

```bash
# Private key for deployment
PRIVATE_KEY=your_private_key_here

# API keys (optional)
FUSE_API_KEY=your_fuse_api_key
REPORT_GAS=false
```

## 📊 Contract Addresses

หลังจาก deploy สำเร็จ contract addresses จะถูกบันทึกและแสดงดังนี้:

```json
{
  "network": "fuse",
  "contracts": {
    "MeeToken": "0x...",
    "MeeBadgeNFT": "0x...",
    "MembershipNFT": "0x...", 
    "QuestManager": "0x...",
    "BadgeNFTUpgrade": "0x..."
  }
}
```

## 🔧 Development Commands

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet
npm run deploy:mainnet

# Verify contracts
npm run verify

# Generate documentation
npm run docs
```

## 🛡️ Security Features

- ✅ **Access Control**: Owner-only functions
- ✅ **Reentrancy Protection**: ReentrancyGuard
- ✅ **Pausable**: Emergency pause functionality
- ✅ **Authorization**: Controlled minting permissions
- ✅ **Validation**: Input parameter checking

## 🎯 Usage Examples

### Complete a Quest

```javascript
// JavaScript example
const questManager = new ethers.Contract(questManagerAddress, abi, signer);
await questManager.completeQuest(0); // Complete quest ID 0
```

### Upgrade a Badge

```javascript
// JavaScript example  
const badgeUpgrade = new ethers.Contract(upgradeAddress, abi, signer);
await badgeUpgrade.upgradeBadge(tokenId); // Upgrade badge with tokenId
```

### Check User's Badges

```javascript
// JavaScript example
const badgeNFT = new ethers.Contract(badgeAddress, abi, provider);
const userBadges = await badgeNFT.getUserBadges(userAddress);
```

## 📚 Additional Resources

- [Fuse Network Documentation](https://docs.fuse.io/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

---

🎮 **MeeChain**: Making Web3 accessible and fun for everyone!
