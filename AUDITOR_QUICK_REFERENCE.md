# Auditor Dashboard - Quick Reference Guide

## 🚀 Getting Started (5 Minutes)

### 1. Run the Demo

```bash
npm run demo:auditor
```

### 2. Run Tests

```bash
npm test tests/auditorSystem.test.ts
```

### 3. Use in Your App

```tsx
import { AuditorDashboard } from './components/AuditorDashboard'

function App() {
  return <AuditorDashboard auditorAddress="0xYourAddress" />
}
```

## 📝 Common Use Cases

### Create a Refund Log

```typescript
import { createRefundLog } from './src/services/auditorService'

const log = createRefundLog({
  requester: '0x123...',
  status: 'success',
  confirmationTime: new Date(),
  refundTx: '0xabc...',
  amount: '100 MEE',
  chain: 'polygon'
})
```

### Submit a Flag

```typescript
import { submitFlag } from './src/services/auditorService'

const flag = submitFlag(
  logId,
  auditorAddress,
  'Suspicious pattern detected'
)
```

### Validate a Flag (DAO/Admin)

```typescript
import { validateFlag } from './src/services/auditorService'

await validateFlag(logId, auditorAddress, true)
// Automatically awards +10 reputation and checks badges
```

### Complete a Review

```typescript
import { completeReview } from './src/services/auditorService'

await completeReview(logId, auditorAddress, 'All checks passed')
// Automatically awards +5 reputation and checks badges
```

### Get Auditor Reputation

```typescript
import { getReputation } from './src/services/reputationService'

const rep = getReputation(auditorAddress)
console.log(`Score: ${rep.score}`)
console.log(`Flags: ${rep.flags}`)
console.log(`Reviews: ${rep.reviews}`)
```

### Check Badges

```typescript
import { getUserBadges } from './src/services/badgeService'

const badges = getUserBadges(auditorAddress)
badges.forEach(badge => {
  console.log(`${badge.icon} ${badge.name}`)
})
```

## 🎯 Reputation Points

| Action | Points | Counter Incremented |
|--------|--------|-------------------|
| Flag Validated by DAO | +10 | flags++ |
| Review Completed | +5 | reviews++ |

## 🏅 Badge Unlock Conditions

| Badge | Icon | Unlock Condition |
|-------|------|-----------------|
| Watchdog | 🛡️ | 5+ validated flags |
| Truth Seeker | 🔍 | 10+ reviews |
| Auditor OG | 📜 | 100+ reputation score |
| Eagle Eye | 👁️ | 20+ validated flags |
| Master Auditor | ⭐ | 50+ reviews |
| Legend | 🏆 | 500+ reputation score |

## 🔄 Complete Workflow Example

```typescript
// 1. Initialize (one time)
import { initializeMockData } from './utils/auditorMockData'
await initializeMockData()

// 2. Get logs
import { getRefundLogs } from './src/services/auditorService'
const logs = getRefundLogs()

// 3. Auditor flags suspicious log
import { submitFlag } from './src/services/auditorService'
const flag = submitFlag(logs[0].id, auditorAddress, 'Multiple refunds in 24h')

// 4. DAO validates flag
import { validateFlag } from './src/services/auditorService'
await validateFlag(logs[0].id, auditorAddress, true)

// 5. Check updated reputation
import { getReputation } from './src/services/reputationService'
const rep = getReputation(auditorAddress)
// rep.score === 10, rep.flags === 1

// 6. Check for new badges
import { checkAndUnlockBadges } from './src/services/badgeService'
const newBadges = checkAndUnlockBadges(auditorAddress, rep)

// 7. Display in UI
import { AuditorDashboard } from './components/AuditorDashboard'
<AuditorDashboard auditorAddress={auditorAddress} />
```

## 🔍 Filter Examples

```typescript
import { getRefundLogs } from './src/services/auditorService'

// Filter by status
const successLogs = getRefundLogs({ status: 'success' })
const failedLogs = getRefundLogs({ status: 'failed' })
const flaggedLogs = getRefundLogs({ flagged: true })

// Filter by requester
const userLogs = getRefundLogs({ 
  requester: '0x883A...' 
})

// Filter by date range
const recentLogs = getRefundLogs({
  startDate: new Date('2025-10-01'),
  endDate: new Date('2025-10-31')
})

// Combine filters
const filteredLogs = getRefundLogs({
  status: 'success',
  flagged: false,
  startDate: new Date('2025-10-01')
})
```

## 📦 Component Props

### AuditorDashboard

```tsx
interface AuditorDashboardProps {
  auditorAddress: string  // Required: Wallet address of the auditor
}
```

### FilterBar

```tsx
interface FilterBarProps {
  filters: {
    search: string
    status?: 'success' | 'failed' | 'flagged'
    startDate?: Date
    endDate?: Date
  }
  onFilterChange: (filters: any) => void
}
```

### RefundLogTable

```tsx
interface RefundLogTableProps {
  logs: RefundLog[]
  selectedLog: RefundLog | null
  onSelectLog: (log: RefundLog) => void
}
```

### LogDetailPanel

```tsx
interface LogDetailPanelProps {
  log: RefundLog
  auditorAddress: string
  onClose: () => void
  onUpdate: () => void
}
```

### ContributorPanel

```tsx
interface ContributorPanelProps {
  auditorAddress: string
}
```

