# 🚀 Badge System Quick Start

Get up and running with the MeeChain Badge SBT system in minutes!

## Prerequisites

- Node.js 18+ or 20+
- MetaMask or similar Web3 wallet
- BNB for gas (testnet or mainnet)
- Private key for deployment

## Step 1: Installation

```bash
# Clone and install dependencies
git clone https://github.com/T1ADIPT4/MeeChain_MeeBot.git
cd MeeChain_MeeBot
npm install
```

## Step 2: Configuration

Create a `.env` file in the root directory:

```env
# Private key for contract deployment (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# BscScan API key for contract verification
BSCSCAN_API_KEY=your_bscscan_api_key_here

# RPC URLs
BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545/
BSC_MAINNET_RPC=https://bsc-dataseed.binance.org/

# Badge SBT Contract Configuration
MEECHAIN_BADGE_RPC_URL=https://bsc-dataseed.binance.org/
MEECHAIN_BADGE_PRIVATE_KEY=your_private_key_here
MEECHAIN_BADGE_CONTRACT_ADDRESS=0x...
```

## Step 3: Compile Contract

```bash
npm run compile
```

## Step 4: Deploy Contract

### Deploy to Testnet (Recommended for testing)

```bash
npm run deploy:badge-sbt
```

### Deploy to Mainnet

```bash
npm run deploy:badge-sbt:mainnet
```

**Save the contract address from deployment output!**

## Step 5: Update Environment Variables

Update `.env` with the deployed contract address:

```env
MEECHAIN_BADGE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

## Step 6: Run Tests

```bash
# Run all tests
npm test

# Run badge tests only
npm test -- tests/badgeSBT.test.ts
```

## Step 7: Backend Integration

### Option A: Simple Integration (No Minting)

```typescript
import { createReputationService } from './src/services/contributor-reputation-service';

const reputationService = createReputationService();

// Check badge status without minting
const response = await reputationService.hydrateAPIResponse({
  userId: 'user123',
  walletAddress: '0x...',
  progress: { 'quest-001': 1 },
  currentBadges: [],
  reputation: 0,
}, false); // false = no minting

console.log('Badges:', response.badges);
```

### Option B: Full Integration (With Minting)

```typescript
import { createBadgeSBTService } from './src/services/badge-sbt-service';
import { createReputationService } from './src/services/contributor-reputation-service';

// Initialize badge service
const badgeService = createBadgeSBTService({
  rpcUrl: process.env.MEECHAIN_BADGE_RPC_URL!,
  contractAddress: process.env.MEECHAIN_BADGE_CONTRACT_ADDRESS!,
  privateKey: process.env.MEECHAIN_BADGE_PRIVATE_KEY,
});

// Initialize reputation service with minting capability
const reputationService = createReputationService(badgeService);

// Check and mint badges automatically
const response = await reputationService.hydrateAPIResponse({
  userId: 'user123',
  walletAddress: '0x...',
  progress: { 'quest-001': 1 },
  currentBadges: [],
  reputation: 0,
}, true); // true = trigger minting

console.log('Newly minted:', response.newlyMinted);
```

## Step 8: Frontend Integration

### Install Component

```tsx
// In your React component
import { BadgeGallery } from './viewer/src/components/BadgeGallery';
import './viewer/src/components/BadgeGallery.css';

function MyBadgePage() {
  const [badgeData, setBadgeData] = useState(null);

  useEffect(() => {
    // Fetch badge data from your backend
    fetch('/api/badges')
      .then(res => res.json())
      .then(setBadgeData);
  }, []);

  if (!badgeData) return <div>Loading...</div>;

  return (
    <BadgeGallery
      userId={badgeData.userId}
      walletAddress={walletAddress}
      badges={badgeData.badges}
      newlyMinted={badgeData.newlyMintedBadges}
      onRefresh={() => fetchBadges()}
    />
  );
}
```

## Step 9: API Endpoint Setup

Add the badge confirmation endpoint to your backend:

```typescript
import { createBadgeConfirmationHandler } from './src/api/badge-confirmation-handler';

const handler = createBadgeConfirmationHandler({
  rpcUrl: process.env.MEECHAIN_BADGE_RPC_URL!,
  contractAddress: process.env.MEECHAIN_BADGE_CONTRACT_ADDRESS!,
  privateKey: process.env.MEECHAIN_BADGE_PRIVATE_KEY,
});

// Express example
app.post('/api/badges/confirm', async (req, res) => {
  const result = await handler.handleConfirmation(req.body);
  res.json(result);
});
```

## Testing the System

### 1. Test Badge Unlock Detection

```typescript
import { getUnlockedBadges } from './src/config/contributor-badges';

const userProgress = {
  'quest-001': 1,
  'quest-tts-001': 1,
};

const unlocked = getUnlockedBadges(userProgress);
console.log('Unlocked badges:', unlocked); // [1, 2]
```

### 2. Test Badge State Query

```typescript
const state = await badgeService.getBadgeState(userAddress);
console.log('User badges:', state.badgeTypes);
```

### 3. Test Badge Minting

```typescript
const result = await badgeService.mintBadge(userAddress, 1);
console.log('Mint tx:', result.txHash);
```

## Common Use Cases

### Award Badge on Quest Completion

```typescript
// When user completes a quest
await reputationService.updateProgress(
  userId,
  { 'quest-001': 1 },
  currentReputation
);

// Check if new badges unlocked
const unlockResult = await reputationService.checkUnlockedBadges(userReputation);
if (unlockResult.newlyUnlocked.length > 0) {
  // Mint badges
  await reputationService.triggerBadgeMinting(
    walletAddress,
    unlockResult.newlyUnlocked
  );
}
```

### Display User's Badge Collection

```tsx
<BadgeGallery
  userId="user123"
  walletAddress="0x..."
  badges={badges}
  newlyMinted={[]}
/>
```

### Show Badge Unlock Celebration

```tsx
{newlyMinted.length > 0 && (
  <BadgeUnlockModal
    badges={badges.filter(b => newlyMinted.includes(b.id))}
    onClose={() => setShowModal(false)}
  />
)}
```

## Troubleshooting

### Contract compilation fails

**Solution:** Ensure hardhat and dependencies are installed correctly:
```bash
npm install --save-dev hardhat@^2.26.0 @nomicfoundation/hardhat-toolbox@^5.0.0
```

### Deployment fails with "insufficient funds"

**Solution:** Ensure your wallet has enough BNB for gas fees.

### Badges not showing in frontend

**Solution:** Check that:
1. Contract address is correct in `.env`
2. RPC URL is accessible
3. Wallet address is properly formatted

### Minting fails with "User already has this badge type"

**Solution:** This is expected behavior. Each badge type can only be owned once per address.

## Next Steps

1. ✅ Customize badge catalog in `src/config/contributor-badges.ts`
2. ✅ Add badge images to `viewer/src/assets/badges/`
3. ✅ Integrate with your quest system
4. ✅ Add notification system for new badges
5. ✅ Create public badge leaderboard

## Resources

- [Full Implementation Guide](./BADGE_SBT_IMPLEMENTATION.md)
- [Smart Contract](./contracts/MeeChainBadgeSBT.sol)
- [Test Suite](./tests/badgeSBT.test.ts)
- [Frontend Components](./viewer/src/components/)

## Support

For issues or questions:
- Open an issue on GitHub
- Check test cases for examples
- Review implementation documentation

---

Happy badge minting! 🎖️
