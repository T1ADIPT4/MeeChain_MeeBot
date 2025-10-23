# Governance API Reference

Quick reference for using the MeeChain DAO governance API endpoints.

## Endpoints

### Create Refund Flag

```typescript
POST /api/logs/flag

Body:
{
  refundId: string,
  requester: string,        // Ethereum address
  transaction: string,      // Transaction hash
  reason: string,
  flaggedBy: string,        // Ethereum address
  signatureVerified?: boolean
}

Response:
{
  success: boolean,
  data?: RefundFlag,
  error?: string
}
```

**Example:**
```typescript
await fetch('/api/logs/flag', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    refundId: 'ref_abc123',
    requester: '0x883AD20a...',
    transaction: '0xabc123...',
    reason: 'Replay failed',
    flaggedBy: '0xFlagger001',
    signatureVerified: true
  })
});
```

### Confirm Flag (Approve/Reject)

```typescript
POST /api/logs/flag/confirm

Body:
{
  refundId: string,
  approved: boolean,
  confirmedBy: string,      // DAO reviewer address
  notes?: string
}

Response:
{
  success: boolean,
  data?: RefundFlag,
  error?: string
}
```

**Example:**
```typescript
await fetch('/api/logs/flag/confirm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    refundId: 'ref_abc123',
    approved: true,
    confirmedBy: '0xDAOReviewer',
    notes: 'Valid flag, confirmed by DAO vote #42'
  })
});
```

### Get All Flags

```typescript
GET /api/logs?status=pending&flaggedBy=0x...

Query Parameters:
- status?: 'pending' | 'approved' | 'rejected'
- flaggedBy?: string (Ethereum address)

Response:
{
  success: boolean,
  data?: RefundFlag[],
  error?: string
}
```

**Example:**
```typescript
// Get all pending flags
const response = await fetch('/api/logs?status=pending');
const result = await response.json();

// Get flags by specific flagger
const response = await fetch('/api/logs?flaggedBy=0xFlagger001');
```

### Get Specific Flag

```typescript
GET /api/logs/:refundId

Response:
{
  success: boolean,
  data?: RefundFlag,
  error?: string
}
```

### Export CSV

```typescript
GET /api/logs/export-csv

Response: CSV string
```

**Example:**
```typescript
const response = await fetch('/api/logs/export-csv');
const csv = await response.text();

// Create download
const blob = new Blob([csv], { type: 'text/csv' });
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'refund-audit.csv';
a.click();
```

### Get All Contributors

```typescript
GET /api/contributors

Response:
{
  success: boolean,
  data?: ContributorStats[],
  error?: string
}
```

### Get Specific Contributor

```typescript
GET /api/contributors/:address

Response:
{
  success: boolean,
  data?: ContributorStats,
  error?: string
}
```

**Example:**
```typescript
const response = await fetch('/api/contributors/0xFlagger001');
const result = await response.json();

console.log(result.data.score);
console.log(result.data.badges);
```

### Get All Badge Definitions

```typescript
GET /api/badges

Response:
{
  success: boolean,
  data?: Badge[],
  error?: string
}
```

## Data Types

### RefundFlag

```typescript
interface RefundFlag {
  refundId: string;
  requester: string;
  transaction: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  flaggedBy: string;
  flaggedAt: Date;
  confirmedBy?: string;
  confirmedAt?: Date;
  notes?: string;
  signatureVerified: boolean;
}
```

### ContributorStats

```typescript
interface ContributorStats {
  address: string;
  name?: string;
  score: number;
  badges: string[];
  actions: ContributorAction[];
  totalFlags: number;
  validatedFlags: number;
  rejectedFlags: number;
}
```

### Badge

```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  threshold: number;
  icon: string;
}
```

### ContributorAction

```typescript
interface ContributorAction {
  timestamp: Date;
  actionType: 'flag_created' | 'flag_validated' | 'flag_rejected' | 'refund_approved' | 'audit_completed';
  context: Record<string, any>;
  scoreImpact: number;
}
```

## Score System

| Action | Points |
|--------|--------|
| Flag Created | +5 |
| Flag Validated | +50 |
| Flag Rejected | -20 |
| Refund Approved | +30 |
| Audit Completed | +20 |

## Badges

### 🛡️ Watchdog
- **Requirement:** 10+ validated flags
- **Description:** Created 10+ validated flags

### 🔍 Truth Seeker
- **Requirement:** 90%+ validation rate with minimum 10 flags
- **Description:** Maintained 90%+ flag validation rate

### 👑 Auditor OG
- **Requirement:** 1000+ reputation score
- **Description:** Reached reputation score of 1000+

## Error Handling

All endpoints return a consistent error format:

```typescript
{
  success: false,
  error: "Error message"
}
```

**Common Errors:**
- `Flag not found` - Invalid refundId
- `Contributor not found` - Invalid address
- `Unknown error` - Internal server error

## Usage with React

### Using SWR (Recommended)

```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

function ContributorProfile({ address }: { address: string }) {
  const { data, error } = useSWR(`/api/contributors/${address}`, fetcher);
  
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>Score: {data.data.score}</h2>
      <ul>
        {data.data.badges.map((badge: string) => (
          <li key={badge}>{badge}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Using useEffect

```typescript
import { useState, useEffect } from 'react';

function FlagList() {
  const [flags, setFlags] = useState([]);
  
  useEffect(() => {
    fetch('/api/logs?status=pending')
      .then(r => r.json())
      .then(result => setFlags(result.data || []))
      .catch(console.error);
  }, []);
  
  return (
    <ul>
      {flags.map(flag => (
        <li key={flag.refundId}>{flag.refundId}</li>
      ))}
    </ul>
  );
}
```

## Integration with Snapshot

### Export Audit Data

1. Export CSV from the dashboard
2. Upload to IPFS or GitHub
3. Link in Snapshot proposal

**Markdown Template:**

```markdown
### Refund Audit Proposal

**ผู้ขอ:** [Requester Address]
**ธุรกรรม:** [View on BscScan](https://bscscan.com/tx/[TX_HASH])
**เหตุผล:** [Reason]
**ลายเซ็น:** ✅ ตรวจสอบแล้ว
**Log CSV:** [Download](https://meechain.xyz/api/logs/export-csv)

[Additional context and voting options]
```

## Development

For development, the API uses in-memory storage. For production:

1. Replace with persistent database (Firestore, PostgreSQL, etc.)
2. Add authentication middleware
3. Implement rate limiting
4. Add CORS configuration
5. Set up proper error logging

## Testing

```bash
# Test reputation service
npm test tests/contributorReputationService.test.ts

# Test refund log service
npm test tests/refundLogService.test.ts

# Run all tests
npm test
```

## Support

For questions or issues, refer to:
- `GOVERNANCE_LOOP_IMPLEMENTATION.md` - Full implementation guide
- `examples/` - Example code and demos
