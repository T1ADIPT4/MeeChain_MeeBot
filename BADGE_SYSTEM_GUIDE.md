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
