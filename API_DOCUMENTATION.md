# MeeChain Singapore API - Export Log & DAO Governance Integration

## 🎯 Overview

This API provides comprehensive refund log management and DAO governance integration for MeeChain Singapore. It enables transparent tracking, auditing, and dispute resolution for refund transactions.

## 🚀 Quick Start

### Starting the API Server

```bash
# Install dependencies
npm install

# Start the API server
npm run api:start

# For development with auto-reload (requires nodemon)
npm run api:dev
```

The API will be available at `http://localhost:3001`

### Environment Variables

```bash
PORT=3001  # Optional, defaults to 3001
```

## 📡 API Endpoints

### Health Check

**GET** `/health`

Check if the API server is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-19T21:17:03.825Z",
  "service": "MeeChain Singapore API"
}
```

---

### Export Logs to CSV

**GET** `/api/logs/export-csv`

Export all refund logs as a CSV file for auditing purposes.

**Response:**
- Content-Type: `text/csv`
- Downloads file: `meechain_refund_logs.csv`

**CSV Fields:**
- `refundId` - Unique identifier for the refund
- `userAddress` - Wallet address of the user
- `txHash` - Original transaction hash
- `amount` - Refund amount
- `status` - Current status (pending/verified/refunded/failed)
- `verifiedAt` - Timestamp when verified
- `refundTxHash` - Refund transaction hash
- `reason` - Reason for refund
- `executedBy` - Address of validator who executed
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

**Example Usage:**
```javascript
// Download CSV file
fetch('http://localhost:3001/api/logs/export-csv')
  .then(response => response.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'meechain_refund_logs.csv'
    a.click()
  })
```

---

### Get All Refund Logs

**GET** `/api/logs`

Retrieve all refund logs in JSON format.

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "refundId": "refund-001",
      "userAddress": "0x883AD20a1B9F8DE54C088B6c85329EE9fA58cf33",
      "txHash": "0xabc123def456...",
      "amount": "1.5",
      "status": "verified",
      "verifiedAt": "2025-10-18T13:35:00Z",
      "refundTxHash": "0xrefund123...",
      "reason": "Replay failed",
      "executedBy": "0xValidator001",
      "createdAt": "2025-10-18T13:00:00Z",
      "updatedAt": "2025-10-18T13:35:00Z"
    }
  ]
}
```

---

### Get Specific Refund Log

**GET** `/api/logs/:refundId`

Retrieve a specific refund log with associated flags.

**Parameters:**
- `refundId` (path) - The refund ID to retrieve

**Response:**
```json
{
  "success": true,
  "data": {
    "refundId": "refund-001",
    "userAddress": "0x883AD20a1B9F8DE54C088B6c85329EE9fA58cf33",
    "txHash": "0xabc123def456...",
    "amount": "1.5",
    "status": "verified",
    "flags": []
  }
}
```

---

### Create New Refund Log

**POST** `/api/logs`

Create a new refund log entry.

**Request Body:**
```json
{
  "refundId": "refund-004",
  "userAddress": "0x123...",
  "txHash": "0xabc...",
  "amount": "2.5",
  "status": "pending",
  "reason": "Transaction failed"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "refundId": "refund-004",
    "userAddress": "0x123...",
    "txHash": "0xabc...",
    "amount": "2.5",
    "status": "pending",
    "reason": "Transaction failed",
    "createdAt": "2025-10-19T21:17:03.825Z",
    "updatedAt": "2025-10-19T21:17:03.825Z"
  }
}
```

---

### Update Refund Log

**PUT** `/api/logs/:refundId`

Update an existing refund log.

**Parameters:**
- `refundId` (path) - The refund ID to update

**Request Body:**
```json
{
  "status": "verified",
  "verifiedAt": "2025-10-19T21:17:03.825Z",
  "executedBy": "0xValidator123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "refundId": "refund-004",
    "status": "verified",
    "verifiedAt": "2025-10-19T21:17:03.825Z",
    "executedBy": "0xValidator123",
    "updatedAt": "2025-10-19T21:17:04.000Z"
  }
}
```

