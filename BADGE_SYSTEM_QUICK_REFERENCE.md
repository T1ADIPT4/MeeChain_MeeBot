# Badge System Quick Reference 🚀

Quick reference for the MeeChain Badge System with NFT/SBT integration.

## Table of Contents
- [Badge Types](#badge-types)
- [Reputation Scores](#reputation-scores)
- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Common Tasks](#common-tasks)
- [Smart Contract](#smart-contract)

---

## Badge Types

| Badge | Requirement | Points | Icon |
|-------|------------|--------|------|
| **Watchdog** | Flag 5 valid refunds | 50 | 🛡️ |
| **Auditor** | Complete 10 audits | 150 | 🔍 |
| **Proposer** | Create 3 proposals | 75 | 📝 |
| **Governor** | Cast 20 votes | 100 | ⚖️ |
| **Mediator** | Resolve 5 disputes | 150 | 🤝 |

---

## Reputation Scores

| Action | Points | Example |
|--------|--------|---------|
| Flag refund | 10 | Report invalid transaction |
| Complete audit | 15 | Review and verify refund |
| Cast vote | 5 | Vote on DAO proposal |
| Create proposal | 25 | Propose new initiative |
| Resolve dispute | 30 | Mediate and resolve conflict |

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Deploy Smart Contract
```bash
npm run deploy:badge-nft
```

### 3. Update Contract Address
Edit `src/services/badgeMintingService.ts`:
```typescript
const BADGE_CONTRACT_ADDRESS = '0xYourContractAddress'
```

### 4. Run Demo
```bash
npm run demo:badge-system
```

### 5. Run Tests
```bash
npm test tests/contributorReputation.test.ts
npm test tests/badgeMetadataGenerator.test.ts
```

---

## API Endpoints

### GET Endpoints

```bash
# Get contributor profile
GET /api/contributors/:address

# Get all contributors
GET /api/contributors

# Get leaderboard
GET /api/contributors/leaderboard?limit=10

# Get badge definitions
GET /api/badges
```

### POST Endpoints

```bash
# Record action
POST /api/contributors/:address/actions
Body: { type, refundId?, proposalId?, timestamp, valid }

# Record audit log
POST /api/contributors/:address/audit-log
Body: { refundId, status, action }

# Link SBT token
POST /api/contributors/:address/sbt-token
Body: { tokenId, name, contractAddress, metadataURI }
```

---

## Common Tasks

### Record a Valid Action
```typescript
import { recordAction } from './services/contributorReputationService'

const result = await recordAction('0xAddress', {
  type: 'refund_flag',
  refundId: 'refund-001',
  timestamp: new Date(),
  valid: true
})
```

### Get Contributor Profile
```typescript
import { getContributorProfile } from './services/contributorReputationService'

const profile = getContributorProfile('0xAddress')
console.log(`Score: ${profile.score}`)
console.log(`Badges: ${profile.badges.length}`)
```

### Mint Badge NFT
```typescript
import { mintBadgeNFT } from './services/badgeMintingService'

const result = await mintBadgeNFT({
  contributorAddress: '0xAddress',
  badgeType: 'watchdog',
  badgeName: '🛡️ Watchdog',
  description: 'Awarded for vigilance',
  actionCount: 5
})
```

### View Profile Page
```
http://localhost:3000/contributor/0xAddress
```

---

## Smart Contract

### Contract Address
```
BSC Testnet: [To be deployed]
BSC Mainnet: [To be deployed]
```

### Key Functions
```solidity
// Mint badge
mintBadge(address to, string badgeType, string uri)

// Get user badges
getBadgesByUser(address user) returns (uint256[])

// Get badge type
getBadgeType(uint256 tokenId) returns (string)

// Get total supply
totalSupply() returns (uint256)
```

### Events
```solidity
event BadgeMinted(
    address indexed to,
    uint256 indexed tokenId,
    string badgeType,
    string uri
)
```

---

## File Structure

```
MeeChain_MeeBot/
├── contracts/
│   └── MeeChainBadge.sol          # Smart contract
├── src/
│   ├── services/
│   │   ├── contributorReputationService.ts  # Reputation tracking
│   │   └── badgeMintingService.ts           # NFT minting
│   ├── api/
│   │   └── contributors.ts                  # API endpoints
│   ├── pages/
│   │   ├── ContributorProfile.tsx           # Profile page
│   │   └── ContributorProfile.css           # Styling
│   └── utils/
│       └── badgeMetadataGenerator.ts        # Metadata generation
├── scripts/
│   └── deployMeeChainBadge.js              # Deploy script
├── tests/
│   ├── contributorReputation.test.ts       # Reputation tests
│   └── badgeMetadataGenerator.test.ts      # Metadata tests
├── examples/
│   └── badge-system-demo.ts                # Demo
└── BADGE_SYSTEM_GUIDE.md                   # Full guide
```

---

## Workflow

```
1. User performs action (flag refund, create proposal, etc.)
   ↓
2. recordAction() - Updates score and checks badge unlocks
   ↓
3. Badge unlocked? → Auto-mint NFT
   ↓
4. mintBadgeNFT() - Generate metadata → Upload to IPFS → Mint on-chain
   ↓
5. linkSBTToken() - Link token to profile
   ↓
6. View on ContributorProfile page
```

---

## Integration Examples

### With Quest System
```typescript
import { handleQuestCompletion } from './QuestManager'
import { recordAction } from './services/contributorReputationService'

async function onQuestComplete(userId: string, questId: string) {
  await handleQuestCompletion(userId, questId)
  await recordAction(userId, {
    type: 'audit_complete',
    timestamp: new Date(),
    valid: true
  })
}
```

### With DAO Proposals
```typescript
async function createProposal(creator: string, data: any) {
  // Create proposal logic...
  
  await recordAction(creator, {
    type: 'proposal_create',
    proposalId: data.id,
    timestamp: new Date(),
    valid: true
  })
}
```

---

## Troubleshooting

### Badge not unlocking?
- Check action count: `profile.actions.filter(a => a.type === 'refund_flag' && a.valid).length`
- Verify requirement: `getBadgeDefinitions().find(b => b.id === 'watchdog').requirement`

### NFT minting fails?
- Check contract address is set
- Verify issuer has permissions
- Ensure gas is sufficient

### Profile not showing?
- Check address format
- Verify profile exists: `getContributorProfile(address)`
- Check API endpoint connectivity

---

## Resources

- **Full Guide**: `BADGE_SYSTEM_GUIDE.md`
- **Smart Contract Docs**: `contracts/README.md`
- **Demo**: Run `npm run demo:badge-system`
- **Tests**: `npm test`

---

## Support

- GitHub Issues: [Create Issue](https://github.com/T1ADIPT4/MeeChain_MeeBot/issues)
- Discord: MeeChain Community
- Email: support@meechain.sg

---

**Last Updated**: 2025-10-19