## 🎨 Styling Components

All components include inline styles. To customize:

### Option 1: Override with CSS

```css
.auditor-dashboard {
  /* Your custom styles */
}
```

### Option 2: Edit Component Styles

Open component file and modify the `<style>` tag:

```tsx
<style>{`
  .auditor-dashboard {
    background: your-color;
  }
`}</style>
```

## 🔌 Database Integration

Replace in-memory stores with your database:

### Example: MongoDB

```typescript
// reputationService.ts
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

### Example: Firebase

```typescript
import { doc, updateDoc, increment } from 'firebase/firestore'

export async function updateReputation(
  userAddress: string,
  action: ReputationAction
): Promise<void> {
  const points = REPUTATION_POINTS[action]
  const docRef = doc(db, 'reputation', userAddress)
  
  await updateDoc(docRef, {
    score: increment(points),
    [action === 'flag_validated' ? 'flags' : 'reviews']: increment(1),
    lastUpdated: new Date()
  })
}
```

## 🚨 Common Issues

### Issue: Module not found

```bash
# Make sure to build first
npm run build
```

### Issue: Tests failing

```bash
# Clear cache and run again
npm test -- --clearCache
npm test tests/auditorSystem.test.ts
```

### Issue: Demo not running

```bash
# Use ts-node directly
node --loader ts-node/esm examples/auditor-dashboard-demo.ts
```

## 📊 Event Logging

The system automatically logs events:

```typescript
// Events logged:
- 'refund-log-created'
- 'refund-log-flagged'
- 'reputation-updated'
- 'badge-unlocked'
- 'flag-validated'
- 'flag-rejected'
- 'review-completed'
```

View logs in console or integrate with your logging service.

## 🔐 Security Checklist

- [ ] Implement wallet authentication
- [ ] Verify auditor permissions
- [ ] Validate all user inputs
- [ ] Rate limit flag submissions
- [ ] Secure DAO validation endpoint
- [ ] Sanitize SQL/NoSQL queries
- [ ] Use HTTPS for all API calls
- [ ] Implement CSRF protection

## 🎯 Production Checklist

- [ ] Replace mock data with real database
- [ ] Add authentication layer
- [ ] Implement authorization checks
- [ ] Add pagination for large datasets
- [ ] Set up error logging (Sentry, etc.)
- [ ] Add analytics tracking
- [ ] Implement caching strategy
- [ ] Add rate limiting
- [ ] Set up monitoring/alerts
- [ ] Create backup strategy

## 📱 Mobile Responsive

To make mobile responsive:

1. Add viewport meta tag:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

2. Use media queries:
```css
@media (max-width: 768px) {
  .auditor-dashboard {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
  }
}
```

## 🌍 Internationalization

To add Thai/English support:

```typescript
const translations = {
  en: {
    dashboard: 'Auditor Dashboard',
    exportCSV: 'Export CSV',
    viewBadges: 'View Badges'
  },
  th: {
    dashboard: 'แดชบอร์ดผู้ตรวจสอบ',
    exportCSV: 'ส่งออก CSV',
    viewBadges: 'ดูเหรียญ'
  }
}

// Use in component
<h1>{t('dashboard')}</h1>
```

## 📚 Additional Resources

- Full Documentation: [AUDITOR_DASHBOARD.md](./AUDITOR_DASHBOARD.md)
- Figma Guide: [AUDITOR_DASHBOARD_FIGMA.md](./AUDITOR_DASHBOARD_FIGMA.md)
- Type Definitions: [src/types/auditor.ts](./src/types/auditor.ts)
- Test Examples: [tests/auditorSystem.test.ts](./tests/auditorSystem.test.ts)

## 💡 Tips & Tricks

### 1. Testing Badge Unlocks

```typescript
// Quickly test badge unlocking
for (let i = 0; i < 5; i++) {
  await updateReputation(auditor, 'flag_validated')
}
const rep = getReputation(auditor)
checkAndUnlockBadges(auditor, rep)
// Should unlock Watchdog badge
```

### 2. Exporting Data

```typescript
// Export refund logs to CSV
const logs = getRefundLogs()
const csv = logs.map(log => [
  log.requester,
  log.status,
  log.confirmationTime.toISOString(),
  log.refundTx,
  log.amount || '',
  log.chain || ''
].join(',')).join('\n')

// Download
const blob = new Blob([csv], { type: 'text/csv' })
const url = URL.createObjectURL(blob)
```

### 3. Real-time Updates

```typescript
// Polling example
setInterval(() => {
  const logs = getRefundLogs()
  const rep = getReputation(auditorAddress)
  setLogs(logs)
  setReputation(rep)
}, 5000) // Update every 5 seconds
```

### 4. Leaderboard

```typescript
import { getTopContributors } from './src/services/reputationService'

const topAuditors = getTopContributors(10)
topAuditors.forEach((rep, idx) => {
  console.log(`${idx + 1}. ${rep.user}: ${rep.score} points`)
})
```

## 🤝 Need Help?

1. Check the full documentation: [AUDITOR_DASHBOARD.md](./AUDITOR_DASHBOARD.md)
2. Run the demo: `npm run demo:auditor`
3. Review test examples: `tests/auditorSystem.test.ts`
4. Check existing issues on GitHub

---

**Quick Start Complete!** 🎉

You're ready to integrate the Auditor Dashboard into your MeeChain application.
