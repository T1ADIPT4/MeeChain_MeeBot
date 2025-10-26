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
