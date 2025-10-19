# Auditor Dashboard with Contributor Reputation & Badge System

## 🎯 Overview

The Auditor Dashboard is a comprehensive system for managing refund transaction audits within the MeeChain Singapore ecosystem. It integrates a **Contributor Reputation System** and **Badge System** to incentivize and reward auditors for their participation in governance.

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Auditor Dashboard                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Filter Bar  │  │ Refund Table │  │ Log Details  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────┐       │
│  │         Contributor Panel (Reputation)            │       │
│  │  - Score Display                                  │       │
│  │  - Badge Collection                               │       │
│  │  - Progress Tracking                              │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │         Backend Services              │
        ├───────────────────────────────────────┤
        │  • Auditor Service                    │
        │  • Reputation Service                 │
        │  • Badge Service                      │
        └───────────────────────────────────────┘
```

## 🔄 Reputation Flow

```
[Auditor Flags Transaction]
          ↓
[System Records Flag + Reason + Timestamp]
          ↓
[DAO/Core Team Validates Flag]
          ↓
[+10 Reputation Points Awarded]
          ↓
[Badge Check & Auto-Unlock]
          ↓
[🛡️ Watchdog, 🔍 Truth Seeker, etc.]
```

## 📁 File Structure

```
/src
  /services
    ├── auditorService.ts       # Refund log & flag management
    ├── reputationService.ts    # Reputation scoring
    └── badgeService.ts         # Badge unlock logic
  /types
    └── auditor.ts              # TypeScript interfaces

/components
  ├── AuditorDashboard.tsx      # Main dashboard
  ├── FilterBar.tsx             # Search & filter controls
  ├── RefundLogTable.tsx        # Log display table
  ├── LogDetailPanel.tsx        # Transaction details
  └── ContributorPanel.tsx      # Reputation & badges

/utils
  └── auditorMockData.ts        # Sample data generator

/examples
  └── auditor-dashboard-demo.ts # Complete demo

/tests
  └── auditorSystem.test.ts     # Test suite
```

## 🏅 Badge System

### Available Badges

| Badge | Icon | Requirement | Points |
|-------|------|-------------|--------|
| **Watchdog** | 🛡️ | 5+ validated flags | - |
| **Truth Seeker** | 🔍 | 10+ reviews | - |
| **Auditor OG** | 📜 | 100+ reputation | 100 |
| **Eagle Eye** | 👁️ | 20+ validated flags | - |
| **Master Auditor** | ⭐ | 50+ reviews | - |
| **Legend** | 🏆 | 500+ reputation | 500 |

### Badge Unlock Logic

```typescript
const BADGE_RULES: BadgeRule[] = [
  {
    id: 'watchdog',
    name: '🛡️ Watchdog',
    condition: (r) => r.flags >= 5
  },
  {
    id: 'truth-seeker',
    name: '🔍 Truth Seeker',
    condition: (r) => r.reviews >= 10
  },
  {
    id: 'auditor-og',
    name: '📜 Auditor OG',
    condition: (r) => r.score >= 100
  }
]
```

## 💯 Reputation Points

| Action | Points | Counter |
|--------|--------|---------|
| **Flag Validated** | +10 | flags++ |
| **Review Completed** | +5 | reviews++ |

### Updating Reputation

```typescript
import { updateReputation } from './services/reputationService'

// Award points for validated flag
await updateReputation(auditorAddress, 'flag_validated')

// Award points for completed review
await updateReputation(auditorAddress, 'review_completed')
```

## 🎨 UI Components

### 1. AuditorDashboard

Main dashboard container with header, content area, and sidebar.

```tsx
import { AuditorDashboard } from './components/AuditorDashboard'

<AuditorDashboard auditorAddress="0xAuditor..." />
```

**Features:**
- Header with Export CSV and View Badges buttons
- Filter bar for searching and filtering logs
- Refund log table
- Log detail panel (slides in on selection)
- Contributor panel (sidebar)

### 2. FilterBar

Search and filter controls.

```tsx
<FilterBar
  filters={filters}
  onFilterChange={setFilters}
/>
```

**Filters:**
- Search by address or transaction hash
- Status filter (Success, Failed, Flagged)
- Date range picker

### 3. RefundLogTable

Displays refund transactions in a table.

```tsx
<RefundLogTable
  logs={logs}
  selectedLog={selectedLog}
  onSelectLog={setSelectedLog}
