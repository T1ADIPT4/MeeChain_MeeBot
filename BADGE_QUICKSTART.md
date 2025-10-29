# 🚀 Badge System Quick Start

Get the MeeChain Badge System up and running in 5 minutes.

## 📋 Prerequisites

- Node.js installed
- BNB wallet with testnet/mainnet funds
- BscScan API key (for verification)

## 🔧 Step 1: Install Dependencies

```bash
npm install
```

## ⚙️ Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PRIVATE_KEY=your_private_key_here
BSCSCAN_API_KEY=your_bscscan_api_key
MEECHAIN_BADGE_RPC_URL=https://bsc-dataseed.binance.org
MEECHAIN_BADGE_PRIVATE_KEY=your_badge_private_key
```

## 🏗️ Step 3: Compile Contract

```bash
npx hardhat compile
```

## 🚀 Step 4: Deploy Contract

### Testnet (recommended for testing)
```bash
npx hardhat run scripts/deploy-badge.js --network bscTestnet
```

### Mainnet (production)
```bash
npx hardhat run scripts/deploy-badge.js --network bscMainnet
```

Save the deployed contract address!

## 📝 Step 5: Update Contract Address

Update `.env` with the deployed address:

```env
MEECHAIN_BADGE_CONTRACT_ADDRESS=0x...
```

## 🏅 Step 6: Register Badge Types

```bash
npm run register:badges -- --network bscTestnet
```

## ✅ Step 7: Verify Contract (Optional)

```bash
npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS>
```

## 🎨 Step 8: Integrate Frontend

### Option A: Use BadgeRegistry Component

```tsx
import BadgeRegistry from './viewer/components/BadgeRegistry';

<BadgeRegistry 
  userAddress={userWalletAddress}
  newlyMintedBadges={[1, 3]} // IDs of newly unlocked badges
/>
```

### Option B: Use BadgeGallery Component

```tsx
import BadgeGallery from './viewer/components/BadgeGallery';

<BadgeGallery
  ownedBadgeIds={[1, 2, 5]}
  newlyMintedBadges={[1]}
  onBadgeClick={(badge) => console.log(badge)}
/>
```

## 🧪 Step 9: Test

```bash
# Run badge system tests
npm test tests/badgeSystem.test.ts

# Run all tests
npm test
```

## 📚 Next Steps

- **Mint badges**: Use contract's `mintBadge()` function
- **Batch mint**: Use `batchMintBadges()` for multiple users
- **Customize badges**: Edit `src/config/badgeCatalog.ts`
- **Read full guide**: See [BADGE_SYSTEM_GUIDE.md](./BADGE_SYSTEM_GUIDE.md)

## 🎯 Common Tasks

### Mint a Badge to a User

```javascript
// Using ethers.js
const badgeContract = await ethers.getContractAt("MeeChainBadgeSBT", contractAddress);
await badgeContract.mintBadge(userAddress, badgeId);
```

### Check User's Badges

```javascript
const badges = await badgeContract.getBadgesOf(userAddress);
console.log("User badges:", badges);
```

### Add a New Badge Type

1. Edit `src/config/badgeCatalog.ts`
2. Add new badge entry
3. Run `npm run register:badges -- --network <network>`

## 🐛 Troubleshooting

### "Badge type does not exist"
- Make sure you ran `npm run register:badges`
- Check that badge ID exists in catalog

### "Cannot mint to zero address"
- Verify user address is valid
- Check that address is not 0x0

### "Approvals are not allowed"
- This is expected - badges are soulbound (non-transferable)

## 📞 Need Help?

- **Full Documentation**: [BADGE_SYSTEM_GUIDE.md](./BADGE_SYSTEM_GUIDE.md)
- **Examples**: See `examples/badge-ui-demo.tsx`
- **Tests**: Run `npm test tests/badgeSystem.test.ts`
- **Issues**: [GitHub Issues](https://github.com/T1ADIPT4/MeeChain_MeeBot/issues)

## 🎉 Success!

Your badge system is now ready. Users can earn non-transferable achievement badges as they complete quests and reach milestones!
