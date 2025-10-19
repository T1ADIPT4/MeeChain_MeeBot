# 🚀 Auditor Dashboard - Quick Start Guide

## 📖 What is it?

The Auditor Dashboard is a **comprehensive monitoring system** for MeeChain refund transactions, providing transparency, security, and accountability.

## 🎯 Key Features

```
┌─────────────────────────────────────────────────────────┐
│         🔍 MeeChain Auditor Dashboard                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 Monitor    │  🔍 Search    │  🚨 Flag    │  📄 Export  │
│  Refunds       │  Filter       │  Suspicious │  CSV       │
│                │                │  Logs       │            │
└─────────────────────────────────────────────────────────┘
```

- ✅ **Real-time Monitoring** - See all refund transactions
- 🔍 **Smart Search** - Find by address, TX hash, or refund ID
- 📅 **Date Filtering** - Filter logs by date range
- 🚨 **Flag System** - Report suspicious transactions
- 🔔 **Notifications** - Discord alerts for flagged logs
- 📄 **CSV Export** - Download logs for analysis

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Backend
```bash
npm run server
```
✅ Server running at `http://localhost:3001`

### Step 3: Start the Frontend
```bash
# In a new terminal
npm run dev
```
✅ Dashboard at `http://localhost:5173/auditor-dashboard`

## 🎬 Try the Demo

```bash
npm run demo:auditor
```

This will demonstrate:
- ✅ API health check
- ✅ Fetching refund logs
- ✅ Searching transactions
- ✅ Filtering by date
- ✅ Flagging suspicious logs
- ✅ Retrieving flags

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │ Logs Table   │  │ Log Details  │     │
│  │   Page       │  │  Component   │  │  Component   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│         └─────────────────┴──────────────────┘              │
│                           │                                 │
│                    Fetch API Calls                          │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  REST API      │
                    │  (Express.js)  │
                    │  Port 3001     │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼─────┐      ┌─────▼──────┐     ┌─────▼──────┐
   │ Database │      │ Notification│     │  Logging   │
   │ (Memory) │      │  (Discord)  │     │  System    │
   └──────────┘      └────────────┘     └────────────┘
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API status |
| GET | `/api/logs` | Get all refund logs |
| GET | `/api/logs/:refundId` | Get specific log |
| GET | `/api/logs/search/:query` | Search logs |
| GET | `/api/logs/filter/date` | Filter by date range |
| POST | `/api/logs/flag` | Flag a log |
| GET | `/api/flags` | Get all flags |
| GET | `/api/flags/:refundId` | Get flags for refund |

## 🔔 Discord Notifications

Enable Discord alerts:

1. Create webhook in your Discord server
2. Copy the webhook URL
3. Add to `.env`:
   ```bash
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/yyy
   ```
4. Restart the server

When a log is flagged, you'll receive:
```
🚨 Refund Log Flagged

Refund ID: ref_abc123
Reason: Suspicious transaction
Flagged By: 0x1234...
Time: 2025-10-19T13:35:00Z
```

## 📱 UI Preview

### Dashboard View
```
┌────────────────────────────────────────────────────────┐
│ 🔍 MeeChain Auditor Dashboard                          │
├────────────────────────────────────────────────────────┤
│                                                        │
│ 🔍 Search: [____________]  [Search]                    │
│ 📅 Start Date: [____] End Date: [____]                 │
│ [📄 Export CSV]                                        │
│                                                        │
│ 📋 Refund Logs Table                                   │
│ ┌──────────────────────────────────────────────────┐  │
│ │ Address   │ ID        │ Status │ Amount │ TxHash│  │
│ ├──────────────────────────────────────────────────┤  │
│ │ 0x883A... │ ref_abc.. │ ✅     │ 0.0083 │ 0xab..│  │
│ │ 0x9fB2... │ ref_xyz.. │ ❌     │ 0.0125 │   -   │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ 📄 Selected Log Details                                │
│ ┌──────────────────────────────────────────────────┐  │
│ │ Refund ID: ref_abc123                            │  │
│ │ TxHash: 0xabc123...                              │  │
│ │ Amount: 0.0083595 BNB                            │  │
│ │ Status: ✅ SUCCESS                               │  │
│ │ Signature: ✅ Valid                              │  │
│ │ [🚨 Flag This Log]                                │  │
│ └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Auditor Tests Only
```bash
npm test tests/auditorDashboard.test.ts
```

**Test Results:**
- ✅ 14/14 tests passing
- ✅ Database operations
- ✅ Search & filtering
- ✅ Flag management
- ✅ Data integrity

## 📚 Sample Data

The system includes 3 sample refund logs:

1. **ref_abc123** (Success)
   - Address: 0x883A1234...
   - Amount: 0.0083595 BNB
   - Reason: Replay failed
   - Status: ✅ Success

2. **ref_xyz789** (Failed)
   - Address: 0x9fB21234...
   - Amount: 0.0125000 BNB
   - Reason: Transaction timeout
   - Status: ❌ Failed

3. **ref_def456** (Success)
   - Address: 0x1234567...
   - Amount: 0.0095000 BNB
   - Reason: Network congestion
   - Status: ✅ Success

## 🎯 Common Use Cases

### 1. Search for a User's Refunds
```bash
# In the UI
1. Enter user address in search box
2. Click "Search"
3. View all refunds for that user
```

### 2. Flag a Suspicious Transaction
```bash
# In the UI
1. Click on a log in the table
2. Review details in the right panel
3. Click "🚨 Flag This Log"
4. Enter reason
5. Submit
```

### 3. Export Data for Analysis
```bash
# In the UI
1. Filter logs as needed
2. Click "📄 Export CSV"
3. Open CSV file in Excel/Sheets
```

### 4. Check for Recent Refunds
```bash
# In the UI
1. Set Start Date: 2025-10-19
2. Set End Date: 2025-10-19
3. View today's refunds
```

## 🔧 Troubleshooting

### Server won't start
```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill existing process
kill -9 <PID>

# Restart server
npm run server
```

### Frontend can't connect to API
```bash
# Verify server is running
curl http://localhost:3001/api/health

# Check CORS settings in server/index.ts
```

### Discord notifications not working
```bash
# Check .env file
cat .env | grep DISCORD

# Verify webhook URL is correct
# Test webhook with curl
curl -X POST <WEBHOOK_URL> \
  -H "Content-Type: application/json" \
  -d '{"content": "Test message"}'
```

## 📖 Further Reading

- [AUDITOR_DASHBOARD.md](AUDITOR_DASHBOARD.md) - Complete documentation
- [AUDITOR_DASHBOARD_IMPLEMENTATION.md](AUDITOR_DASHBOARD_IMPLEMENTATION.md) - Technical details
- [README.md](README.md) - Main project documentation

## 🤝 Support

Need help? Check:
1. API demo: `npm run demo:auditor`
2. Test suite: `npm test tests/auditorDashboard.test.ts`
3. Documentation files listed above

## 🎉 That's It!

You're ready to monitor refund transactions like a pro! 🚀

**Quick Commands:**
```bash
npm run server      # Start backend
npm run dev         # Start frontend
npm run demo:auditor # Run demo
npm test           # Run tests
```

---

**Built for MeeChain Singapore** 🌟
สร้างด้วยความใส่ใจเพื่อความโปร่งใสและความปลอดภัย