/>
```

**Columns:**
- Requester address
- Status (✅/❌/🚩)
- Confirmation time
- Refund transaction hash
- Amount
- Chain
- Flag indicator

### 4. LogDetailPanel

Sliding panel showing transaction details.

```tsx
<LogDetailPanel
  log={selectedLog}
  auditorAddress={auditorAddress}
  onClose={() => setSelectedLog(null)}
  onUpdate={loadLogs}
/>
```

**Features:**
- Transaction information
- Flag submission form
- Review completion
- Link to blockchain explorer

### 5. ContributorPanel

Sidebar showing auditor profile, reputation, and badges.

```tsx
<ContributorPanel auditorAddress={auditorAddress} />
```

**Sections:**
- Auditor profile with avatar
- Reputation score (large display)
- Statistics (flags & reviews count)
- Badge collection
- Badge progress bars
- View history button

## 🔧 Backend Services

### Auditor Service

Manages refund logs and auditor actions.

```typescript
import { 
  createRefundLog,
  getRefundLogs,
  submitFlag,
  validateFlag,
  completeReview
} from './services/auditorService'

// Create a refund log
const log = createRefundLog({
  requester: '0x...',
  status: 'success',
  confirmationTime: new Date(),
  refundTx: '0x...',
  amount: '100 MEE',
  chain: 'polygon'
})

// Submit a flag
const flag = submitFlag(log.id, auditorAddress, 'Suspicious pattern')

// Validate flag (by DAO)
await validateFlag(log.id, auditorAddress, true)

// Complete review
await completeReview(log.id, auditorAddress, 'All checks passed')
```

### Reputation Service

Manages contributor reputation scores.

```typescript
import { 
  getReputation,
  updateReputation,
  getTopContributors
} from './services/reputationService'

// Get reputation
const rep = getReputation(auditorAddress)

// Update reputation
await updateReputation(auditorAddress, 'flag_validated')

// Get leaderboard
const topAuditors = getTopContributors(10)
```

### Badge Service

Manages badge unlocking and progress.

```typescript
import { 
  getUserBadges,
  checkAndUnlockBadges,
  getBadgeProgress,
  BADGE_RULES
} from './services/badgeService'

// Get user badges
const badges = getUserBadges(auditorAddress)

// Check and unlock new badges
const reputation = getReputation(auditorAddress)
const newBadges = checkAndUnlockBadges(auditorAddress, reputation)

// Get badge progress
const progress = getBadgeProgress(auditorAddress, reputation)
```

## 🚀 Usage

### Running the Demo

```bash
# Run the complete demo
npm run demo:auditor

# Or build and run manually
npm run build
node dist/examples/auditor-dashboard-demo.js
```

### Running Tests

```bash
# Run all tests
npm test

# Run auditor system tests only
npm test tests/auditorSystem.test.ts
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## 📊 Data Flow Examples

### Example 1: Flag Submission Flow

```typescript
// 1. Get refund logs
const logs = getRefundLogs()
const suspiciousLog = logs[0]

// 2. Auditor submits flag
const flag = submitFlag(
  suspiciousLog.id,
  auditorAddress,
  'Multiple refunds from same address in 24h'
)

// 3. DAO validates flag
await validateFlag(suspiciousLog.id, auditorAddress, true)

// 4. Reputation updated automatically
const reputation = getReputation(auditorAddress)
console.log(`New score: ${reputation.score}`) // +10 points

// 5. Check for new badges
const newBadges = checkAndUnlockBadges(auditorAddress, reputation)
if (newBadges.length > 0) {
  console.log('New badges unlocked!', newBadges)
}
```

### Example 2: Review Completion Flow

```typescript
// 1. Auditor completes review
await completeReview(
  logId,
  auditorAddress,
  'Transaction verified. All signatures valid.'
)

// 2. Reputation updated (+5 points)
// 3. Badges checked and unlocked if conditions met
```

### Example 3: Filter and Search

