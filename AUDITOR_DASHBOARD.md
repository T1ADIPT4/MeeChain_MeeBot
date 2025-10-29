# MeeChain Auditor Dashboard

## 🎯 Overview

The Auditor Dashboard is a comprehensive monitoring system for refund transactions in the MeeChain ecosystem. It provides transparency and security by allowing contributors and auditors to review refund logs, flag suspicious transactions, and export data for further analysis.

## 🖥️ Features

### 1. **Refund Log Monitoring**
- View all refund transactions in real-time
- Search by address, transaction hash, or refund ID
- Filter logs by date range
- View detailed information about each transaction

### 2. **Transaction Details**
- Refund ID and transaction hash
- User address
- Refund amount (BNB)
- Status (Success/Failed/Pending)
- Signature validation
- Verification timestamp
- Execution details
- Additional notes

### 3. **Flag System**
- Flag suspicious transactions with custom reasons
- Automatic notifications to audit team
- Flag history tracking

### 4. **Data Export**
- Export filtered logs to CSV format
- Includes all transaction details
- Useful for external analysis and reporting

### 5. **Notification System**
- Discord webhook integration
- Real-time alerts when logs are flagged
- Extensible for email, Telegram, etc.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add your Discord webhook URL:
```bash
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/yyy
```

### Running the Application

**Start the backend API server:**
```bash
npm run server
```

The API server will start on `http://localhost:3001`

**Start the frontend (in a separate terminal):**
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

**Access the Auditor Dashboard:**
Navigate to `http://localhost:5173/auditor-dashboard`

## 📚 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### Get All Logs
```
GET /api/logs
```
Returns all refund logs.

### Get Specific Log
```
GET /api/logs/:refundId
```
Returns details of a specific refund log.

### Search Logs
```
GET /api/logs/search/:query
```
Search logs by address, refund ID, or transaction hash.

### Filter by Date Range
```
GET /api/logs/filter/date?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```
Filter logs within a date range.

### Flag a Log
```
POST /api/logs/flag
Content-Type: application/json

{
  "refundId": "ref_abc123",
  "reason": "Suspicious transaction pattern",
  "flaggedBy": "0x1234..."
}
```
Flag a refund log and trigger notifications.

### Get All Flags
```
GET /api/flags
```
Returns all flags.

### Get Flags for a Refund
```
GET /api/flags/:refundId
```
Returns flags for a specific refund.

## 🔔 Notification System

### Discord Webhook

When a log is flagged, the system sends a notification to Discord:

```
🚨 Refund Log Flagged

Refund ID: ref_abc123
Reason: Suspicious transaction pattern
Flagged By: 0x1234567890abcdef...
Time: 2025-10-19T13:35:00.000Z
```

### Setting up Discord Webhook

1. Go to your Discord server settings
2. Navigate to Integrations → Webhooks
3. Create a new webhook
4. Copy the webhook URL
5. Add it to your `.env` file:
   ```bash
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your_webhook_id/your_webhook_token
   ```

### Future Extensions

The notification system is designed to be extensible:
- **Email:** Implement email notifications via SendGrid, AWS SES, etc.
- **Telegram:** Send alerts to Telegram channels/groups
- **DAO Voting:** Integrate with governance systems for community review

## 🧪 Testing

Run the test suite:
```bash
npm test tests/auditorDashboard.test.ts
```

The tests cover:
- Database operations (CRUD)
- Search and filtering
- Flag management
- Data integrity

## 🎨 UI Components

### 1. **AuditorDashboard.tsx**
Main dashboard component that orchestrates the UI.

### 2. **RefundLogsTable.tsx**
Table component displaying all refund logs with status indicators.

### 3. **RefundLogDetails.tsx**
Detailed view of a selected refund log with action buttons.

## 📊 Data Structure

### RefundLog
```typescript
{
  refundId: string;
  userAddress: string;
  txHash: string | null;
  amount: string;
  reason: string;
  status: 'success' | 'failed' | 'pending';
  verifiedAt: string;
  signatureValid: boolean;
  executedBy: string;
  notes: string;
  createdAt: string;
}
```

### RefundFlag
```typescript
{
  id: string;
  refundId: string;
  reason: string;
  flaggedBy: string;
  flaggedAt: string;
}
```

## 🛡️ Security Considerations

1. **Authentication:** In production, add proper authentication and authorization
2. **Rate Limiting:** Implement rate limiting on API endpoints
3. **Input Validation:** Validate all user inputs
4. **CORS:** Configure CORS properly for production
5. **Database:** Replace in-memory database with a persistent solution (MongoDB, PostgreSQL)
6. **Secrets:** Never commit secrets to version control

## 🚀 Production Deployment

### Backend

For production deployment, consider:

1. **Database:** Replace in-memory storage with:
   - MongoDB for document storage
   - PostgreSQL for relational data
   - Firebase Firestore for real-time updates

2. **Hosting:**
   - Deploy API server to Heroku, AWS, Google Cloud, or similar
   - Use environment variables for configuration
   - Enable HTTPS

3. **Monitoring:**
   - Add logging with Winston or similar
   - Set up error tracking (Sentry, etc.)
   - Monitor API performance

### Frontend

1. Build the production bundle:
```bash
npm run build
```

2. Deploy to:
   - Firebase Hosting
   - Vercel
   - Netlify
   - AWS S3 + CloudFront

## 📖 Additional Resources

- [MeeChain Quest System](QUEST_SYSTEM.md)
- [Deploy Registry](DEPLOY_REGISTRY.md)
- [Integration Guide](INTEGRATION.md)
- [Architecture](ARCHITECTURE.md)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for MeeChain Singapore**

สร้างด้วยความใส่ใจเพื่อความโปร่งใสและความปลอดภัยในระบบ MeeChain

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
