# 🏅 MeeChain Badge System Guide

Complete guide for deploying, managing, and integrating the MeeChain Badge SBT (Soulbound Token) system.

## 📋 Table of Contents

- [Overview](#overview)
- [Smart Contract](#smart-contract)
- [Deployment](#deployment)
- [Badge Configuration](#badge-configuration)
- [Frontend Integration](#frontend-integration)
- [Backend Integration](#backend-integration)
- [Testing](#testing)
- [Best Practices](#best-practices)

---

## 🎯 Overview

The MeeChain Badge System allows users to earn non-transferable achievement badges (SBTs) as they complete quests and reach milestones in the MeeChain ecosystem.

### Key Features

- ✅ **Soulbound Tokens (SBT)**: Badges cannot be transferred between wallets
- ✅ **Badge Catalog**: Pre-defined badge types with metadata
- ✅ **Batch Minting**: Efficient multi-user badge distribution
- ✅ **Gallery View**: Visual display of unlocked and locked badges
- ✅ **Unlock Animations**: Celebration effects when earning new badges
- ✅ **Rarity System**: Common, Rare, Epic, and Legendary badges

---

## 🔐 Smart Contract

### MeeChainBadgeSBT.sol

Location: `contracts/MeeChainBadgeSBT.sol`

The contract implements ERC-721 with transfer restrictions to create soulbound tokens.

#### Key Functions

```solidity
// Mint a badge to a user
function mintBadge(address to, uint256 badgeId) external onlyOwner

// Batch mint badges to multiple users
function batchMintBadges(address[] calldata recipients, uint256[] calldata badgeIds) external onlyOwner

// Register a new badge type
function registerBadge(uint256 badgeId, string memory name, string memory description, string memory imageURI) external onlyOwner

// Get all badge IDs owned by an address
function getBadgesOf(address owner) external view returns (uint256[] memory)

// Check if user has a specific badge
function hasBadge(address owner, uint256 badgeId) external view returns (bool)
```

---

## 🚀 Deployment

### 1. Prerequisites

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

### 2. Configure .env

```env
PRIVATE_KEY=your_private_key_here
BSCSCAN_API_KEY=your_bscscan_api_key

# Badge-specific configuration
MEECHAIN_BADGE_RPC_URL=https://bsc-dataseed.binance.org
MEECHAIN_BADGE_PRIVATE_KEY=your_badge_private_key
MEECHAIN_BADGE_CONTRACT_ADDRESS=0x...
```

### 3. Compile Contract

```bash
npx hardhat compile
```

### 4. Deploy to Network

```bash
# Deploy to BSC Testnet
npx hardhat run scripts/deploy-badge.js --network bscTestnet

# Deploy to BSC Mainnet
npx hardhat run scripts/deploy-badge.js --network bscMainnet

# Or use npm script
npm run deploy:badge -- --network bscMainnet
```

### 5. Verify Contract

```bash
npx hardhat verify --network bscMainnet <CONTRACT_ADDRESS>
```

### 6. Sync ABI

```bash
# Copy ABI to backend (if applicable)
cp artifacts/contracts/MeeChainBadgeSBT.sol/MeeChainBadgeSBT.json ../meebot-backend/abi/

# Copy ABI to frontend
cp artifacts/contracts/MeeChainBadgeSBT.sol/MeeChainBadgeSBT.json viewer/abis/
```

---

## 🎨 Badge Configuration

### Badge Catalog

Location: `src/config/badgeCatalog.ts`

The badge catalog defines all available badge types:

```typescript
export interface BadgeMetadata {
  id: number;
  name: string;
  description: string;
  imageURI: string;
  category: 'achievement' | 'milestone' | 'special' | 'quest';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const BADGE_CATALOG: Record<number, BadgeMetadata> = {
  1: {
    id: 1,
    name: "Pioneer",
    description: "First steps in MeeChain - Complete your first quest",
    imageURI: "ipfs://QmPioneerBadge",
    category: 'achievement',
    rarity: 'common'
  },
  // ... more badges
};
```

### Register Badges On-Chain

After deploying the contract, register badge types:

```javascript
// Using ethers.js
const badgeContract = await ethers.getContractAt("MeeChainBadgeSBT", contractAddress);

// Register each badge type
await badgeContract.registerBadge(
  1, // badgeId
  "Pioneer",
  "First steps in MeeChain - Complete your first quest",
  "ipfs://QmPioneerBadge"
);
```

---

## 🎭 Frontend Integration

### Components

The badge system includes several React components:

#### 1. BadgeRegistry

Main container for displaying user's badge collection.

```tsx
import BadgeRegistry from './components/BadgeRegistry';

<BadgeRegistry 
  userAddress="0x..."
  newlyMintedBadges={[1, 3]} // IDs of newly unlocked badges
/>
```

#### 2. BadgeGallery

Grid view of all badges with locked/unlocked states.

```tsx
import BadgeGallery from './components/BadgeGallery';

<BadgeGallery
  ownedBadgeIds={[1, 2, 5]}
  newlyMintedBadges={[1]}
  onBadgeClick={(badge) => console.log(badge)}
/>
```

#### 3. Badge

Individual badge display component.

```tsx
import Badge from './components/Badge';

<Badge
  badge={badgeMetadata}
  isUnlocked={true}
  showAnimation={true}
  onClick={() => {}}
/>
```

#### 4. BadgeUnlockNotification

Celebration popup when badges are unlocked.

```tsx
import BadgeUnlockNotification from './components/BadgeUnlockNotification';

<BadgeUnlockNotification
  badgeIds={[1, 3]}
  onClose={() => setShowNotification(false)}
  autoCloseDelay={5000}
/>
```

### Integration with Quest System

When a user completes a quest, the backend can mint badges:

```typescript
// Example: /logs/flag/confirm endpoint response
{
  "success": true,
  "quest": "quest-1",
  "newlyMintedBadges": [1, 3], // Badge IDs
  "message": "Quest completed! You earned 2 new badges!"
}
```

Frontend can then trigger the notification:

```tsx
const response = await confirmQuest(questId);
if (response.newlyMintedBadges?.length > 0) {
  // Show unlock notification
  setNewlyMintedBadges(response.newlyMintedBadges);
}
```

---

## 🔧 Backend Integration

### Blockchain Service

Update `viewer/services/blockchainService.ts`:

```typescript
import { ethers } from 'ethers';
import BadgeSBTABI from '../abis/MeeChainBadgeSBT.json';

const provider = new ethers.JsonRpcProvider(process.env.MEECHAIN_BADGE_RPC_URL);
const wallet = new ethers.Wallet(process.env.MEECHAIN_BADGE_PRIVATE_KEY, provider);
const badgeContract = new ethers.Contract(
  process.env.MEECHAIN_BADGE_CONTRACT_ADDRESS,
  BadgeSBTABI,
  wallet
);

// Fetch owned badges
export async function fetchOwnedBadges(userAddress: string): Promise<number[]> {
  return await badgeContract.getBadgesOf(userAddress);
}

// Mint badge to user
export async function mintBadge(userAddress: string, badgeId: number) {
  const tx = await badgeContract.mintBadge(userAddress, badgeId);
  await tx.wait();
  return { success: true, badgeId };
}

// Batch mint badges
export async function batchMintBadges(recipients: string[], badgeIds: number[]) {
  const tx = await badgeContract.batchMintBadges(recipients, badgeIds);
  await tx.wait();
  return { success: true };
}
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run badge system tests only
npm test tests/badgeSystem.test.ts

# Run with coverage
npm test -- --coverage
```

### Test Coverage

The badge system includes comprehensive tests for:

- ✅ Badge catalog structure and validation
- ✅ Badge metadata integrity
- ✅ Category and rarity distribution
- ✅ Helper functions (getBadgeById, getAllBadges, etc.)
- ✅ Blockchain service integration
- ✅ Mock minting and fetching

### Manual Testing

1. **Deploy contract to testnet**
2. **Register badge types**
3. **Mint test badges**
4. **Verify on frontend**

```bash
# Example using Hardhat console
npx hardhat console --network bscTestnet

> const badge = await ethers.getContractAt("MeeChainBadgeSBT", "0x...")
> await badge.registerBadge(1, "Pioneer", "First quest", "ipfs://...")
> await badge.mintBadge("0xUserAddress", 1)
> await badge.getBadgesOf("0xUserAddress")
```

---

## 📚 Best Practices

### Smart Contract

1. **Register badges before minting**: Always register badge types before attempting to mint
2. **Batch operations**: Use `batchMintBadges` for efficiency when minting multiple badges
3. **Access control**: Only contract owner can mint and register badges
4. **Event monitoring**: Listen to `BadgeMinted` events for real-time updates

### Frontend

1. **Loading states**: Show loading indicators while fetching badges
2. **Error handling**: Gracefully handle blockchain errors
3. **Animation timing**: Don't overuse animations - they should enhance UX
4. **Responsive design**: Badge gallery should work on all screen sizes

### Badge Design

1. **Clear criteria**: Each badge should have clear earning criteria
2. **Progression**: Create badges that encourage continued engagement
3. **Rarity balance**: More common badges than legendary ones
4. **Visual consistency**: Use consistent image styling across all badges

### Performance

1. **Cache badge metadata**: Don't fetch metadata on every render
2. **Lazy loading**: Load badge images lazily in the gallery
3. **Batch API calls**: Fetch multiple badges in single requests when possible
4. **Local state**: Store badge data in local storage for faster loads

---

## 🎨 Frontend Badge UI Features

### Badge Gallery

- ✅ Grid layout with responsive design
- ✅ Progress bar showing unlock percentage
- ✅ Locked/unlocked visual states
- ✅ Hover effects for details
- ✅ Click to view full badge information
- ✅ Filter by category/rarity (optional enhancement)

### Badge Unlock Animation

- ✅ Confetti effect
- ✅ Scale and rotate animation
- ✅ "NEW" badge indicator
- ✅ Auto-dismiss after 5 seconds
- ✅ Manual dismiss option

### Badge Details Modal

- ✅ Large badge image
- ✅ Name and description
- ✅ Category and rarity tags
- ✅ Lock/unlock status
- ✅ Unlock date (optional enhancement)

---

## 🔮 Future Enhancements

### Badge Quest System

Connect badges with the Flow Editor for automated badge earning:

```typescript
interface BadgeQuest {
  questId: string;
  requiredBadges: number[];
  rewardBadge: number;
  title: string;
  description: string;
}
```

### Badge-Based Features

1. **Discord Integration**: Award Discord roles based on badges
2. **GitHub Contributions**: Link badges to GitHub activity
3. **Public Profiles**: Display badge collections on public profiles
4. **Badge Voting**: Use badge ownership for DAO voting power
5. **Leaderboards**: Rank users by rare badge ownership

### Advanced Features

1. **Badge Levels**: Upgradeable badges (Bronze → Silver → Gold)
2. **Badge Combos**: Earn special badges for holding specific combinations
3. **Time-Limited Badges**: Seasonal or event-specific badges
4. **Badge Trading** (controlled): Allow specific badge transfers with restrictions
5. **Badge NFT Marketplace**: Display badges on OpenSea (metadata compatible)

---

## 📞 Support

For questions or issues:

- GitHub Issues: [MeeChain_MeeBot/issues](https://github.com/T1ADIPT4/MeeChain_MeeBot/issues)
- Documentation: See this guide
- Tests: Run `npm test tests/badgeSystem.test.ts`

---

## 📄 License

MIT License - MeeChain Team
# Badge System & Contributor Profile Guide 🛡️✨

This guide covers the complete Badge System with NFT/Soulbound Token (SBT) integration and Contributor Profile features for MeeChain Singapore.

## Overview

The Badge System provides:
- **Contributor reputation tracking** based on actions
- **Automatic badge unlocking** when requirements are met
- **SBT minting** for on-chain proof of achievements
- **Comprehensive contributor profiles** with activity history

---

## Architecture

### Smart Contract: MeeChainBadge

Located in `contracts/MeeChainBadge.sol`

```solidity
contract MeeChainBadge is ERC721URIStorage, Ownable
```

**Key Features:**
- ✅ ERC-721 compliant NFT
- 🔒 Soulbound (non-transferable)
- 📦 IPFS metadata support
- 🎯 Badge type tracking

**Main Functions:**
```solidity
function mintBadge(address to, string memory badgeType, string memory uri)
function getBadgesByUser(address user) returns (uint256[])
function getBadgeType(uint256 tokenId) returns (string)
```

### Service: Contributor Reputation

Located in `src/services/contributorReputationService.ts`

**Badge Definitions:**
- 🛡️ **Watchdog** - Flag 5 valid refund logs (10 points each)
- 🔍 **Auditor** - Complete 10 audit reviews (15 points each)
- 📝 **Proposer** - Create 3 DAO proposals (25 points each)
- ⚖️ **Governor** - Cast 20 votes (5 points each)
- 🤝 **Mediator** - Resolve 5 disputes (30 points each)

**Reputation Scores:**
```typescript
refund_flag: 10 points
audit_complete: 15 points
vote_cast: 5 points
proposal_create: 25 points
dispute_resolve: 30 points
```

### Service: Badge Minting

Located in `src/services/badgeMintingService.ts`

Handles the complete flow:
1. Generate metadata based on badge type
2. Upload metadata to IPFS
3. Mint SBT on smart contract
4. Link token to contributor profile

---

## Usage Examples

### 1. Recording Contributor Actions

```typescript
import { recordAction } from './services/contributorReputationService'

// Record a valid refund flag
const result = await recordAction('0xUserAddress', {
  type: 'refund_flag',
  refundId: 'refund-001',
  timestamp: new Date(),
  valid: true
})

console.log(`New score: ${result.newScore}`)
console.log(`Badges unlocked: ${result.badgesUnlocked.length}`)
```

### 2. Checking Contributor Profile

```typescript
import { getContributorProfile } from './services/contributorReputationService'

const profile = getContributorProfile('0xUserAddress')

console.log(`Score: ${profile.score}`)
console.log(`Badges: ${profile.badges.length}`)
console.log(`Actions: ${profile.actions.length}`)
```

### 3. Minting Badge NFT

```typescript
import { mintBadgeNFT } from './services/badgeMintingService'

const result = await mintBadgeNFT({
  contributorAddress: '0xUserAddress',
  badgeType: 'watchdog',
  badgeName: '🛡️ Watchdog',
  description: 'Awarded for flagging 5 valid refund logs',
  actionCount: 5
})

if (result.success) {
  console.log(`Token ID: ${result.tokenId}`)
  console.log(`TX Hash: ${result.txHash}`)
  console.log(`Metadata: ipfs://${result.metadataURI}`)
}
```

### 4. Recording Audit Logs

```typescript
import { recordAuditLog } from './services/contributorReputationService'

recordAuditLog(
  '0xUserAddress',
  'refund-123',
  'approved',
  'verified transaction'
)
```

### 5. Linking SBT Token

```typescript
import { linkSBTToken } from './services/contributorReputationService'

linkSBTToken(
  '0xUserAddress',
  1001, // tokenId
  '🛡️ Watchdog',
  '0xBadgeContractAddress',
  'QmMetadataHash123'
)
```

---

## API Endpoints

### GET /api/contributors/:address
Get contributor profile by address

**Response:**
```json
{
  "address": "0x...",
  "name": "Optional Name",
  "score": 150,
  "badges": [...],
  "sbtTokens": [...],
  "auditLogs": [...],
  "actions": [...],
  "joinedAt": "2025-10-19T00:00:00.000Z"
}
```

### GET /api/contributors
Get all contributors sorted by score

### GET /api/contributors/leaderboard?limit=10
Get top contributors

### GET /api/badges
Get all badge definitions

### POST /api/contributors/:address/actions
Record a contributor action

**Body:**
```json
{
  "type": "refund_flag",
  "refundId": "refund-001",
  "timestamp": "2025-10-19T00:00:00.000Z",
  "valid": true
}
```

### POST /api/contributors/:address/audit-log
Record an audit log entry

**Body:**
```json
{
  "refundId": "refund-123",
  "status": "approved",
  "action": "verified transaction"
}
```

### POST /api/contributors/:address/sbt-token
Link an SBT token to profile

**Body:**
```json
{
  "tokenId": 1001,
  "name": "🛡️ Watchdog",
  "contractAddress": "0x...",
  "metadataURI": "QmHash..."
}
```

---

## React Component: ContributorProfile

Located in `src/pages/ContributorProfile.tsx`

### Usage

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ContributorProfile from './pages/ContributorProfile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/contributor/:address" element={<ContributorProfile />} />
      </Routes>
    </BrowserRouter>
  )
}
```

### Features

The profile page displays:
- 📊 **Reputation Score** - Total points earned
- 🏅 **Badges** - All unlocked badges with descriptions
- 📜 **Soulbound Tokens** - On-chain NFT badges with links to BSCScan
- 🧾 **Audit History** - Recent audit logs
- 📊 **Recent Actions** - Latest contributor activities
- 🏛️ **DAO Participation** - Links to create proposals and view votes

### Styling

Custom CSS in `src/pages/ContributorProfile.css` provides:
- Responsive grid layouts
- Gradient header design
- Hover effects on cards
- Mobile-friendly design
- Status indicators for audit logs

---

## Badge Metadata Format

Metadata follows OpenSea standard:

```json
{
  "name": "🛡️ Watchdog Badge",
  "description": "Awarded for vigilance in flagging invalid refund logs",
  "image": "ipfs://QmHash/watchdog.png",
  "external_url": "https://meechain.sg/contributor/0x...",
  "attributes": [
    {
      "trait_type": "Badge Type",
      "value": "watchdog"
    },
    {
      "trait_type": "Contributor",
      "value": "0x..."
    },
    {
      "trait_type": "Valid Flags",
      "value": 10
    },
    {
      "trait_type": "Issued Date",
      "value": "2025-10-19T00:00:00.000Z"
    },
    {
      "trait_type": "Tier",
      "value": "Guardian"
    },
    {
      "trait_type": "Soulbound",
      "value": "Yes"
    }
  ]
}
```

---

## Integration with Existing Systems

### QuestManager Integration

The badge system integrates with the existing `QuestManager`:

```typescript
import { handleQuestCompletion } from './QuestManager'
import { recordAction } from './services/contributorReputationService'
import { onBadgeUnlocked } from './services/badgeMintingService'

async function onQuestComplete(userId: string, questId: string) {
  // Complete the quest
  const result = await handleQuestCompletion(userId, questId)
  
  // Record contributor action
  if (result.success) {
    const actionResult = await recordAction(userId, {
      type: 'audit_complete',
      timestamp: new Date(),
      valid: true
    })
    
    // Auto-mint badges when unlocked
    for (const badge of actionResult.badgesUnlocked) {
      await onBadgeUnlocked(
        userId,
        badge.id,
        badge.name,
        badge.description,
        actionResult.newScore
      )
    }
  }
}
```

### DAO Proposal Integration

```typescript
import { recordAction } from './services/contributorReputationService'

async function createProposal(creatorAddress: string, proposalData: any) {
  // Create the proposal...
  
  // Record contributor action
  await recordAction(creatorAddress, {
    type: 'proposal_create',
    proposalId: proposalData.id,
    timestamp: new Date(),
    valid: true
  })
}
```

---

## Deployment

### 1. Deploy Smart Contract

```bash
# Using Hardhat
npx hardhat run scripts/deployMeeChainBadge.js --network bsc

# Or using existing deploy script
npm run deploy:badge
```

### 2. Update Contract Address

Update the contract address in `src/services/badgeMintingService.ts`:

```typescript
const BADGE_CONTRACT_ADDRESS = '0xYourDeployedContractAddress'
```

### 3. Configure IPFS

For production, integrate with a real IPFS service:

```typescript
// Replace mock implementation in badgeMetadataGenerator.ts
import { create } from 'ipfs-http-client'

const ipfs = create({ url: 'https://ipfs.infura.io:5001' })

export async function uploadMetadataToIPFS(metadata: BadgeMetadata): Promise<string> {
  const json = metadataToJSON(metadata)
  const result = await ipfs.add(json)
  return result.path
}
```

### 4. Deploy Frontend

```bash
npm run build
npm run deploy
```

---

## Testing

Run all tests:

```bash
npm test
```

Run specific test suites:

```bash
# Contributor Reputation tests
npm test tests/contributorReputation.test.ts

# Badge Metadata tests
npm test tests/badgeMetadataGenerator.test.ts
```

---

## Security Considerations

1. **Soulbound Tokens**: Badges are non-transferable to maintain credibility
2. **Issuer Control**: Only authorized issuer can mint badges
3. **Validation**: All actions are validated before scoring
4. **On-Chain Verification**: Badge ownership can be verified on blockchain

---

## Future Enhancements

- [ ] Add more badge types
- [ ] Implement badge levels (Bronze, Silver, Gold)
- [ ] Add reputation decay over time
- [ ] Create contributor explorer page
- [ ] Integrate with snapshot.org for DAO voting
- [ ] Add badge image generation service
- [ ] Implement badge trading marketplace (for transferable variants)
- [ ] Add social sharing features

---

## Support

For issues or questions:
- Create an issue on GitHub
- Contact MeeChain Team
- Join the MeeChain Singapore community

---

**Built with ❤️ for MeeChain Singapore**