```typescript
// Filter by status
const successLogs = getRefundLogs({ status: 'success' })

// Filter by flagged status
const flaggedLogs = getRefundLogs({ flagged: true })

// Filter by requester
const userLogs = getRefundLogs({ requester: '0x883A...' })

// Filter by date range
const recentLogs = getRefundLogs({
  startDate: new Date('2025-10-01'),
  endDate: new Date('2025-10-31')
})
```

## 🎨 Figma Mockup Structure

For creating a Figma design, use this structure:

```
Frame: AuditorDashboard (1440 x 900)
├── Header (1440 x 80)
│   ├── Logo (left)
│   ├── Title: "🛡️ Auditor Dashboard"
│   └── Actions (right)
│       ├── Button: "📊 Export CSV"
│       └── Button: "🏅 View Badges"
│
├── Content Area (1120 x 820)
│   ├── FilterBar (1120 x 80)
│   │   ├── Search Input
│   │   ├── Status Dropdown
│   │   └── Date Range Picker
│   │
│   └── RefundLogTable (1120 x 740)
│       ├── Table Header
│       └── Table Rows (scrollable)
│
└── Sidebar (320 x 820)
    └── ContributorPanel
        ├── Profile Section
        ├── Reputation Score
        ├── Stats Grid
        ├── Badges Section
        └── Progress Section

Modal: LogDetailPanel (500 x 100vh)
├── Header
├── Transaction Info
├── Flag Info (if flagged)
└── Actions
```

## 🔐 Security Considerations

1. **Authentication**: Implement proper wallet connection
2. **Authorization**: Verify auditor permissions
3. **Input Validation**: Sanitize all user inputs
4. **Rate Limiting**: Prevent spam flag submissions
5. **DAO Governance**: Only authorized parties can validate flags

## 🔌 Integration Points

### With Existing Systems

```typescript
// Integration with Logger
import { logEvent } from '../utils/logger'

// Integration with Registry
import { getContractAddress } from '../utils/registry'

// Integration with existing Dashboard
import { AuditorDashboard } from '../components/AuditorDashboard'
```

### Database Integration (Production)

Replace in-memory stores with database:

```typescript
// Example: MongoDB integration
export async function getReputation(userAddress: string): Promise<Reputation> {
  return await db.collection('reputation').findOne({ user: userAddress })
}

export async function updateReputation(
  userAddress: string,
  action: ReputationAction
): Promise<Reputation> {
  const points = REPUTATION_POINTS[action]
  return await db.collection('reputation').findOneAndUpdate(
    { user: userAddress },
    { 
      $inc: { 
        score: points,
        [action === 'flag_validated' ? 'flags' : 'reviews']: 1
      },
      $set: { lastUpdated: new Date() }
    },
    { upsert: true, returnDocument: 'after' }
  )
}
```

## 📚 API Reference

### Types

See [src/types/auditor.ts](./src/types/auditor.ts) for complete type definitions.

### Services

- **auditorService**: [src/services/auditorService.ts](./src/services/auditorService.ts)
- **reputationService**: [src/services/reputationService.ts](./src/services/reputationService.ts)
- **badgeService**: [src/services/badgeService.ts](./src/services/badgeService.ts)

### Components

All React components are in [components/](./components/) directory.

## 🎯 Next Steps

- [ ] Connect to production database (MongoDB/Firebase)
- [ ] Implement wallet authentication
- [ ] Add real-time updates via WebSocket
- [ ] Integrate with DAO voting system
- [ ] Add notification system for badge unlocks
- [ ] Create mobile-responsive design
- [ ] Add analytics dashboard for admins
- [ ] Implement export to PDF functionality
- [ ] Add multi-language support (Thai/English)
- [ ] Create public leaderboard page

## 🤝 Contributing

When contributing to the Auditor Dashboard:

1. Maintain the existing code style
2. Add tests for new features
3. Update documentation
4. Follow the reputation/badge flow patterns
5. Ensure UI components are accessible

## 📖 Related Documentation

- [DASHBOARD_INTEGRATION.md](./DASHBOARD_INTEGRATION.md)
- [DEPLOY_REGISTRY.md](./DEPLOY_REGISTRY.md)
- [QUEST_SYSTEM.md](./QUEST_SYSTEM.md)
- [INTEGRATION.md](./INTEGRATION.md)

---

**Built with ❤️ for MeeChain Singapore**

*Empowering transparent governance through contributor reputation and recognition*
