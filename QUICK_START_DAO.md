# 🚀 Quick Start: Export Log & DAO Governance System

## 30-Second Setup

```bash
# 1. Install dependencies (one time)
npm install

# 2. Start API server
npm run api:start
```

Server starts at: `http://localhost:3001` ✅

---

## 📡 API Endpoints Cheat Sheet

```bash
# Get all logs
curl http://localhost:3001/api/logs

# Export CSV
curl http://localhost:3001/api/logs/export-csv -o logs.csv

# Flag a refund
curl -X POST http://localhost:3001/api/logs/flag \
  -H "Content-Type: application/json" \
  -d '{"refundId":"refund-001","reason":"Suspicious","flaggedBy":"0xAuditor"}'

# Get all flags
curl http://localhost:3001/api/logs/flags/all
```

---

## 🎨 Dashboard Integration

```tsx
import AuditorDashboard from './src/pages/auditor/AuditorDashboard'

function App() {
  return <AuditorDashboard />
}
```

Configure API URL:
```bash
# .env file
REACT_APP_API_URL=http://localhost:3001
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run API tests only
npm test tests/api.test.ts

# Watch mode
npm test -- --watch
```

Expected: **16/16 tests passing** ✅

---

## 📝 Create a DAO Proposal

1. Open Auditor Dashboard
2. Find the refund log
3. Click **📝 Proposal** button
4. Proposal text copied to clipboard!
5. Paste in Snapshot or your DAO platform

---

## 🚩 Flag a Refund

1. Open Auditor Dashboard
2. Find suspicious refund
3. Click **🚩 Flag** button
4. Enter your address and reason
5. Submit!

---

## 📥 Export Logs

**Option 1: Dashboard**
- Click **Export CSV** button
- File downloads automatically

**Option 2: API**
```bash
curl http://localhost:3001/api/logs/export-csv -o meechain_logs.csv
```

**Option 3: Browser**
- Visit: `http://localhost:3001/api/logs/export-csv`

---

## 🎯 Demo Workflow

```bash
npm run demo:dao-governance
```

This demonstrates:
1. User requests refund
2. Auditor reviews and flags
3. Validator verifies
4. DAO proposal generated
5. Statistics displayed

---

## 📚 Documentation

- **[API Reference](API_DOCUMENTATION.md)** - All endpoints and examples
- **[Dashboard Guide](AUDITOR_DASHBOARD_INTEGRATION.md)** - Integration and customization
- **[System Overview](EXPORT_LOG_SYSTEM.md)** - Complete implementation details
- **[Implementation Summary](IMPLEMENTATION_COMPLETE_DAO.md)** - What was built

---

## 🔧 Common Tasks

### Start Development
```bash
npm run api:start    # Terminal 1: API server
npm run dev          # Terminal 2: React app
```

### View Logs
```bash
curl http://localhost:3001/api/logs | jq
```

### Create Test Refund
```bash
curl -X POST http://localhost:3001/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "refundId": "test-001",
    "userAddress": "0x123...",
    "txHash": "0xabc...",
    "amount": "1.0",
    "status": "pending",
    "reason": "Test refund",
    "createdAt": "2025-10-19T21:00:00Z",
    "updatedAt": "2025-10-19T21:00:00Z"
  }'
```

### Update Refund Status
```bash
curl -X PUT http://localhost:3001/api/logs/test-001 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "verified",
    "verifiedAt": "2025-10-19T21:05:00Z",
    "executedBy": "0xValidator"
  }'
```

---

## ⚡ Troubleshooting

### API Won't Start
```bash
# Check if port 3001 is in use
lsof -i :3001

# Use different port
PORT=3002 npm run api:start
```

### Tests Failing
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Dashboard Not Loading
```bash
# Check API is running
curl http://localhost:3001/health

# Check environment variable
echo $REACT_APP_API_URL
```

### CSV Export Empty
```bash
# Check if logs exist
curl http://localhost:3001/api/logs

# Initialize sample data (API does this automatically on start)
```

---

## 🎓 5-Minute Tutorial

### Step 1: Start API (30 seconds)
```bash
npm run api:start
```
Wait for: `🚀 MeeChain Singapore API Server`

### Step 2: Test Health (10 seconds)
```bash
curl http://localhost:3001/health
```
Should see: `"status": "healthy"`

### Step 3: View Logs (20 seconds)
```bash
curl http://localhost:3001/api/logs
```
Should see: 3 sample refund logs

### Step 4: Export CSV (30 seconds)
```bash
curl http://localhost:3001/api/logs/export-csv -o test.csv
cat test.csv
```
Should see: CSV with headers and data

### Step 5: Flag a Log (30 seconds)
```bash
curl -X POST http://localhost:3001/api/logs/flag \
  -H "Content-Type: application/json" \
  -d '{"refundId":"refund-001","reason":"Testing","flaggedBy":"0xTest"}'
```
Should see: `"status": "flagged"`

### Step 6: Run Demo (60 seconds)
```bash
npm run demo:dao-governance
```
Watch the complete workflow!

### Step 7: Run Tests (60 seconds)
```bash
npm test tests/api.test.ts
```
Should see: **16 passed**

**Total: 4 minutes 30 seconds** ⏱️

---

## 🎯 Key Features

| Feature | Endpoint/Component | Status |
|---------|-------------------|--------|
| CSV Export | `GET /api/logs/export-csv` | ✅ |
| Flag System | `POST /api/logs/flag` | ✅ |
| Dashboard UI | `AuditorDashboard.tsx` | ✅ |
| DAO Proposals | Click "Proposal" button | ✅ |
| BscScan Links | Click "View TX" button | ✅ |
| Statistics | Dashboard cards | ✅ |
| Sample Data | Auto-initialized | ✅ |
| Tests | 16 tests | ✅ |

---

## 📊 Sample Data

The API starts with 3 sample refund logs:

1. **refund-001** - Verified, Replay failed
2. **refund-002** - Refunded, Transaction timeout
3. **refund-003** - Pending, Smart contract error (Flagged)

Use these to test all features!

---

## 🚦 Status Indicators

| Emoji | Status | Description |
|-------|--------|-------------|
| ✅ | verified | Approved by validator |
| ⏳ | pending | Awaiting review |
| 💰 | refunded | Completed |
| ❌ | failed | Rejected |
| 🚩 | flagged | Has disputes |

---

## 💡 Pro Tips

1. **Use jq for pretty JSON**
   ```bash
   curl http://localhost:3001/api/logs | jq
   ```

2. **Auto-reload in development**
   ```bash
   npm run api:dev
   ```

3. **Check logs regularly**
   ```bash
   curl http://localhost:3001/api/logs/flags/all | jq
   ```

4. **Export before making changes**
   ```bash
   curl http://localhost:3001/api/logs/export-csv -o backup.csv
   ```

5. **Test proposal generation**
   - Open dashboard
   - Click any "Proposal" button
   - Check clipboard

---

## 🎉 You're Ready!

Now you can:
- ✅ Manage refund logs
- ✅ Export CSV for audits
- ✅ Flag suspicious refunds
- ✅ Generate DAO proposals
- ✅ Track statistics
- ✅ Integrate with your app

**Need help?** Check the full documentation:
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- [EXPORT_LOG_SYSTEM.md](EXPORT_LOG_SYSTEM.md)

---

**Happy auditing!** 🔍✨