---

### Flag Refund Log (Dispute System)

**POST** `/api/logs/flag`

Flag a refund log for review by auditors or DAO members.

**Request Body:**
```json
{
  "refundId": "refund-001",
  "reason": "Suspicious transaction pattern",
  "flaggedBy": "0xAuditor001"
}
```

**Response:**
```json
{
  "success": true,
  "status": "flagged",
  "data": {
    "refundId": "refund-001",
    "reason": "Suspicious transaction pattern",
    "flaggedBy": "0xAuditor001",
    "flaggedAt": "2025-10-19T21:17:03.825Z",
    "status": "open"
  }
}
```

---

### Get All Flags

**GET** `/api/logs/flags/all`

Retrieve all dispute flags across all refund logs.

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "refundId": "refund-003",
      "reason": "Suspicious transaction pattern",
      "flaggedBy": "0xAuditor001",
      "flaggedAt": "2025-10-19T16:00:00Z",
      "status": "open"
    }
  ]
}
```

---

### Get Flags for Specific Refund

**GET** `/api/logs/:refundId/flags`

Retrieve all flags for a specific refund log.

**Parameters:**
- `refundId` (path) - The refund ID to get flags for

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "refundId": "refund-003",
      "reason": "Suspicious transaction pattern",
      "flaggedBy": "0xAuditor001",
      "flaggedAt": "2025-10-19T16:00:00Z",
      "status": "open"
    }
  ]
}
```

---

## 🎨 Auditor Dashboard

### Accessing the Dashboard

The Auditor Dashboard is a React component that provides a user-friendly interface for managing refund logs.

**Import and Use:**
```tsx
import AuditorDashboard from './src/pages/auditor/AuditorDashboard'

function App() {
  return <AuditorDashboard />
}
```

### Dashboard Features

1. **📊 Statistics Overview**
   - Total refunds
   - Pending refunds
   - Verified refunds
   - Flagged refunds

2. **📋 Refund Log Table**
   - View all refund logs
   - Status indicators with emojis
   - Flag warnings for disputed refunds
   - Transaction links to BscScan

3. **🚩 Flag System**
   - Flag suspicious refunds
   - Add reasons for disputes
   - Track auditor identity

4. **📝 DAO Proposal Generation**
   - One-click proposal creation
   - Auto-formatted for Snapshot
   - Copy to clipboard functionality

5. **📥 Export Functionality**
   - Download all logs as CSV
   - For audit trails and governance

### Environment Variables for Dashboard

```bash
REACT_APP_API_URL=http://localhost:3001
```

---

## 🧠 DAO Governance Integration

### Snapshot Proposal Template

When you click "Create Proposal" in the dashboard, it generates a Snapshot-ready proposal:

```markdown
### Refund Audit Proposal

**ผู้ขอ:** 0x883AD20a1B9F8DE54C088B6c85329EE9fA58cf33
**ธุรกรรม:** [ดูบน BscScan](https://bscscan.com/tx/0xabc123def456...)
**เหตุผล:** Replay failed
**สถานะ:** verified
**เวลายืนยัน:** 18/10/2025 13:35
**ธุรกรรม refund:** [0xrefund123...](https://bscscan.com/tx/0xrefund123...)
**Log:** [ดาวน์โหลด CSV](http://localhost:3001/api/logs/export-csv)

ขอให้ DAO รับรองการคืนเหรียญและบันทึกในระบบ governance
```

### Workflow for DAO Members

1. **Review Refund Request**
   - Access Auditor Dashboard
   - Review refund details
   - Check transaction on BscScan

2. **Flag if Necessary**
   - Click "Flag" button if suspicious
   - Provide detailed reason
   - Track with auditor address

3. **Create DAO Proposal**
   - Click "Proposal" button
   - Proposal text copied to clipboard
   - Paste into Snapshot or governance platform

4. **Export Logs**
   - Download CSV for detailed audit
   - Share with DAO members
   - Attach to proposals as evidence

---

## 🧪 Testing

Run the test suite:

```bash
npm test tests/api.test.ts
```

### Test Coverage

- ✅ RefundLog CRUD operations
- ✅ RefundFlag operations
- ✅ Data validation
- ✅ Sample data initialization
- ✅ CSV export data preparation
- ✅ DAO proposal generation

---

## 🛡️ Security Considerations

### Current Implementation (Demo)

The current implementation uses in-memory storage for demonstration purposes. This is **NOT suitable for production**.

### Production Recommendations

1. **Database Integration**
   - Replace in-memory storage with MongoDB or PostgreSQL
   - Add proper indexing for performance
   - Implement data persistence

2. **Authentication & Authorization**
   - Add JWT or OAuth2 authentication
   - Implement role-based access control (RBAC)
   - Restrict sensitive endpoints to authorized users

3. **Rate Limiting**
   - Implement rate limiting to prevent abuse
   - Use libraries like `express-rate-limit`

4. **Input Validation**
   - Add comprehensive input validation
   - Use libraries like `joi` or `zod`
   - Sanitize all user inputs

5. **Audit Trail**
   - Log all API access and changes
   - Track who made changes and when
   - Integrate with external logging service

---

## 📦 Data Models

### RefundLog

```typescript
interface RefundLog {
  refundId: string
  userAddress: string
  txHash: string
  amount: string
  status: 'pending' | 'verified' | 'refunded' | 'failed'
  verifiedAt?: string
  refundTxHash?: string
  reason?: string
  executedBy?: string
  createdAt: string
  updatedAt: string
}
```

### RefundFlag

```typescript
interface RefundFlag {
  refundId: string
  reason: string
  flaggedBy: string
  flaggedAt: string
  status: 'open' | 'resolved' | 'dismissed'
  resolvedAt?: string
  resolvedBy?: string
  resolution?: string
}
```

---

## 🔄 Workflow Example

### Complete Refund Audit Workflow

```javascript
// 1. User requests refund (external system creates log)
const response = await fetch('http://localhost:3001/api/logs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    refundId: 'refund-123',
    userAddress: '0xUser123...',
    txHash: '0xOriginalTx...',
    amount: '5.0',
    status: 'pending',
    reason: 'Transaction timeout'
  })
})

// 2. Auditor reviews and flags if needed
await fetch('http://localhost:3001/api/logs/flag', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    refundId: 'refund-123',
    reason: 'Need additional verification',
    flaggedBy: '0xAuditor...'
  })
})

// 3. Validator verifies and approves
await fetch('http://localhost:3001/api/logs/refund-123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'verified',
    verifiedAt: new Date().toISOString(),
    executedBy: '0xValidator...'
  })
})

// 4. Export logs for DAO proposal
const csvResponse = await fetch('http://localhost:3001/api/logs/export-csv')
const blob = await csvResponse.blob()
// Download and attach to proposal
```

---

## 🎓 Best Practices

### For Auditors

1. Always review transaction details on BscScan
2. Flag suspicious patterns immediately
3. Provide detailed reasons for flags
4. Export CSV regularly for backup

### For DAO Members

1. Review flagged items first
2. Check audit trail before voting
3. Verify validator signatures
4. Keep proposal templates consistent

### For Developers

1. Use TypeScript for type safety
2. Handle errors gracefully
3. Log all important operations
4. Test thoroughly before deployment

---

## 📞 Support

For issues or questions:
- GitHub Issues: [Repository Issues](https://github.com/T1ADIPT4/MeeChain_MeeBot/issues)
- Documentation: This file and other `.md` files in the repository

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

Built for MeeChain Singapore with ❤️ for transparent and auditable refund management.
